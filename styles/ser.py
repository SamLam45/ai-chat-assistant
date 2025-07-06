from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from vllm import LLM, SamplingParams
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
import torch
import asyncio
import pdfplumber
import docx
import os
from dotenv import load_dotenv
import uuid
import logging
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import re

# 設置日誌記錄
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 初始化 FastAPI 應用
app = FastAPI()

# 設置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://45.78.215.196:8080",
        "https://www.alphadeepmind.com",
        "https://www.alphadeepmind.com/AI_Insurance",
        "https://www.alphadeepmind.com/AI_Insurance/",
        "https://alphadeepmind.com",
        "https://alphadeepmind.com/AI_Insurance",
        "https://alphadeepmind.com/AI_Insurance/",
        "https://api.alphadeepmind.com"  # 添加 API 域名
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 載入環境變數
load_dotenv()
API_KEY = os.getenv("API_KEY", "YourCustomKey123")
model_path = "/mnt/deepmind/DeepSeek-R1-Distill-Qwen-32B"

# 全局變數
llm = None

# 初始化 embedding 模型（建議放在全域，避免重複載入）
embed_model = SentenceTransformer('all-MiniLM-L6-v2')  # 你可換成更適合中文的模型

# 語言檢測函數
def is_chinese(text):
    return any('\u4e00' <= ch <= '\u9fff' for ch in text)

# 模型載入
@app.on_event("startup")
async def load_model():
    global llm
    try:
        # 清理 GPU 記憶體
        torch.cuda.empty_cache()
        
        llm = LLM(
            model=model_path,
            tensor_parallel_size=1,
            max_model_len=8192,
            trust_remote_code=True,
            gpu_memory_utilization=0.5,
            dtype="bfloat16",
            quantization="bitsandbytes"
        )
        logger.info("[INFO] vLLM 模型載入成功。")
    except Exception as e:
        logger.error(f"[ERROR] 載入 vLLM 模型失敗：{e}")
        raise HTTPException(status_code=500, detail="模型初始化失敗")

# 模型卸載
@app.on_event("shutdown")
async def unload_model():
    global llm
    llm = None
    torch.cuda.empty_cache()
    logger.info("[INFO] 模型卸載並清除 CUDA 快取。")

# 文字生成端點
@app.get("/generate")
async def generate(prompt: str, key: str, temperature: float = 0.6, max_tokens: int = 1000):
    if key != API_KEY:
        logger.error("[ERROR] 無效的 API 金鑰")
        raise HTTPException(status_code=403, detail="無效的 API 金鑰")
    
    if len(prompt) > 4000:
        logger.error("[ERROR] 提示詞過長，超過 4000 字元")
        raise HTTPException(status_code=400, detail="提示詞過長，最多 4000 字元")
    
    modified_prompt = prompt
    if "數學" in prompt or "math" in prompt.lower():
        modified_prompt += "\n請逐步推理，最終答案置於 \\boxed{} 中。"
    
    try:
        sampling_params = SamplingParams(
            temperature=0,
            max_tokens=max_tokens,
            top_k=10,
            repetition_penalty=1.03
        )
        outputs = llm.generate([modified_prompt], sampling_params)
        result = outputs[0].outputs[0].text
        logger.info("[INFO] 文字生成成功")
        return {"result": result}
    except Exception as e:
        logger.error(f"[ERROR] 文字生成失敗：{str(e)}")
        raise HTTPException(status_code=500, detail=f"生成失敗：{str(e)}")

