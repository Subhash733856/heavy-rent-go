-- Create storage bucket for equipment images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'equipment-images',
  'equipment-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS policies for equipment images bucket
CREATE POLICY "Anyone can view equipment images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'equipment-images');

CREATE POLICY "Operators can upload equipment images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'equipment-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND is_operator(auth.uid())
);

CREATE POLICY "Operators can update their equipment images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'equipment-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND is_operator(auth.uid())
);

CREATE POLICY "Operators can delete their equipment images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'equipment-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND is_operator(auth.uid())
);