from openai import OpenAI

from config import KIMI_API_KEY, KIMI_BASE_URL, KIMI_MODEL, TOP_K
from knowledge_base import KnowledgeBase


SYSTEM_PROMPT = """你是公司 AI 产品的智能客服助手。请严格根据下面提供的参考资料回答用户问题。

要求：
1. 回答必须基于参考资料，不要编造。
2. 如果参考资料不足以回答问题，请明确告知用户。
3. 答案要简洁、专业、结构化。
4. 在答案末尾附上参考来源的链接。

参考资料：
{context}
"""


class RAGEngine:
    def __init__(self):
        self.kb = KnowledgeBase()
        self.client = OpenAI(
            api_key=KIMI_API_KEY,
            base_url=KIMI_BASE_URL,
        )

    def _build_context(self, hits: list) -> str:
        context_parts = []
        for i, hit in enumerate(hits, 1):
            title = hit["metadata"].get("title", "未知")
            url = hit["metadata"].get("url", "")
            context_parts.append(
                f"[{i}] 标题：{title}\n来源：{url}\n内容：{hit['content']}\n"
            )
        return "\n".join(context_parts)

    def _format_sources(self, hits: list) -> str:
        sources = []
        seen = set()
        for hit in hits:
            url = hit["metadata"].get("url")
            title = hit["metadata"].get("title", "文档")
            if url and url not in seen:
                seen.add(url)
                sources.append(f"- [{title}]({url})")
        return "\n".join(sources)

    def chat(self, query: str, history: list = None) -> dict:
        """执行一次 RAG 问答"""
        hits = self.kb.search(query, top_k=TOP_K)

        context = self._build_context(hits)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT.format(context=context)},
        ]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": query})

        resp = self.client.chat.completions.create(
            model=KIMI_MODEL,
            messages=messages,
            temperature=0.3,
            stream=False,
        )
        answer = resp.choices[0].message.content
        sources_md = self._format_sources(hits)

        return {
            "answer": answer,
            "sources": sources_md,
            "source_chunks": hits,
            "usage": {
                "prompt_tokens": resp.usage.prompt_tokens,
                "completion_tokens": resp.usage.completion_tokens,
            },
        }