# 流式傳輸端點
@app.post("/stream")
async def stream(request: Request):
    try:
        data = await request.json()
        prompt = data.get("prompt")
        key = data.get("key")
        temperature = data.get("temperature", 0.6)
        max_tokens = data.get("max_tokens", 2048)

        if key != API_KEY:
            logger.error("[ERROR] 無效的 API 金鑰")
            raise HTTPException(status_code=403, detail="無效的 API 金鑰")
        if not prompt:
            logger.error("[ERROR] 提示詞為空")
            raise HTTPException(status_code=400, detail="需要提供提示詞")
        if len(prompt) > 4000:
            logger.error("[ERROR] 提示詞過長，超過 4000 字元")
            raise HTTPException(status_code=400, detail="提示詞過長，最多 4000 字元")

        if is_chinese(prompt):
            modified_prompt = (
                "你是一個 AI 助手，請用中文以清晰結構化方式回答，優先使用標題、條列和表格。\n"
                f"問題：{prompt}\n答案："
            )
        else:
            modified_prompt = (
                "You are an AI assistant. Answer in clear, structured markdown format using headers, lists, and tables as needed.\n"
                f"Question: {prompt}\nAnswer:"
            )
        if "數學" in prompt or "math" in prompt.lower():
            modified_prompt += "\n請逐步推理，最終答案置於 \\boxed{} 中。"
        
        sampling_params = SamplingParams(
            temperature=0,
            max_tokens=max_tokens,
            top_k=10,
            repetition_penalty=1.04
        )
        
        async def stream_generator():
            try:
                for output in llm.generate([modified_prompt], sampling_params):
                    text = output.outputs[0].text
                    if '</think>' in text:
                        text = text.split('</think>', 1)[1].strip()
                    if text:
                        yield f"data: {text}\n\n"
                    await asyncio.sleep(0)  # 確保異步順暢
                logger.info("[INFO] 流式傳輸完成")
            except Exception as e:
                logger.error(f"[ERROR] 流式傳輸生成失敗：{str(e)}")
                raise HTTPException(status_code=500, detail=f"流式傳輸失敗：{str(e)}")
        
        return EventSourceResponse(stream_generator())
    except Exception as e:
        logger.error(f"[ERROR] 流式傳輸端點異常：{str(e)}")
        raise HTTPException(status_code=500, detail=f"流式傳輸失敗：{str(e)}")

# 文件處理端點
@app.post("/file-task")
async def file_task(
    file: UploadFile = File(...),
    instruction: str = Form(...),
    key: str = Form(...),
    temperature: float = 0.3,
    max_tokens: int = 1000
):
    if key != API_KEY:
        logger.error("[ERROR] 無效的 API 金鑰")
        raise HTTPException(status_code=403, detail="無效的 API 金鑰")
    try:
        content = await file.read()
        text = ""
        file_ext = file.filename.split('.')[-1].lower()
        temp_file = f"/tmp/uploaded_{uuid.uuid4()}.{file_ext}"
        
        try:
            if file_ext == 'pdf':
                with open(temp_file, "wb") as f:
                    f.write(content)
                with pdfplumber.open(temp_file) as pdf:
                    text = "\n".join(page.extract_text() or '' for page in pdf.pages)
            elif file_ext == 'docx':
                with open(temp_file, "wb") as f:
                    f.write(content)
                doc = docx.Document(temp_file)
                text = "\n".join([p.text for p in doc.paragraphs])
            elif file_ext == 'txt':
                text = content.decode('utf-8', errors='ignore')
            else:
                logger.error(f"[ERROR] 不支援的文件格式：{file_ext}")
                return JSONResponse({"result": "不支援的文件格式，請上傳 PDF、Word 或 TXT。"})
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

        file_size_kb = round(len(content) / 1024, 2)
        file_info = f"{file.filename}\n文件大小: {file_size_kb}KB"
        user_inst = instruction.strip() or ("總結一下" if is_chinese(text[:8000]) else "Summarize")

        text_chunks = [text[i:i+8000] for i in range(0, len(text), 8000)]
        text_to_process = "\n".join(f"段 {i+1}: {chunk}" for i, chunk in enumerate(text_chunks[:2]))

        lang = "zh" if is_chinese(instruction) or is_chinese(text[:8000]) else "en"
        if not instruction.strip():
            if lang == "zh":
                prompt = (
                    f"{file_info}\n{user_inst}\n\n"
                    "你是一個 AI 助手，請用中文以清晰結構化方式回答，優先使用標題、條列和表格。\n"
                    f"文件內容：\n{text_to_process}"
                )
            else:
                prompt = (
                    f"{file_info}\n{user_inst}\n\n"
                    "You are an AI assistant. Answer in clear, structured markdown format using headers, lists, and tables as needed.\n"
                    f"Document content:\n{text_to_process}"
                )
        else:
            if lang == "zh":
                prompt = (
                    f"{file_info}\n{user_inst}\n\n"
                    "你是一個 AI 助手，文件內容如下：\n"
                    f"{text_to_process}\n\n用戶指令：{instruction}\n請根據指令處理文件，只用中文回答。"
                )
            else:
                prompt = (
                    f"{file_info}\n{user_inst}\n\n"
                    "You are an AI assistant. Document content:\n"
                    f"{text_to_process}\n\nUser instruction: {instruction}\nPlease process the document according to the instruction. Only answer in English."
                )

        sampling_params = SamplingParams(
            temperature=0,
            max_tokens=max_tokens,
            top_k=10,
            repetition_penalty=1.03
        )
        outputs = llm.generate([prompt], sampling_params)
        result = outputs[0].outputs[0].text
        if '</think>' in result:
            result = result.split('</think>', 1)[1].strip()
        logger.info("[INFO] 文件處理成功")
        return JSONResponse({"result": result})
    except Exception as e:
        logger.error(f"[ERROR] 文件處理失敗：{str(e)}")
        raise HTTPException(status_code=500, detail=f"文件處理失敗：{str(e)}")

