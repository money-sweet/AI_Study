"""
Knowhow 知识库配置
"""
import os

# API 配置
KNOWHOW_API_KEY = os.getenv("KNOWHOW_API_KEY", "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ")
KNOWHOW_BASE_URL = os.getenv("KNOWHOW_BASE_URL", "https://digitchat.fanruan.com/dataset")

# 同步配置
SYNC_OUTPUT_DIR = os.getenv("KNOWHOW_SYNC_DIR", "./knowhow_data")
SYNC_BATCH_SIZE = int(os.getenv("KNOWHOW_SYNC_BATCH_SIZE", "50"))

# 检索默认配置
DEFAULT_TOP_K = int(os.getenv("KNOWHOW_DEFAULT_TOP_K", "10"))
DEFAULT_BUSINESS_DOMAIN = os.getenv("KNOWHOW_DEFAULT_BUSINESS_DOMAIN", "project")
DEFAULT_DATASETS = os.getenv("KNOWHOW_DEFAULT_DATASETS", "both")
DEFAULT_RERANK_ENABLE = os.getenv("KNOWHOW_DEFAULT_RERANK_ENABLE", "true").lower() == "true"
