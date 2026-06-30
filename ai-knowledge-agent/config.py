import os
from pathlib import Path

# === 路径 ===
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
VECTOR_DB_DIR = DATA_DIR / "chroma_db"
URL_LIST_FILE = BASE_DIR / "urls.txt"
DATA_DIR.mkdir(exist_ok=True)

# === Kimi API (Moonshot) ===
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "")
KIMI_BASE_URL = "https://api.moonshot.cn/v1"
KIMI_MODEL = "moonshot-v1-8k"
KIMI_EMBED_MODEL = "moonshot-v1-embedding"

# === 知识库配置 ===
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100
TOP_K = 5

# === 请求配置（KMS 可能需要 Cookie/Session）===
REQUEST_TIMEOUT = 30
REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}
