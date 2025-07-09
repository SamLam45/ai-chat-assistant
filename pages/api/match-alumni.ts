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
    } catch (e) {
      console.error('Gemini embedding 產生失敗', e);
      return res.status(500).json({ error: 'Gemini embedding 產生失敗' });
    }

    // 查詢 vector DB
    const match_count = 20;
    const { data, error } = await supabase.rpc('match_alumni_by_vector', {
      query_embedding: embedding,
      match_count
    });
    if (error) return res.status(500).json({ error: error.message });

    // 推薦排序（可依需求調整）
    const alumni = Array.isArray(data) ? data : [];
    const recommended = alumni.slice(0, 3);

    res.status(200).json({
      alumni: recommended,
      queryText,
      embeddingLength: embedding.length
    });
  });
}
