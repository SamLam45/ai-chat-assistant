import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';

// Disable Next.js body parsing to allow formidable to handle the stream
export const config = {
    api: {
        bodyParser: false,
    },
};

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const form = formidable({});
        const [fields] = await form.parse(req);

        // 1. Get the user from the access token
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(req.headers.authorization?.split(' ')[1]);
        if (userError || !user) {
            return res.status(401).json({ error: 'Authentication failed: ' + (userError?.message || 'No user found') });
        }
        
        // 2. Parse and validate requirement data
        const requirementDataString = fields.requirements?.[0];
        if (!requirementDataString) {
            return res.status(400).json({ error: 'Requirement data is missing.' });
        }
        const requirements = JSON.parse(requirementDataString);
        const { formData, requiredSkills, preferredSkills, weights } = requirements;

        // 3. 移除檔案上傳與 Gemini 分析
        // 只處理純表單
        // 4. Insert requirement data into the database
        const { data: requirementRecord, error: dbError } = await supabaseAdmin
            .from('requirements')
            .insert({
                user_id: user.id,
                job_title: formData.jobTitle,
                job_description: formData.jobDescription,
                school: formData.school,
                department: formData.department,
                grade: formData.grade,
                experience_requirements: formData.experienceRequirements,
                education_requirements: formData.educationRequirements,
                additional_notes: formData.additionalNotes,
                required_skills: requiredSkills,
                preferred_skills: preferredSkills,
                weights: weights,
                interests: formData.interests,
                other_language: formData.otherLanguage,
                special_wish: formData.specialWish,
                // email: formData.email, // 已移除
                // phone: formData.phone, // 已移除
                // name_en: formData.nameEn, // 已移除
            })
            .select()
            .single();

        if (dbError) {
            console.error('Supabase insert error:', dbError);
            throw new Error(`Database insertion failed: ${dbError.message}`);
        }

        res.status(200).json({ 
            message: 'Requirement submitted successfully.',
            requirementId: requirementRecord.id
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in submit-requirement handler:', error);
            res.status(500).json({ error: error.message });
        } else {
            console.error('Unknown error in submit-requirement handler:', error);
            res.status(500).json({ error: 'Unknown error' });
        }
    }
} 