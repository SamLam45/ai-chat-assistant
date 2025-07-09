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

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

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

    // Gemini 產生 embedding
    try {
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-exp-03-07',
        contents: queryText,
        config: { taskType: "SEMANTIC_SIMILARITY" }
      });
      // log Gemini 回傳內容與維度
      console.log('[Gemini embedding 回傳]', {
        queryText,
        embeddings: response.embeddings,
        embeddingLength: Array.isArray(response.embeddings) && response.embeddings[0]?.values ? response.embeddings[0].values.length : undefined
      });
    } catch (error: unknown) {
      console.error('Gemini embedding 產生失敗', error);
      return res.status(500).json({ error: 'Gemini embedding 產生失敗' });
    }

    // 1. AI 智能匹配
    let aiMatched: Alumni[] = [];
    let smartMatch = { school: '', education: '', grade: '', department: '' };
    // Debug log: 用戶輸入與解析條件
    console.log('[DEBUG] 用戶特殊需求／願望:', specialWish);
    if (specialWish) {
      try {
        const SMART_MATCH_PROMPT = `你是一個履歷智能推薦系統的助手。\n請根據用戶輸入的「特殊需求／願望」欄位，判斷是否包含明確的學校、學歷、年級、科系等條件。\n如果有，請將這些條件以結構化 JSON 格式回傳，欄位包含：school（學校）、education（學歷）、grade（年級）、department（科系），若無則為空字串。\n如果沒有明確條件，請回傳全空字串的 JSON。\n\n範例1：\n用戶輸入：「我想要清華大學學長」\n回傳：{\"school\": \"清華大學\", \"education\": \"\", \"grade\": \"\", \"department\": \"\"}\n\n範例2：\n用戶輸入：「我想要碩士學位學長」\n回傳：{\"school\": \"\", \"education\": \"碩士\", \"grade\": \"\", \"department\": \"\"}\n\n範例3：\n用戶輸入：「我想要資工系的碩士學長」\n回傳：{\"school\": \"\", \"education\": \"碩士\", \"grade\": \"\", \"department\": \"資工系\"}\n\n範例4：\n用戶輸入：「希望學長有實習經驗」\n回傳：{\"school\": \"\", \"education\": \"\", \"grade\": \"\", \"department\": \"\"}\n\n請根據下方用戶輸入，回傳結構化 JSON：\n「{specialWish}」`;
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
        const prompt = SMART_MATCH_PROMPT.replace('{specialWish}', specialWish);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        const text = response.text || '';
        // 新增 Gemini 回傳原始 text log
        console.log('[DEBUG] Gemini 回傳原始 text:', text);
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          smartMatch = JSON.parse(match[0]);
          // 新增 smartMatch 解析結果 log
          console.log('[DEBUG] smartMatch 解析結果:', smartMatch);
        }
      } catch { /* 解析失敗則忽略 */ }
    }
    if (smartMatch && (smartMatch.school || smartMatch.education || smartMatch.grade || smartMatch.department)) {
      let query = supabase.from('alumni').select('*');
      if (smartMatch.school) query = query.ilike('school', `%${smartMatch.school}%`);
      if (smartMatch.education) query = query.ilike('education', `%${smartMatch.education}%`);
      if (smartMatch.grade) query = query.ilike('grade', `%${smartMatch.grade}%`);
      if (smartMatch.department) query = query.ilike('department', `%${smartMatch.department}%`);
      // Debug log: 查詢條件
      console.log('[DEBUG] AI智能匹配查詢條件:', smartMatch);
      const { data: alumni } = await query;
      if (Array.isArray(alumni)) {
        aiMatched = alumni as Alumni[];
        // Debug log: 查詢結果
        console.log('[DEBUG] AI智能匹配查詢結果:', aiMatched.map(a => ({ id: a.id, name: a.name, school: a.school, interests: a.interests })));
      }
    }

    // 2. 查詢所有學長（for interests 排序備用）
    let allAlumni: Alumni[] = [];
    const { data: allAlumniData } = await supabase.from('alumni').select('*');
    if (Array.isArray(allAlumniData)) {
      allAlumni = allAlumniData as Alumni[];
    }

    // 3. interests 交集排序 function
    function sortByInterests(alumniList: Alumni[], interests: string[], excludeIds: string[] = []) {
      return alumniList
        .filter(a => !excludeIds.includes(a.id))
        .map(a => {
          let arr: string[] = [];
          if (Array.isArray(a.interests)) {
            arr = a.interests;
          } else if (typeof a.interests === 'string' && (a.interests as string).length > 0) {
            try {
              arr = JSON.parse(a.interests as string);
              if (!Array.isArray(arr)) {
                arr = (a.interests as string).split(',').map((s: string) => s.trim());
              }
            } catch {
              arr = (a.interests as string).split(',').map((s: string) => s.trim());
            }
          }
          return {
            ...a,
            interests: arr,
            _matchCount: arr.filter((i: string) => interests.includes(i)).length
          };
        })
        .sort((a, b) => b._matchCount - a._matchCount);
    }

    // 4. 組合推薦名單
    let recommended: Alumni[] = [];
    let aiMatchReasons: string[] = [];
    // Debug log: 最終推薦名單
    // 注意：推薦名單可能包含 AI 匹配與 interests 排序補位
    // 只 log id, name, school, _matchCount
    // eslint-disable-next-line no-console
    setTimeout(() => {
      try {
        console.log('[DEBUG] 最終推薦名單:', recommended.map(a => ({ id: a.id, name: a.name, school: a.school, _matchCount: a._matchCount })));
      } catch {}
    }, 0);
    if (aiMatched.length > 1) {
      // 多於 1 位，直接交集排序取前 3
      recommended = sortByInterests(aiMatched, interests).slice(0, 3);
      aiMatchReasons = recommended.map(a => `${a.name}學長 與您的興趣有 ${a._matchCount} 項相同和是您的「${specialWish}」`);
    } else if (aiMatched.length === 1) {
      // 只有 1 位，先顯示這 1 位，再補 interests 排序
      const first = sortByInterests(aiMatched, interests)[0];
      recommended = [first];
      aiMatchReasons = [`${first.name}學長 與您的興趣有 ${first._matchCount} 項相同和是您的「${specialWish}」`];
      // 查詢 interests 交集排序（排除已出現的 id）
      const more = sortByInterests(allAlumni, interests, [first.id]).slice(0, 2);
      recommended = recommended.concat(more);
      aiMatchReasons = aiMatchReasons.concat(more.map(a => `${a.name}學長 與您的興趣有 ${a._matchCount} 項相同`));
    } else {
      // 沒有 AI 匹配，直接 interests 排序
      recommended = sortByInterests(allAlumni, interests).slice(0, 3);
      aiMatchReasons = recommended.map(a => `${a.name}學長 與您的興趣有 ${a._matchCount} 項相同`);
    }

    res.status(200).json({
      alumni: recommended,
      aiMatchReasons,
      smartMatch,
      queryText
    });
  });
}
