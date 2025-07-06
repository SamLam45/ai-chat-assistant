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
const SMART_MATCH_API_URL = 'https://api.alphadeepmind.com/smart-match';
const API_KEY = process.env.DEEPSEEK_API_KEY;

// 獲取所有可用的學系和學校
async function getAvailableDepartmentsAndSchools() {
  const { data: alumni, error } = await supabase
    .from('alumni')
    .select('school, department')
    .not('school', 'is', null)
    .not('department', 'is', null);

  if (error) {
    console.error('Error fetching alumni data:', error);
    return { departments: [], schools: [] };
  }

  const departments = [...new Set(alumni.map(a => a.department))].filter(Boolean);
  const schools = [...new Set(alumni.map(a => a.school))].filter(Boolean);

  return { departments, schools };
}

// 智能匹配學系和學校
async function smartMatchDepartmentAndSchool(targetDepartment: string, targetSchool: string) {
  try {
    const { departments, schools } = await getAvailableDepartmentsAndSchools();
    
    const response = await fetch(SMART_MATCH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_department: targetDepartment,
        target_school: targetSchool,
        available_departments: departments,
        available_schools: schools,
        key: API_KEY
      }),
    });

    if (!response.ok) {
      console.error('Smart match API error:', await response.text());
      return { matchedDepartment: targetDepartment, matchedSchool: targetSchool };
    }

    const result = await response.json();
    return {
      matchedDepartment: result.matched_department || targetDepartment,
      matchedSchool: result.matched_school || targetSchool,
      departmentScore: result.department_similarity_score || 0,
      schoolScore: result.school_similarity_score || 0,
      reasoning: result.reasoning || ''
    };
  } catch (error) {
    console.error('Smart match error:', error);
    return { matchedDepartment: targetDepartment, matchedSchool: targetSchool };
  }
}

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

    // 2. 智能匹配學系和學校
    const { matchedDepartment, matchedSchool, departmentScore, schoolScore, reasoning } = 
      await smartMatchDepartmentAndSchool(department.toString(), school.toString());

    // 3. 組合查詢語句（使用匹配後的學系和學校）
    const queryText = `期望學校：${matchedSchool}，期望學系：${matchedDepartment}，年級：${grade}，現時學歷：${education}，經驗：${experience}，技能：${skills}`;

    // 4. 呼叫 AI 服務產生 embedding
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

    // 5. 先用硬條件過濾（使用匹配後的學系和學校），再用 embedding 排序
    let { data, error } = await supabase.rpc('match_alumni_multi_hard_filter', {
      query_embedding: embedding,
      match_count: 3,
      school: matchedSchool,
      department: matchedDepartment
    });

    // 6. 若硬條件查無結果，則退回全表語意排序
    if (!data || data.length === 0) {
      console.log('No exact matches found, using semantic search');
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

    // 7. 回傳結果，包含智能匹配資訊
    res.status(200).json({ 
      alumni: data,
      smartMatch: {
        originalDepartment: department,
        originalSchool: school,
        matchedDepartment,
        matchedSchool,
        departmentScore,
        schoolScore,
        reasoning
      }
    });
  });
}
