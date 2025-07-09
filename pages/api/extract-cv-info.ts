import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = formidable({});
  const [, files] = await form.parse(req);
  const resumeFiles = files.resumes;
  if (!resumeFiles || resumeFiles.length === 0) return res.status(400).json({ error: 'No file' });

  const file = resumeFiles[0];
  const fileContent = fs.readFileSync(file.filepath);
  const base64 = fileContent.toString('base64');
  const mimeType = file.mimetype || 'application/pdf';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    const prompt = `請從這份履歷檔案中抽取以下資訊，並以JSON格式回傳：\n{\n  "name": "",\n  "email": "",\n  "school": "",\n  "department": "",\n  "grade": "",\n  "education": ""\n}\n如果找不到某欄位請留空字串。`;
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
    let geminiExtracted;
    try { geminiExtracted = JSON.parse(text); } catch { geminiExtracted = { raw: text }; }
    res.status(200).json({ geminiExtracted });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
} 