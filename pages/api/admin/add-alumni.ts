import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, school, department, grade, education, experience, skills, interests } = req.body;

  if (!name || !school || !department || !grade || !education) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  // 組合文字內容（與查詢語句一致，補 skills/interests）
  const skillsText = Array.isArray(skills) ? skills.join('、') : (skills || '');
  const interestsText = Array.isArray(interests) ? interests.join('、') : (interests || '');
  const text = `學長是：${name}，畢業於${school}（${department}），畢業年份或者年級：${grade}，學歷：${education}，經驗：${experience || ''}，技能：${skillsText}，興趣／學術選擇：${interestsText}`;

  // 1. 呼叫 Gemini 產生 embedding
  let embedding: number[] = [];
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
      config: { taskType: "SEMANTIC_SIMILARITY" }
    });
    // Gemini 回傳格式：{ embeddings: [{ values: number[] }] }
    if (Array.isArray(response.embeddings) && response.embeddings.length > 0 && Array.isArray(response.embeddings[0].values)) {
      embedding = response.embeddings[0].values;
    } else if (Array.isArray(response.embeddings)) {
      embedding = response.embeddings as number[];
    } else {
      throw new Error('embedding 格式錯誤');
    }
  } catch (err) {
    console.error('Gemini embedding error:', err);
    return res.status(500).json({ error: '產生 embedding 失敗' });
  }

  // 2. 寫入 Supabase alumni table
  const { error } = await supabase.from('alumni').insert([{
    name, school, department, grade, education, experience,
    resume_content: text,
    embedding,
    interests,
  }]);
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ success: true });
} 