# 智能匹配學系和學校端點
class SmartMatchRequest(BaseModel):
    target_department: str
    target_school: str
    available_departments: list[str]
    available_schools: list[str]
    key: str

@app.post("/smart-match")
async def smart_match_endpoint(req: SmartMatchRequest):
    if req.key != API_KEY:
        raise HTTPException(status_code=403, detail="無效的 API 金鑰")
    
    try:
        # 構建智能匹配提示詞
        prompt = f"""
你是一個專業的學術匹配專家，需要根據用戶的期望學系和學校，從現有的選項中找到最相似的匹配。

用戶期望：
- 學系：{req.target_department}
- 學校：{req.target_school}

現有選項：
- 可用學系：{', '.join(req.available_departments)}
- 可用學校：{', '.join(req.available_schools)}

請分析學系和學校的相似性，並提供最適合的匹配建議。考慮以下因素：
1. 學系名稱的語義相似性（例如：經濟系 ≈ 商學系，計算機科學系 ≈ 資工系）
2. 學校的層級和聲譽相似性
3. 學科領域的相關性

請以 JSON 格式回傳結果，包含：
- "matched_department": 最匹配的學系
- "matched_school": 最匹配的學校
- "department_similarity_score": 學系相似度分數 (0-100)
- "school_similarity_score": 學校相似度分數 (0-100)
- "reasoning": 匹配理由

只回傳 JSON，不要其他文字。
"""
        logger.error(f"[DEBUG] smart-match prompt: {prompt}")
        sampling_params = SamplingParams(
            temperature=0.1,  # 低溫度確保一致性
            max_tokens=500,
            top_k=5,
            repetition_penalty=1.02
        )
        
        outputs = llm.generate([prompt], sampling_params)
        result = outputs[0].outputs[0].text.strip()
        logger.error(f"[DEBUG] smart-match AI原始回傳: {repr(result)}")
        # 1. 去除所有 </think> 標籤
        result = result.replace("</think>", "").strip()
        # 2. 去除 markdown code block
        result = re.sub(r"^(```json|```)[ \t\r\n]*", "", result, flags=re.DOTALL)
        result = re.sub(r"[ \t\r\n]*```$", "", result, flags=re.DOTALL)
        result = result.strip()
        # 嘗試解析 JSON
        import json
        try:
            match_result = json.loads(result)
            logger.info("[INFO] 智能匹配成功")
            return match_result
        except json.JSONDecodeError as e:
            logger.error(f"[ERROR] JSON 解析失敗：{e}")
            logger.error(f"[ERROR] AI回傳內容：{repr(result)}")
            # 如果 JSON 解析失敗，提供備用邏輯
            return {
                "matched_department": req.available_departments[0] if req.available_departments else "",
                "matched_school": req.available_schools[0] if req.available_schools else "",
                "department_similarity_score": 50,
                "school_similarity_score": 50,
                "reasoning": "AI 解析失敗，使用預設匹配"
            }
            
    except Exception as e:
        logger.error(f"[ERROR] 智能匹配失敗：{str(e)}")
        raise HTTPException(status_code=500, detail=f"智能匹配失敗：{str(e)}")

