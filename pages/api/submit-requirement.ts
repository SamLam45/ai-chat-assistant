import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from "@google/genai";

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

type GeminiExtracted = {
  name?: string;
  email?: string;
  school?: string;
  department?: string;
  grade?: string;
  education?: string;
  [key: string]: unknown;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);

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

        // 3. Handle file uploads to Supabase Storage
        const uploadedCvPaths: { path: string, originalName: string }[] = [];
        const resumeFiles = files.resumes;

        // Gemini AI 分析履歷內容
        let geminiExtracted: GeminiExtracted | { raw?: string; error?: string } | null = null;
        if (resumeFiles && resumeFiles.length > 0) {
            // 只分析第一份履歷
            const file = resumeFiles[0];
            const fileContent = fs.readFileSync(file.filepath);
            // 直接轉 base64
            const base64 = fileContent.toString('base64');
            const mimeType = file.mimetype || 'application/pdf';
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
                const prompt = `請從這份履歷檔案中抽取以下資訊，並以JSON格式回傳：\n{\n  "name": "",\n  "email": "",\n  "school": "",\n  "department": "",\n  "grade": "",\n  "education": ""\n}\n如果找不到某欄位請留空字串。`;
                const response = await ai.models.generateContent({
                  model: 'gemini-1.5-flash',
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        {
                          inlineData: {
                            data: base64,
                            mimeType,
                          },
                        },
                        { text: prompt },
                      ],
                    },
                  ],
                });
                const text = response.text || '';
                try {
                  geminiExtracted = JSON.parse(text);
                } catch {
                  geminiExtracted = { raw: text };
                }
            } catch (e) {
                geminiExtracted = { error: (e as Error).message };
            }
        }

        if (resumeFiles && resumeFiles.length > 0) {
            for (const file of resumeFiles) {
                const fileExt = file.originalFilename?.split('.').pop();
                const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
                
                const fileContent = fs.readFileSync(file.filepath);

                const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                    .from('cv-uploads')
                    .upload(fileName, fileContent, {
                        contentType: file.mimetype!,
                        upsert: false,
                    });

                if (uploadError) {
                    throw new Error(`Failed to upload ${file.originalFilename}: ${uploadError.message}`);
                }
                uploadedCvPaths.push({ path: uploadData.path, originalName: file.originalFilename! });
            }
        } else {
             return res.status(400).json({ error: 'At least one resume file is required.' });
        }
        
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
                uploaded_cv_paths: uploadedCvPaths,
                interests: formData.interests,
                other_language: formData.otherLanguage,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Supabase insert error:', dbError);
            throw new Error(`Database insertion failed: ${dbError.message}`);
        }

        res.status(200).json({ 
            message: 'Requirement submitted successfully.',
            requirementId: requirementRecord.id,
            geminiExtracted
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