
-- Create table for storing generated study materials
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  study_guide JSONB,
  flashcards JSONB,
  quiz JSONB,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policy
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert and view study materials for now
-- In a production app, you'd want user authentication and permissions
CREATE POLICY "Anyone can view study materials" 
ON public.study_materials FOR SELECT 
TO public
USING (true);

CREATE POLICY "Anyone can insert study materials" 
ON public.study_materials FOR INSERT 
TO public
WITH CHECK (true);
