import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

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

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: '檔案上傳失敗' });

    // 1. 解析履歷檔案內容
    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
    let resumeText = '';
    if (file && file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.filepath);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (file && file.mimetype === 'text/plain') {
      resumeText = fs.readFileSync(file.filepath, 'utf-8');
    }
    // 其他格式可用 textract 處理

    // 2. 組合查詢文字
    const queryText = [
      resumeText,
      fields.school,
      fields.grade,
      fields.education,
      fields.experience,
      (fields.skills || []).toString()
    ].join('\n');

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
