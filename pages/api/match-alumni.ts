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

    // 1. 取得查詢條件
    const school = fields.school || '';
    const department = fields.department || '';
    const grade = fields.grade || '';
    const education = fields.education || '';
    const experience = fields.experience || '';
    const skills = (fields.skills || '').toString();
    // 組合查詢語句（移除姓名，專注於條件比對）
    const queryText = `期望學校：${school}，期望學系：${department}，年級：${grade}，現時學歷：${education}，經驗：${experience}，技能：${skills}`;

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

    // 4. 先用硬條件過濾（學校、學系），再用 embedding 排序
    let { data, error } = await supabase.rpc('match_alumni_multi_hard_filter', {
      query_embedding: embedding,
      match_count: 3,
      school,
      department
    });
    // 若硬條件查無結果，則退回全表語意排序
    if (!data || data.length === 0) {
      const fallback = await supabase.rpc('match_alumni', {
        query_embedding: embedding,
        match_count: 3
      });
      data = fallback.data;
      error = fallback.error;
    }
    if (error) {
      console.error('Supabase match_alumni error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ alumni: data });
  });
}
