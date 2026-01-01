-- Migration: Add exam_date, exam_time, and weightage columns to marks_records
-- Also update constraints to allow optional marks (total_marks and obtained_marks can be 0)

-- 1) Add weightage column if it doesn't exist
ALTER TABLE public.marks_records 
ADD COLUMN IF NOT EXISTS weightage numeric(5,2) DEFAULT 100 CHECK (weightage >= 0 AND weightage <= 100);

-- 2) Add exam_date column (nullable, for scheduling exams before they happen)
ALTER TABLE public.marks_records 
ADD COLUMN IF NOT EXISTS exam_date date;

-- 3) Add exam_time column (nullable, for scheduling exam time)
ALTER TABLE public.marks_records 
ADD COLUMN IF NOT EXISTS exam_time time;

-- 4) Update constraints to allow total_marks and obtained_marks to be 0 (optional marks)
-- First, drop the existing constraint that requires total_marks > 0
ALTER TABLE public.marks_records 
DROP CONSTRAINT IF EXISTS marks_records_total_marks_check;

-- Add new constraint that allows 0 (for optional marks)
ALTER TABLE public.marks_records 
ADD CONSTRAINT check_total_marks_non_negative 
CHECK (total_marks >= 0);

-- 5) Update the percentage generated column to handle division by zero
-- Note: We cannot directly modify a GENERATED column, so we need to:
-- 1. Drop the column
-- 2. Recreate it with the new logic
-- This is safe because percentage is a computed column, not stored data

-- First, check if percentage column exists and drop it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'marks_records' 
    AND column_name = 'percentage'
  ) THEN
    ALTER TABLE public.marks_records DROP COLUMN percentage;
  END IF;
END $$;

-- Recreate it with proper null handling for division by zero
ALTER TABLE public.marks_records 
ADD COLUMN percentage numeric(5,2) GENERATED ALWAYS AS (
  CASE 
    WHEN total_marks > 0 THEN
      ROUND((obtained_marks::numeric / total_marks::numeric) * 100, 2)
    ELSE NULL
  END
) STORED;

-- 6) Add weighted_percentage column (calculated field) - must be after percentage is recreated
ALTER TABLE public.marks_records 
ADD COLUMN IF NOT EXISTS weighted_percentage numeric(5,2) GENERATED ALWAYS AS (
  CASE 
    WHEN percentage IS NOT NULL AND weightage IS NOT NULL THEN
      ROUND((percentage * weightage / 100), 2)
    ELSE NULL
  END
) STORED;

-- 7) Update the check constraint for obtained_marks vs total_marks to handle 0 values
ALTER TABLE public.marks_records 
DROP CONSTRAINT IF EXISTS marks_records_obtained_marks_check;

ALTER TABLE public.marks_records 
ADD CONSTRAINT check_obtained_marks_non_negative 
CHECK (obtained_marks >= 0);

-- Update the combined check constraint
ALTER TABLE public.marks_records 
DROP CONSTRAINT IF EXISTS marks_records_check;

ALTER TABLE public.marks_records 
ADD CONSTRAINT check_marks_valid 
CHECK (
  (total_marks = 0 AND obtained_marks = 0) OR 
  (total_marks > 0 AND obtained_marks >= 0 AND obtained_marks <= total_marks)
);

-- 8) Update the marks_range constraint if it exists
ALTER TABLE public.marks_records 
DROP CONSTRAINT IF EXISTS check_marks_range;

ALTER TABLE public.marks_records 
ADD CONSTRAINT check_marks_range 
CHECK (
  total_marks >= 0 AND 
  obtained_marks >= 0 AND 
  (total_marks = 0 OR obtained_marks <= total_marks)
);

-- 9) Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_marks_exam_date ON public.marks_records(exam_date) WHERE exam_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_marks_weightage ON public.marks_records(weightage) WHERE weightage IS NOT NULL;

-- 10) Add comment for documentation
COMMENT ON COLUMN public.marks_records.weightage IS 'Weightage percentage (0-100) for this exam in the overall subject grade';
COMMENT ON COLUMN public.marks_records.exam_date IS 'Scheduled date for the exam (nullable, can be set before exam is taken)';
COMMENT ON COLUMN public.marks_records.exam_time IS 'Scheduled time for the exam (nullable)';
COMMENT ON COLUMN public.marks_records.weighted_percentage IS 'Calculated weighted percentage (percentage * weightage / 100)';

