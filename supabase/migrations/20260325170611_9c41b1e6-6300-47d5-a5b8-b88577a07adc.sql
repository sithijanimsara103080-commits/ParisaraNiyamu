
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is any admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

-- Profiles RLS
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles RLS
CREATE POLICY "Admins can read roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Awareness',
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (public.is_admin(auth.uid()));

-- Gallery table
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_items FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update gallery" ON public.gallery_items FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete gallery" ON public.gallery_items FOR DELETE USING (public.is_admin(auth.uid()));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
