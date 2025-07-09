import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { interests, otherLanguage, specialWish } = req.body;

  const interestText = (interests || []).map((i: string) =>
    i === 'Other languages' && otherLanguage ? `其他語言：${otherLanguage}` : i
  ).join('、');

  const prompt = `請根據以下學生的興趣、學術選擇與特殊需求，產生一段 2-3 句的中文摘要，語氣親切、簡明，適合用於補習班需求確認頁面。\n\n興趣／學術選擇：${interestText}\n特殊需求／願望：${specialWish || '無'}\n\n請直接回覆摘要內容，不要有多餘說明。`;

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
  const text = response.text || '';
  console.log('Gemini AI 回傳:', text);
  res.status(200).json({ summary: text.trim() });
} 