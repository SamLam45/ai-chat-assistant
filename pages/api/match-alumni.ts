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

const SMART_MATCH_API_URL = 'https://api.alphadeepmind.com/smart-match';
const EMBEDDING_API_URL = 'https://api.alphadeepmind.com/embedding';
const API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) return res.status(500).json({ error: '檔案上傳失敗' });

    // 只取期望學校、期望學系
    const school = fields.school || '';
    const department = fields.department || '';

    // 查詢所有可用學校/學系
    const { data: allAlumni, error: alumniError } = await supabase
      .from('alumni')
      .select('school, department');
    if (alumniError) return res.status(500).json({ error: '查詢學長資料失敗' });

    const availableSchools = Array.from(new Set(allAlumni.map(a => a.school)));
    const availableDepartments = Array.from(new Set(allAlumni.map(a => a.department)));

    // 呼叫 /smart-match
    const smartMatchRes = await fetch(SMART_MATCH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_school: school,
        target_department: department,
        available_schools: availableSchools,
        available_departments: availableDepartments,
        key: API_KEY
      }),
    });
    const smartMatch = await smartMatchRes.json();

    // 用 AI 標準化條件組合查詢描述
    const queryText = `期望學校：${smartMatch.matched_school}，期望學系：${smartMatch.matched_department}`;

    // 產生 embedding
    const embeddingRes = await fetch(EMBEDDING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: queryText, key: API_KEY }),
    });
    const { embedding } = await embeddingRes.json();

    // 查詢 vector DB
    const match_count = 3;
    const { data, error } = await supabase.rpc('match_alumni_by_vector', {
      query_embedding: embedding,
      match_count
    });
    if (error) return res.status(500).json({ error: error.message });

    // 回傳結果
    res.status(200).json({
      alumni: data,
      smartMatch: {
        originalDepartment: department,
        originalSchool: school,
        matchedDepartment: smartMatch.matched_department,
        matchedSchool: smartMatch.matched_school,
        departmentScore: smartMatch.department_similarity_score,
        schoolScore: smartMatch.school_similarity_score,
        reasoning: smartMatch.reasoning
      }
    });
  });
}
