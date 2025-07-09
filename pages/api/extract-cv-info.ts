import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = formidable({
    multiples: false,
  });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('formidable parse error:', err);
        return res.status(400).json({ error: '檔案解析失敗', detail: err.message });
      }
      const resumeFiles = files.resumes;
      if (!resumeFiles || (Array.isArray(resumeFiles) && resumeFiles.length === 0)) {
        return res.status(400).json({ error: 'No file' });
      }
      // 取得 buffer（直接讀取 tmp 檔案）
      const file: FormidableFile = Array.isArray(resumeFiles) ? resumeFiles[0] : resumeFiles;
      const buffer: Buffer = await fs.promises.readFile(file.filepath);
      const base64 = buffer.toString('base64');
      const mimeType = file.mimetype || 'application/pdf';
      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
      const prompt = `你是一個履歷結構化抽取專家。請你只根據這份履歷內容，抽取以下資訊並以純 JSON 格式回傳（不要有任何多餘說明）：\n{\n  "name": "",\n  "email": "",\n  "phone": "",\n  "school": "",\n  "department": "",\n  "grade": "",\n  "education": ""\n}\n規則：\n- 若找不到某欄位請留空字串。\n- email 請務必抽取出正確的電子郵件格式。\n- phone 請抽取台灣或香港常見格式。\n- grade 請優先抽取「Form X」或「Year X」或「Grade X」等資訊。\n- 請只回傳 JSON，不要有任何多餘文字。`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64, mimeType } },
              { text: prompt },
            ],
          },
        ],
      });
      const text = response.text || '';
      console.log('Gemini 回傳:', text); // debug log
      let geminiExtracted;
      try { geminiExtracted = JSON.parse(text); } catch { geminiExtracted = { raw: text }; }
      res.status(200).json({ geminiExtracted });
    } catch (e) {
      console.error('extract-cv-info error:', e);
      res.status(500).json({ error: (e as Error).message, stack: (e as Error).stack });
    }
  });
} 