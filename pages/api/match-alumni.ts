import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { IncomingForm } from 'formidable';

export const config = {
  api: { bodyParser: false }
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const EMBEDDING_API_URL = 'https://api.alphadeepmind.com/embedding';
const API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) return res.status(500).json({ error: '檔案上傳失敗' });

    // 1. 解析履歷檔案內容
    // 2. 組合查詢文字（語意豐富版，與學長一致）
    const school = fields.school || '';
    const department = fields.department || '';
    const grade = fields.grade || '';
    const education = fields.education || '';
    const experience = fields.experience || '';
    const skills = (fields.skills || '').toString();
    const name = fields.name || '';
    // 組合成一段自然語言描述（與學長一致）
    const queryText = `學生是：${name}，期望學校：${school}，期望學系：${department}，年級：${grade}，現時學歷：${education}，經驗：${experience}，技能：${skills}`;

    // 3. 呼叫 AI 服務產生 embedding
    const embeddingRes = await fetch(EMBEDDING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: queryText, key: API_KEY }),
    });
    if (!embeddingRes.ok) {
      const errText = await embeddingRes.text();
      console.error('Embedding API error:', errText);
      return res.status(500).json({ error: 'embedding 服務失敗' });
    }
    const { embedding } = await embeddingRes.json();

    // 4. 查詢 supabase alumni 向量表
    const { data, error } = await supabase.rpc('match_alumni', {
      query_embedding: embedding,
      match_count: 3
    });

    if (error) {
      console.error('Supabase match_alumni error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ alumni: data });
  });
}
