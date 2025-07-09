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
    let embedding: number[] = [];
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
      if (Array.isArray(response.embeddings) && response.embeddings.length > 0 && Array.isArray(response.embeddings[0].values)) {
        embedding = response.embeddings[0].values;
      } else {
        throw new Error('embedding 格式錯誤');
      }
    } catch (error: unknown) {
      console.error('Gemini embedding 產生失敗', error);
      return res.status(500).json({ error: 'Gemini embedding 產生失敗' });
    }

    // 1. 先用 Gemini embedding 搜索特殊需求
    let specialWishAlumni: Alumni[] = [];
    if (specialWish) {
      // 產生特殊需求 embedding
      let wishEmbedding: number[] = [];
      try {
        const wishRes = await ai.models.embedContent({
          model: 'gemini-embedding-exp-03-07',
          contents: specialWish,
          config: { taskType: "SEMANTIC_SIMILARITY" }
        });
        if (Array.isArray(wishRes.embeddings) && wishRes.embeddings.length > 0 && Array.isArray(wishRes.embeddings[0].values)) {
          wishEmbedding = wishRes.embeddings[0].values;
        }
      } catch {
        // fallback: 不做特殊需求語意搜尋
      }
      // 用 wishEmbedding 查詢 alumni
      if (wishEmbedding.length > 0) {
        const { data: wishAlumni, error: wishError } = await supabase.rpc('match_alumni_by_vector', {
          query_embedding: wishEmbedding,
          match_count: 20
        });
        if (!wishError && Array.isArray(wishAlumni)) {
          specialWishAlumni = wishAlumni as Alumni[];
        }
      }
    }

    let recommended: Alumni[] = [];
    if (specialWish && specialWishAlumni.length > 0 && interests.length > 0) {
      // 只在 specialWishAlumni 裡做 interests 交集排序
      const sorted = specialWishAlumni
        .map(a => ({
          ...a,
          _matchCount: Array.isArray(a.interests)
            ? a.interests.filter((i: string) => interests.includes(i)).length
            : 0
        }))
        .sort((a, b) => b._matchCount - a._matchCount);
      recommended = sorted;
    } else if (interests.length > 0) {
      // 沒有特殊需求 fallback 原本的 interests overlaps
      const { data: overlapAlumni, error: overlapError } = await supabase
        .from('alumni')
        .select('*')
        .overlaps('interests', interests);
      if (!overlapError && Array.isArray(overlapAlumni)) {
        const sorted = overlapAlumni
          .map(a => ({
            ...a,
            _matchCount: Array.isArray(a.interests)
              ? a.interests.filter((i: string) => interests.includes(i)).length
              : 0
          }))
          .sort((a, b) => b._matchCount - a._matchCount);
        recommended = sorted;
      } else {
        recommended = [];
      }
    } else {
      // 沒有 interests 查詢時，顯示全部
      const { data: allAlumni } = await supabase.from('alumni').select('*');
      recommended = Array.isArray(allAlumni) ? allAlumni as Alumni[] : [];
    }

    // 只取前 3 筆
    recommended = recommended.slice(0, 3);

    res.status(200).json({
      alumni: recommended,
      queryText,
      embeddingLength: embedding.length
    });
  });
}
