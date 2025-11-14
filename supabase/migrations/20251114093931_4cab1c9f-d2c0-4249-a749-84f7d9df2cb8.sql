-- Enable realtime for equipment table so clients see new vehicles immediately
ALTER TABLE public.equipment REPLICA IDENTITY FULL;

-- Add equipment table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment;