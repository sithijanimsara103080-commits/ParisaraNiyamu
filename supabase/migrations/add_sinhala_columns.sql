-- Add Sinhala columns to about_items table
ALTER TABLE public.about_items 
ADD COLUMN IF NOT EXISTS title_si TEXT,
ADD COLUMN IF NOT EXISTS content_si TEXT;

-- Add Sinhala columns to board_members table
ALTER TABLE public.board_members 
ADD COLUMN IF NOT EXISTS name_si TEXT,
ADD COLUMN IF NOT EXISTS position_si TEXT,
ADD COLUMN IF NOT EXISTS bio_si TEXT;

-- Add Sinhala columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS title_si TEXT,
ADD COLUMN IF NOT EXISTS description_si TEXT;

-- Add Sinhala columns to gallery_items table
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS title_si TEXT,
ADD COLUMN IF NOT EXISTS description_si TEXT;

-- Update about_items with Sinhala translations
UPDATE public.about_items 
SET 
  title_si = CASE 
    WHEN title = 'Our Mission' THEN 'අපගේ මෙහෙවර'
    WHEN title = 'Our Vision' THEN 'අපගේ දැක්ම'
    WHEN title = 'Teacher-in-Charge' THEN 'ගුරුවරයා'
    ELSE title
  END,
  content_si = CASE
    WHEN title = 'Our Mission' THEN 'ප්‍රායෝගික ව්‍යාපෘති, ප්‍රජා සහභාගීත්වය සහ තිරසාර භාවිතයන් තුලින් සෑම සිසුවෙකුම පාරිසරික භාරකරුවෙකු වීමට පෙළඹවීම.'
    WHEN title = 'Our Vision' THEN 'වඩාත් හරිතවත් ග්‍රහලෝකයක් වෙනුවෙන් පාරිසරික සවිඥානකත්වය ඉගෙනීමේ සහ එදිනෙදා ජීවිතයේ සෑම අංශයකටම බද්ධ වූ පාසල් ප්‍රජාවක් බිහි කිරීම.'
    WHEN title = 'Teacher-in-Charge' THEN '\"අපගේ සිසුන් හෙට දවසේ පරිසරයේ ආරක්ෂකයින් වේ. මෙම සංගමය හරහා, සැබෑ වෙනසක් ඇති කිරීමට අපි ඔවුන්ව සවිබල ගන්වන්නෙමු.\"'
    ELSE content
  END
WHERE title IN ('Our Mission', 'Our Vision', 'Teacher-in-Charge');

-- Update board_members with Sinhala translations
UPDATE public.board_members
SET
  name_si = name,
  position_si = CASE
    WHEN position = 'President' THEN 'සභාපති'
    WHEN position = 'Vice President' THEN 'උප සභාපති'
    WHEN position = 'Secretary' THEN 'ලේකම්'
    WHEN position = 'Treasurer' THEN 'භාණ්ඩාගාරික'
    WHEN position = 'Event Coordinator' THEN 'සිදුවීම් සංවිධායක'
    WHEN position = 'Media Lead' THEN 'මාධ්‍ය ප්‍රධානී'
    ELSE position
  END;

-- Insert sample events with Sinhala translations
INSERT INTO public.events (title, title_si, category, date, description, description_si)
VALUES
  ('World Environment Day Planting', 'ලෝක පරිසර දිනය සිටුවීම', 'Tree Planting', 'Jun 5, 2025', 'Planted 200 saplings across the school premises.', 'පාසල් භූමිය පුරා පැල 200 සිටුවීම කරන ලදී.'),
  ('Plastic-Free Week', 'ප්‍ලාස්ටික් නැති සතිය', 'Recycling', 'Apr 22, 2025', 'A campus-wide challenge to eliminate single-use plastics.', 'එක් වරක් භාවිතා කරන ප්‍ලාස්ටිక් තුරන් කිරීමේ ගුණ විරෝධී ව්‍යාපාරය.'),
  ('Climate Change Awareness Talk', 'දේශගුණික විපර්යාස දැනුවත්කිරීමේ කතාවලිය', 'Awareness', 'Mar 15, 2025', 'Guest lecture by Dr. Ranil on local climate impacts.', 'ඩොක්ටර් රනිල්ගේ ස්ථානීය දේශගුණික බලපෑම් පිළිබඳ අතිරේක කතාවලිය.');

-- Insert sample gallery items with Sinhala translations
INSERT INTO public.gallery_items (title, title_si, description, description_si, image_url)
VALUES
  ('Tree Planting Day', 'පැල සිටුවීමේ දිනය', 'Students planted 200+ native saplings across the school grounds.', 'සිසුන් පාසල් භූමිය පුරා දේශීය පැල 200 කට වඩා සිටුවනු ලැබීය.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop'),
  ('Beach Cleanup Drive', 'වෙරළ පිරිසිදු කිරීමේ ව්‍යාපාරය', 'Our team collected over 150kg of waste from the local coastline.', 'අපගේ කණ්ඩායම ප්‍රදේශයේ වෙරළ තීරයෙන් අපද්‍රව්‍ය කිලෝග්‍රෑම් 150 කට වඩා එකතු කරන ලදී.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'),
  ('School Garden Project', 'පාසල් උද්‍යාන ව්‍යාපෘතිය', 'The organic garden now supplies fresh produce to the school canteen.', 'කාබනික උද්‍යානය දැන් පාසල් ආපන ශාලාවට නැවුම් නිෂ්පාදන සපයයි.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop');
