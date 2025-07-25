-- Create the requirements table
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    job_title TEXT NOT NULL,
    job_description TEXT,
    school TEXT NOT NULL,
    department TEXT,
    grade TEXT,
    experience_requirements TEXT,
    education_requirements TEXT NOT NULL,
    additional_notes TEXT,
    required_skills TEXT[] NOT NULL,
    preferred_skills TEXT[],
    weights JSONB,
    uploaded_cv_paths JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments to the table and columns
COMMENT ON TABLE public.requirements IS 'Stores student-submitted job/academic requirements for AI evaluation.';
COMMENT ON COLUMN public.requirements.id IS 'Unique identifier for each requirement submission.';
COMMENT ON COLUMN public.requirements.user_id IS 'Foreign key to the user who submitted the requirement.';
COMMENT ON COLUMN public.requirements.job_title IS 'The title of the desired job or academic position.';
COMMENT ON COLUMN public.requirements.job_description IS 'A detailed description of the role.';
COMMENT ON COLUMN public.requirements.school IS 'The desired school or university.';
COMMENT ON COLUMN public.requirements.department IS 'The desired department or major.';
COMMENT ON COLUMN public.requirements.grade IS 'The desired academic grade or year.';
COMMENT ON COLUMN public.requirements.experience_requirements IS 'Text describing required experience.';
COMMENT ON COLUMN public.requirements.education_requirements IS 'Text describing the current education level of the student.';
COMMENT ON COLUMN public.requirements.additional_notes IS 'Any other notes or comments from the student.';
COMMENT ON COLUMN public.requirements.required_skills IS 'Array of essential skills.';
COMMENT ON COLUMN public.requirements.preferred_skills IS 'Array of nice-to-have skills.';
COMMENT ON COLUMN public.requirements.weights IS 'JSON object storing the weights for skills, experience, and education.';
COMMENT ON COLUMN public.requirements.uploaded_cv_paths IS 'JSONB array of Supabase Storage paths for the uploaded CVs.';
COMMENT ON COLUMN public.requirements.created_at IS 'Timestamp of when the record was created.'; 

ALTER TABLE student ADD COLUMN IF NOT EXISTS nameEn TEXT; -- 新增英文姓名欄位 

-- 修改現有 alumni 資料表結構
-- 1. 移除 embedding 欄位
ALTER TABLE alumni DROP COLUMN IF EXISTS embedding;

-- 2. 移除向量索引
DROP INDEX IF EXISTS alumni_embedding_idx;

-- 3. 新增 interests 欄位（如果不存在）
ALTER TABLE alumni ADD COLUMN IF NOT EXISTS interests TEXT[];

-- 4. 確保 RLS 政策存在
DO $$
BEGIN
    -- 檢查是否已存在該政策
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'alumni' 
        AND policyname = 'Admins can manage alumni'
    ) THEN
        -- 建立政策
        CREATE POLICY "Admins can manage alumni"
            ON alumni
            FOR ALL
            USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$; 