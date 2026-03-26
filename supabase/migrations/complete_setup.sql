-- ============================================
-- COMPLETE DATABASE SETUP FOR RADAPASA PROJECT
-- ============================================
-- Run this in Supabase SQL Editor to set up everything

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
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

-- ============================================
-- ABOUT ITEMS TABLE
-- ============================================
CREATE TABLE public.about_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT,
  title TEXT NOT NULL,
  title_si TEXT,
  content TEXT NOT NULL,
  content_si TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.about_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read about" ON public.about_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert about" ON public.about_items FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update about" ON public.about_items FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete about" ON public.about_items FOR DELETE USING (public.is_admin(auth.uid()));

-- Seed about_items
INSERT INTO public.about_items (icon, title, title_si, content, content_si, sort_order) VALUES
('Target', 'Our Mission', 'අපගේ මෙහෙවර', 'To inspire every student to become an environmental steward through hands-on projects, community engagement, and sustainable practices.', 'ප්‍රායෝගික ව්‍යාපෘති, ප්‍රජා සහභාගීත්වය සහ තිරසාර භාවිතයන් තුලින් සෑම සිසුවෙකුම පාරිසරික භාරකරුවෙකු වීමට පෙළඹවීම.', 0),
('Eye', 'Our Vision', 'අපගේ දැක්ම', 'A school community where environmental consciousness is woven into every aspect of learning and daily life.', 'වඩාත් හරිතවත් ග්‍රහලෝකයක් වෙනුවෙන් පාරිසරික සවිඥානකත්වය ඉගෙනීමේ සහ එදිනෙදා ජීවිතයේ සෑම අංශයකටම බද්ධ වූ පාසල් ප්‍රජාවක් බිහි කිරීම.', 1),
('GraduationCap', 'Teacher-in-Charge', 'ගුරු ගිණුම්කරු', '"Our students are the guardians of tomorrow''s environment. Through this unit, we empower them to make real change." — Mrs. Perera', '"අපගේ සිසුන් හෙට දවසේ පරිසරයේ ආරක්ෂකයින් වේ. මෙම සංගමය හරහා, සැබෑ වෙනසක් ඇති කිරීමට අපි ඔවුන්ව සවිබල ගන්වන්නෙමු." — පෙරේරා මිස්'', 2);

-- ============================================
-- BOARD MEMBERS TABLE
-- ============================================
CREATE TABLE public.board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_si TEXT,
  position TEXT NOT NULL,
  position_si TEXT,
  bio TEXT,
  bio_si TEXT,
  image_url TEXT,
  color TEXT NOT NULL DEFAULT 'from-primary to-accent',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read board" ON public.board_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert board" ON public.board_members FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update board" ON public.board_members FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete board" ON public.board_members FOR DELETE USING (public.is_admin(auth.uid()));

-- Seed board_members
INSERT INTO public.board_members (name, name_si, position, position_si, color, sort_order) VALUES
('Kavinda Silva', 'කවින්ද සිල්වා', 'President', 'සභාපති', 'from-primary to-accent', 0),
('Amaya Fernando', 'අමයා ෆර්නාන්ඩෝ', 'Secretary', 'ලේකම්', 'from-primary to-accent', 1),
('Dineth Jayasinghe', 'දිනෙත් ජයසිංහ', 'Treasurer', 'භාණ්ඩාගාරික', 'from-secondary/80 to-gold', 2),
('Nethmi Perera', 'නෙත්මි පෙරේරා', 'Vice President', 'උප සභාපති', 'from-primary to-accent', 3),
('Sahan Bandara', 'සාහාන් බණ්ඩාර', 'Event Coordinator', 'සිදුවීම් සංවිධායක', 'from-secondary/80 to-gold', 4),
('Ishara Kumari', 'ඉශාරා කුමාරි', 'Media Lead', 'මාධ්‍ය ප්‍රධානී', 'from-secondary/80 to-gold', 5);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT,
  category TEXT NOT NULL DEFAULT 'Awareness',
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  description_si TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (public.is_admin(auth.uid()));

-- Seed events
INSERT INTO public.events (title, title_si, category, date, description, description_si) VALUES
('World Environment Day Planting', 'ලෝක පරිසර දිනය සිටුවීම', 'Tree Planting', 'Jun 5, 2025', 'Planted 200 saplings across the school premises.', 'පාසල් භූමිය පුරා පැල 200 සිටුවීම කරන ලදී.'),
('Plastic-Free Week', 'ප්‍ලාස්ටික් නැති සතිය', 'Recycling', 'Apr 22, 2025', 'A campus-wide challenge to eliminate single-use plastics.', 'එක් වරක් භාවිතා කරන ප්‍ලාස්ටික් තුරන් කිරීමේ ගුණ විරෝධී ව්‍යාපාරය.'),
('Climate Change Awareness Talk', 'දේශගුණික විපර්යාස දැනුවත්කිරීමේ කතාවලිය', 'Awareness', 'Mar 15, 2025', 'Guest lecture by Dr. Ranil on local climate impacts.', 'ඩොක්ටර් රනිල්ගේ ස්ථානීය දේශගුණික බලපෑම් පිළිබඳ අතිරේක කතාවලිය.');

-- ============================================
-- GALLERY ITEMS TABLE
-- ============================================
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT,
  description TEXT,
  description_si TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_items FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update gallery" ON public.gallery_items FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete gallery" ON public.gallery_items FOR DELETE USING (public.is_admin(auth.uid()));

-- Seed gallery_items
INSERT INTO public.gallery_items (title, title_si, description, description_si, image_url) VALUES
('Tree Planting Day', 'පැල සිටුවීමේ දිනය', 'Students planted 200+ native saplings across the school grounds.', 'සිසුන් පාසල් භූමිය පුරා දේශීය පැල 200 කට වඩා සිටුවනු ලැබීය.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop'),
('Beach Cleanup Drive', 'වෙරළ පිරිසිදු කිරීමේ ව්‍යාපාරය', 'Our team collected over 150kg of waste from the local coastline.', 'අපගේ කණ්ඩායම ප්‍රදේශයේ වෙරළ තීරයෙන් අපද්‍රව්‍ය කිලෝග්‍රෑම් 150 කට වඩා එකතු කරන ලදී.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'),
('School Garden Project', 'පාසල් උද්‍යාන ව්‍යාපෘතිය', 'The organic garden now supplies fresh produce to the school canteen.', 'කාබනික උද්‍යානය දැන් පාසල් ආපන ශාලාවට නැවුම් නිෂ්පාදන සපයයි.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop'),
('Environmental Awareness Week', 'පාරිසරික දැනුවත් කිරීමේ සතිය', 'Interactive workshops and exhibitions on climate action.', 'දේශගුණික ක්‍රියාකාරකම් පිළිබඳ අන්තර්ක්‍රියාකාරී වැඩමුළු සහ ප්‍රදර්ශන.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop'),
('Butterfly Conservation', 'සමනල සංරක්ෂණය', 'Creating habitats for native butterfly species on campus.', 'විශ්ව විද්‍යාලය තුල දේශීය සමනල විශේෂ සඳහා වාසස්ථාන නිර්මාණය කිරීම.', 'https://images.unsplash.com/photo-1518173946687-a1e0e2a9e57c?w=600&h=400&fit=crop'),
('Nature Trail Expedition', 'ස්වභාවික මංපෙත් ගවේෂණය', 'Exploring local ecosystems and documenting biodiversity.', 'දේශීය පරිසර පද්ධති ගවේෂණය කිරීම සහ ජෛව විවිධත්වය ලේඛනගත කිරීම.', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop');

-- ============================================
-- COMPLETE! All tables and data inserted
-- ============================================
