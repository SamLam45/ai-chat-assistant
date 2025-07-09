import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { IncomingForm } from 'formidable';
import { GoogleGenAI } from "@google/genai";

export const config = {
  api: { bodyParser: false }
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 智能匹配提示詞（Prompt）
const SMART_MATCH_PROMPT = `你是一個履歷智能推薦系統的助手。\n請根據用戶輸入的「特殊需求／願望」欄位，判斷是否包含明確的學校、學歷、年級、科系等條件。\n如果有，請將這些條件以結構化 JSON 格式回傳，欄位包含：school（學校）、education（學歷）、grade（年級）、department（科系），若無則為空字串。\n如果沒有明確條件，請回傳全空字串的 JSON。\n\n範例1：\n用戶輸入：「我想要清華大學學長」\n回傳：{"school": "清華大學", "education": "", "grade": "", "department": ""}\n\n範例2：\n用戶輸入：「我想要碩士學位學長」\n回傳：{"school": "", "education": "碩士", "grade": "", "department": ""}\n\n範例3：\n用戶輸入：「我想要資工系的碩士學長」\n回傳：{"school": "", "education": "碩士", "grade": "", "department": "資工系"}\n\n範例4：\n用戶輸入：「希望學長有實習經驗」\n回傳：{"school": "", "education": "", "grade": "", "department": ""}\n\n請根據下方用戶輸入，回傳結構化 JSON：\n「{specialWish}」`;

// 定義 Alumni 型別（可根據實際欄位擴充）
type Alumni = {
  id: string;
  name: string;
  school: string;
  department: string;
  grade: string;
  education: string;
  experience?: string;
  skills?: string[];
  resume_content?: string;
  embedding?: number[];
  interests?: string[];
  [key: string]: unknown; // ← 這樣 linter 就不會警告
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) return res.status(500).json({ error: '檔案上傳失敗' });

    // 取得用戶查詢條件
    const interests = Array.isArray(fields.interests) ? fields.interests : (fields.interests ? [fields.interests] : []);
    const otherLanguage = Array.isArray(fields.otherLanguage) ? fields.otherLanguage[0] : fields.otherLanguage || '';
    const specialWish = Array.isArray(fields.specialWish) ? fields.specialWish[0] : fields.specialWish || '';

    // 組合語意查詢描述
    const interestsText = (interests || []).join('、');
    const queryText = `興趣／學術選擇：${interestsText}${otherLanguage ? '，其他語言：' + otherLanguage : ''}${specialWish ? '，特殊需求：' + specialWish : ''}`;

    // 1. 先用 Gemini 2.5 Flash 解析特殊需求，產生結構化查詢條件
    let smartMatch = { school: '', education: '', grade: '', department: '' };
    if (specialWish) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
        // 進階提示詞設計：可擴充欄位，或要求回傳 SQL WHERE 子句
        const prompt = SMART_MATCH_PROMPT.replace('{specialWish}', specialWish);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        const text = response.text || '';
        // 嘗試只取第一個 JSON
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          smartMatch = JSON.parse(match[0]);
        }
      } catch { /* 解析失敗則忽略 */ }
    }

    // 2. 若有明確條件，優先查詢完全匹配的學長
    let alumniByCondition: Alumni[] = [];
    if (smartMatch && (smartMatch.school || smartMatch.education || smartMatch.grade || smartMatch.department)) {
      let query = supabase.from('alumni').select('*');
      if (smartMatch.school) query = query.ilike('school', `%${smartMatch.school}%`);
      if (smartMatch.education) query = query.ilike('education', `%${smartMatch.education}%`);
      if (smartMatch.grade) query = query.ilike('grade', `%${smartMatch.grade}%`);
      if (smartMatch.department) query = query.ilike('department', `%${smartMatch.department}%`);
      const { data: alumni, error: _error } = await query;
      if (!_error && Array.isArray(alumni)) {
        alumniByCondition = alumni as Alumni[];
      }
    }

    // 3. 若有完全匹配，直接在這些學長中做興趣交集排序
    let recommended: Alumni[] = [];
    if (alumniByCondition.length > 0 && interests.length > 0) {
      const sorted = alumniByCondition
        .map(a => ({
          ...a,
          _matchCount: Array.isArray(a.interests)
            ? a.interests.filter((i: string) => interests.includes(i)).length
            : 0
        }))
        .sort((a, b) => b._matchCount - a._matchCount);
      recommended = sorted;
    } else if (alumniByCondition.length > 0) {
      recommended = alumniByCondition;
    } else {
      // 4. fallback: embedding 搜尋
      // Gemini 產生 embedding
      let embedding: number[] = [];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
        const response = await ai.models.embedContent({
          model: 'gemini-embedding-exp-03-07',
          contents: queryText,
          config: { taskType: "SEMANTIC_SIMILARITY" }
        });
        if (Array.isArray(response.embeddings) && response.embeddings.length > 0 && Array.isArray(response.embeddings[0].values)) {
          embedding = response.embeddings[0].values;
        }
      } catch {
        return res.status(500).json({ error: 'Gemini embedding 產生失敗' });
      }
      // 用 embedding 查詢
      let embeddingAlumni: Alumni[] = [];
      const { data: embAlumni, error: embError } = await supabase.rpc('match_alumni_by_vector', {
        query_embedding: embedding,
        match_count: 20
      });
      if (!embError && Array.isArray(embAlumni)) {
        embeddingAlumni = embAlumni as Alumni[];
      }
      // 興趣交集排序
      if (interests.length > 0) {
        const sorted = embeddingAlumni
          .map(a => ({
            ...a,
            _matchCount: Array.isArray(a.interests)
              ? a.interests.filter((i: string) => interests.includes(i)).length
              : 0
          }))
          .sort((a, b) => b._matchCount - a._matchCount);
        recommended = sorted;
      } else {
        recommended = embeddingAlumni;
      }
    }

    // 只取前 3 筆
    recommended = recommended.slice(0, 3);

    res.status(200).json({
      alumni: recommended,
      smartMatch,
      queryText
    });
  });
}
