import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional

from rag_engine import RAGEngine
from knowledge_base import KnowledgeBase
from crawler import WebCrawler
from config import BASE_DIR


app = FastAPI(title="AI 产品知识助手", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RAGEngine()


# ============ 数据模型 ============

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    answer: str
    sources: str
    usage: dict


class BuildRequest(BaseModel):
    urls: Optional[List[str]] = None
    cookies: Optional[dict] = None
    extract_children: bool = True


class BuildResponse(BaseModel):
    success: bool
    total: int = 0
    success_count: int = 0
    failed_count: int = 0
    failed_urls: List[str] = []
    error: Optional[str] = None


# ============ API 接口 ============

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """问答接口"""
    result = engine.chat(req.query, history=req.history)
    return ChatResponse(
        answer=result["answer"],
        sources=result["sources"],
        usage=result["usage"],
    )


@app.post("/api/build", response_model=BuildResponse)
def build_knowledge_base(req: BuildRequest = None):
    """构建/重建知识库
    
    支持传入 cookies 用于登录态爬取 KMS。
    如果 extract_children=True，会自动抓取传入 URL 页面中的所有同域下级链接。
    """
    urls = req.urls if req and req.urls else []
    cookies = req.cookies if req and req.cookies else {}
    extract_children = req.extract_children if req else True

    if not urls:
        url_file = BASE_DIR / "urls.txt"
        if url_file.exists():
            urls = [
                line.strip() for line in url_file.read_text(encoding="utf-8").splitlines()
                if line.strip() and not line.startswith("#")
            ]
        else:
            return BuildResponse(success=False, error="没有配置任何网页链接")

    crawler = WebCrawler(cookies=cookies)
    all_urls = set(urls)

    # 提取下级链接
    if extract_children:
        print("[Build] Extracting child links...")
        for url in urls:
            children = crawler.extract_child_links(url)
            all_urls.update(children)
            print(f"[Build] {url} -> {len(children)} child links found")

    all_urls = sorted(all_urls)
    print(f"[Build] Total URLs to crawl: {len(all_urls)}")

    docs = crawler.fetch_all(all_urls, delay=1.5)
    success_docs = [d for d in docs if d["success"]]
    failed = [d for d in docs if not d["success"]]

    kb = KnowledgeBase()
    kb.clear()
    kb.add_documents(success_docs)

    return BuildResponse(
        success=True,
        total=len(all_urls),
        success_count=len(success_docs),
        failed_count=len(failed),
        failed_urls=[d["url"] for d in failed],
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ============ 前端静态页面 ============
frontend_dir = str(BASE_DIR / "frontend")
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")


@app.get("/")
def serve_frontend():
    return FileResponse(str(BASE_DIR / "frontend" / "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