# 學系和學校相似性分析端點
class SimilarityAnalysisRequest(BaseModel):
    query_department: str
    query_school: str
    candidate_departments: list[str]
    candidate_schools: list[str]
    key: str

@app.post("/similarity-analysis")
async def similarity_analysis_endpoint(req: SimilarityAnalysisRequest):
    if req.key != API_KEY:
        raise HTTPException(status_code=403, detail="無效的 API 金鑰")
    
    try:
        # 構建相似性分析提示詞
        prompt = f"""
你是一個學術領域專家，需要分析學系和學校的相似性。

查詢項目：
- 學系：{req.query_department}
- 學校：{req.query_school}

候選項目：
- 候選學系：{', '.join(req.candidate_departments)}
- 候選學校：{', '.join(req.candidate_schools)}

請為每個候選項目評分（0-100），並提供詳細分析：

學系相似性分析：
{chr(10).join([f"- {dept}: 評分理由" for dept in req.candidate_departments])}

學校相似性分析：
{chr(10).join([f"- {school}: 評分理由" for school in req.candidate_schools])}

請以 JSON 格式回傳：
{{
  "department_scores": {{
    "department_name": {{"score": 分數, "reason": "理由"}}
  }},
  "school_scores": {{
    "school_name": {{"score": 分數, "reason": "理由"}}
  }},
  "recommendations": {{
    "best_department": "最佳學系",
    "best_school": "最佳學校",
    "overall_reasoning": "整體建議"
  }}
}}

只回傳 JSON，不要其他文字。
"""
        logger.error(f"[DEBUG] similarity-analysis prompt: {prompt}")
        sampling_params = SamplingParams(
            temperature=0.2,
            max_tokens=800,
            top_k=5,
            repetition_penalty=1.02
        )
        
        outputs = llm.generate([prompt], sampling_params)
        result = outputs[0].outputs[0].text.strip()
        logger.error(f"[DEBUG] similarity-analysis AI原始回傳: {repr(result)}")
        # 1. 去除所有 </think> 標籤
        result = result.replace("</think>", "").strip()
        # 2. 去除 markdown code block
        result = re.sub(r"^(```json|```)[ \t\r\n]*", "", result, flags=re.DOTALL)
        result = re.sub(r"[ \t\r\n]*```$", "", result, flags=re.DOTALL)
        result = result.strip()
        import json
        try:
            analysis_result = json.loads(result)
            logger.info("[INFO] 相似性分析成功")
            return analysis_result
        except json.JSONDecodeError as e:
            logger.error(f"[ERROR] 相似性分析 JSON 解析失敗：{e}")
            logger.error(f"[ERROR] AI回傳內容：{repr(result)}")
            raise HTTPException(status_code=500, detail="相似性分析結果解析失敗")
            
    except Exception as e:
        logger.error(f"[ERROR] 相似性分析失敗：{str(e)}")
        raise HTTPException(status_code=500, detail=f"相似性分析失敗：{str(e)}")

class EmbeddingRequest(BaseModel):
    text: str
    key: str

@app.post("/embedding")
async def embedding_endpoint(req: EmbeddingRequest):
    if req.key != API_KEY:
        raise HTTPException(status_code=403, detail="無效的 API 金鑰")
    try:
        embedding = embed_model.encode([req.text])[0].tolist()
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"embedding 失敗：{str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)