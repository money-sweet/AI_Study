# Knowhow 知识库 API SDK

基于 `digitchat.fanruan.com/dataset/api/v1` 接口的 Python SDK，支持知识库检索（RAG）、文档同步和批量导出。

## 项目结构

```
.
├── knowhow_client.py        # SDK 主文件（API 封装）
├── sync_knowledge_base.py   # 知识库同步脚本
├── rag_search.py            # RAG 检索演示
├── config.py                # 配置文件
├── requirements.txt         # 依赖
└── knowhow_data/            # 同步数据目录（自动创建）
    ├── documents/           # 文档 JSON 文件
    ├── index.json           # 文档索引
    ├── metadata.json        # 元数据汇总
    └── knowhow_export.md    # Markdown 导出
```

## 安装依赖

```bash
pip install -r requirements.txt
```

## 快速开始

### 1. RAG 检索

```python
from knowhow_client import KnowhowClient

client = KnowhowClient(api_key="your-api-key")

# 基础检索
result = client.rag_query("零售行业的成功案例有哪些？", top_k=10)

# 带过滤条件的检索
result = client.rag_query(
    question="数字化转型方案",
    top_k=10,
    industry=["零售"],
    quality="严选"
)
```

### 2. 文档同步

```bash
# 增量同步
python sync_knowledge_base.py
# 选择选项 1

# 全量同步
python sync_knowledge_base.py
# 选择选项 2

# 导出为 Markdown
python sync_knowledge_base.py
# 选择选项 3
```

### 3. 交互式检索

```bash
python rag_search.py --interactive
```

## API 说明

### 检索接口

```python
client.retrieve(
    query="查询内容",
    retrieval_model=RetrievalModel(
        business_domain="project",      # "project" 或 "contract"
        datasets="both",                # "summary" / "chunk" / "both"
        rerank_enable=True,             # 是否启用 Rerank
        top_k=50,                       # 返回数量 (1-500)
        score_threshold=0.5,            # 分数阈值
        vector_weight=0.7,              # 向量权重 (0-1)
        rerank_blend_weight=0.3         # Rerank 混合权重 (0-1)
    ),
    metadata_filters=[
        MetadataFilter("author", "张三", "equals"),
        MetadataFilter("tags", ["零售", "案例"], "containsAny")
    ]
)
```

### 元数据过滤支持

| 字段 | 类型 | 操作符 |
|:---|:---|:---|
| `author` | string | `equals` |
| `customer` | string | `equals` |
| `industry` | string[] | `containsAny`, `in` |
| `products` | string[] | `containsAny`, `in` |
| `quality` | string | `equals` |
| `tags` | string[] | `containsAny`, `in` |
| `node_path` | string[] | `containsAny`, `in` |

### 纯数据过滤（不按向量检索）

```python
result = client.filter_documents(
    metadata_filters=[
        MetadataFilter("quality", "严选", "equals")
    ],
    top_k=100
)
```

### 获取文档详情

```python
doc = client.get_document("doc-uuid")
print(doc["title"])
print(doc["full_summary"])
for chunk in doc["chunks"]:
    print(chunk["content"])
```

## 数据格式

### 检索结果 chunk 结构

```json
{
  "doc_id": "uuid",
  "chunk_id": "uuid_index",
  "title": "文档标题",
  "content": "内容片段",
  "summary": "摘要",
  "score": 0.836,
  "metadata": {
    "author": "作者",
    "customer": "客户名称",
    "quality": "内容质量",
    "tags": ["标签1", "标签2"],
    "industry": ["行业1"],
    "products": ["FineReport", "FineBI"],
    "link": "https://knowhow.fanruan.com/case/...",
    "node_path": ["文件夹1", "文件夹2"]
  }
}
```

### 同步的文档结构

```json
{
  "id": "uuid",
  "title": "文档标题",
  "business_domain": "project",
  "full_summary": "完整摘要",
  "processing_status": "completed",
  "metadata": { ... },
  "chunks": [
    {"index": 0, "content": "...", "page_number": null}
  ],
  "synced_at": "2026-05-18T12:00:00"
}
```

## 环境变量

```bash
export KNOWHOW_API_KEY="your-api-key"
export KNOWHOW_BASE_URL="https://digitchat.fanruan.com/dataset"
export KNOWHOW_SYNC_DIR="./knowhow_data"
```

## 测试

```bash
python test_full_pipeline.py
```
