-- Create user_role type
CREATE TYPE user_role AS ENUM ('student', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    role user_role DEFAULT 'student' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, '');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create alumni table
CREATE TABLE IF NOT EXISTS alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                -- 學長姓名
    school TEXT NOT NULL,              -- 畢業學校
    department TEXT NOT NULL,          -- 科系
    grade TEXT NOT NULL,               -- 畢業年級
    education TEXT NOT NULL,           -- 學歷
    experience TEXT,                   -- 經驗
    skills TEXT[],                     -- 技能（可選，陣列）
    resume_content TEXT,               -- 履歷文字內容（可選）
    embedding VECTOR(384),             -- 向量（根據 embedding 維度調整）
    interests TEXT[],                  -- 興趣／學術選擇（可選，陣列）
    created_by UUID REFERENCES profiles(id), -- 建立者
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
