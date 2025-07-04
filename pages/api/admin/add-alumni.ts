import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// 這裡請根據你的 Deepseek AI 服務實際 IP/Port 調整
const EMBEDDING_API_URL = 'https://api.alphadeepmind.com/embedding';
const API_KEY = process.env.DEEPSEEK_API_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // 用 service key
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, school, department, grade, education, experience } = req.body;

  if (!name || !school || !department || !grade || !education) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  // 組合文字內容（可依需求調整）
  const text = `${name}，畢業於${school}（${department}），年級：${grade}，學歷：${education}，經驗：${experience || ''}`;

  // 1. 呼叫 Deepseek AI 產生 embedding
  let embedding: number[] = [];
  try {
    const embeddingRes = await fetch(EMBEDDING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, key: API_KEY }),
    });
    if (!embeddingRes.ok) {
      const errText = await embeddingRes.text();
      console.error('Embedding API error:', errText);
      throw new Error('embedding 服務失敗');
    }
    const data = await embeddingRes.json();
    embedding = data.embedding;
    if (!embedding || !Array.isArray(embedding)) throw new Error('embedding 格式錯誤');
  } catch (err) {
    console.error('Embedding error:', err);
    return res.status(500).json({ error: '產生 embedding 失敗' });
  }

  // 2. 寫入 Supabase alumni table
  const { error } = await supabase.from('alumni').insert([{
    name,
    school,
    department,
    grade,
    education,
    experience,
    resume_content: text,
    embedding,
    // created_by: 可選
  }]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
} 