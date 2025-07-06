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

const SER_API_URL = 'http://localhost:8000'; // 請根據實際部署調整
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

    // 2. 查詢所有可用學校/學系
    const { data: alumniList, error: alumniError } = await supabase
      .from('alumni')
      .select('school, department');
    if (alumniError) {
      return res.status(500).json({ error: '查詢學長資料失敗' });
    }
    const availableSchools = [...new Set(alumniList.map(a => a.school))].filter(Boolean);
    const availableDepartments = [...new Set(alumniList.map(a => a.department))].filter(Boolean);

    // 3. 語意標準化（呼叫 /smart-match）
    const smartMatchRes = await fetch(`${SER_API_URL}/smart-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_department: department,
        target_school: school,
        available_departments: availableDepartments,
        available_schools: availableSchools,
        key: API_KEY
      })
    });
    const smartMatch = await smartMatchRes.json();

    // 4. 用標準化後的條件組合查詢描述
    const queryText = `期望學校：${smartMatch.matched_school || school}，期望學系：${smartMatch.matched_department || department}，年級：${grade}，現時學歷：${education}，經驗：${experience}，技能：${skills}`;

    // 5. 呼叫 /embedding 產生向量
    const embeddingRes = await fetch(`${SER_API_URL}/embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: queryText, key: API_KEY })
    });
    const { embedding } = await embeddingRes.json();

    // 6. 用向量查詢 Supabase vector DB
    const match_count = 3;
    const { data, error: vectorError } = await supabase.rpc('match_alumni_by_vector', {
      query_embedding: embedding,
      match_count
    });
    if (vectorError) {
      return res.status(500).json({ error: vectorError.message });
    }

    // 7. 回傳結果，包含智能匹配資訊
    res.status(200).json({
      alumni: data,
      smartMatch
    });
  });
}
