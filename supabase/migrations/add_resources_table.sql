-- Add Resources Table to Database
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT,
  description TEXT,
  description_si TEXT,
  resource_type TEXT NOT NULL DEFAULT 'PDF',
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read resources" ON public.resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert resources" ON public.resources FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update resources" ON public.resources FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete resources" ON public.resources FOR DELETE USING (public.is_admin(auth.uid()));

-- Seed sample resources (with real downloadable PDFs)
INSERT INTO public.resources (title, title_si, description, description_si, resource_type, file_url) VALUES
('Eco-Guide 2025', 'ඉකෝ-මාර්ගෝපදේශ 2025', 'Comprehensive guide to sustainable living for students.', 'සිසුන් සඳහා තිරසාර ජීවිතයේ සම්පූර්ණ මාර්ගෝපදේශ.', 'PDF', 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf'),
('Green Magazine Vol. 3', 'හරිත සඟරා Vol. 3', 'Our latest quarterly magazine featuring student stories.', 'සිසුන්ගේ කතා සමන්විත අපගේ සවිස්තර ත්‍රෛමාසික සඟරා.', 'PDF', 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf'),
('Recycling Handbook', 'ප්‍රතිචක්‍රීකරණ අත්පොතිය', 'Step-by-step guide to waste sorting and recycling.', 'අපද්‍රව්‍ය වර්ගීකරණ සහ ප්‍රතිචක්‍රීකරණයට පියවර දර මාර්ගෝපදේශ.', 'PDF', 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf'),
('Carbon Footprint Calculator', 'කාබන් පදිම ගණක යන්ත්‍රය', 'Interactive worksheet to calculate your environmental impact.', 'ඔබගේ පාරිසරික බලපෑම ගණනය කිරීමේ ඉන්ටරැක්ටිව් ගිණුම්පත්‍ර.', 'PDF', 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf');
