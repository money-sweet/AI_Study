import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time
from typing import List, Dict
from config import REQUEST_HEADERS, REQUEST_TIMEOUT


class WebCrawler:
    def __init__(self, cookies: Dict[str, str] = None):
        self.session = requests.Session()
        self.session.headers.update(REQUEST_HEADERS)
        if cookies:
            self.session.cookies.update(cookies)
        self.timeout = REQUEST_TIMEOUT

    def fetch(self, url: str) -> Dict:
        """抓取单个网页"""
        try:
            resp = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            resp.raise_for_status()

            # 检测是否是登录页
            if self._is_login_page(resp.text, resp.url):
                return {
                    "url": url,
                    "title": "",
                    "content": "",
                    "success": False,
                    "error": "Page requires login (redirected to login page)",
                }

            # 自动检测编码
            if resp.encoding == "ISO-8859-1":
                resp.encoding = resp.apparent_encoding or "utf-8"

            soup = BeautifulSoup(resp.text, "html.parser")

            # 移除干扰元素
            for tag in soup(["script", "style", "nav", "footer", "aside", "header", "noscript"]):
                tag.decompose()

            title = soup.title.get_text(strip=True) if soup.title else url

            # 优先取正文区域
            main = (
                soup.find("div", {"id": "main-content"})
                or soup.find("article")
                or soup.find("main")
                or soup.find("div", {"class": "wiki-content"})
                or soup.find("div", {"class": "confluence-content"})
                or soup.find("body")
            )

            if main:
                content = main.get_text(separator="\n", strip=True)
            else:
                content = soup.get_text(separator="\n", strip=True)

            # 清洗
            lines = [line.strip() for line in content.splitlines() if line.strip()]
            content = "\n".join(lines)

            return {
                "url": url,
                "title": title,
                "content": content,
                "success": True,
                "error": None,
            }
        except Exception as e:
            return {
                "url": url,
                "title": "",
                "content": "",
                "success": False,
                "error": str(e),
            }

    def _is_login_page(self, html: str, final_url: str) -> bool:
        """简单判断是否是登录页"""
        lower_html = html.lower()
        login_indicators = [
            "login", "登录", "log in", "sign in", " SSO", "身份验证",
            "username", "password", "用户名", "密码",
        ]
        # URL 中包含 login
        if "login" in final_url.lower() or "authenticate" in final_url.lower():
            return True
        # HTML 内容很短且包含登录关键词
        if len(html) < 5000:
            for indicator in login_indicators:
                if indicator in lower_html:
                    return True
        return False

    def extract_child_links(self, url: str, base_domain: str = None) -> List[str]:
        """从页面中提取同域的下级链接"""
        try:
            resp = self.session.get(url, timeout=self.timeout)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")

            parsed_base = urlparse(url)
            if base_domain is None:
                base_domain = f"{parsed_base.scheme}://{parsed_base.netloc}"

            links = set()
            for a in soup.find_all("a", href=True):
                href = a["href"]
                full = urljoin(base_domain, href)
                parsed = urlparse(full)

                # 只保留同域的页面链接
                if parsed.netloc == parsed_base.netloc:
                    # 过滤锚点、附件、动作链接
                    if any(href.endswith(ext) for ext in [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".png", ".jpg"]):
                        continue
                    if "action=attachments" in full or "/download/attachments/" in full:
                        continue
                    # 去锚点
                    clean = full.split("#")[0]
                    links.add(clean)

            return sorted(links)
        except Exception as e:
            print(f"[Crawler] Failed to extract links from {url}: {e}")
            return []

    def fetch_all(self, urls: List[str], delay: float = 1.5) -> List[Dict]:
        results = []
        for i, url in enumerate(urls):
            print(f"[Crawler] [{i+1}/{len(urls)}] Fetching: {url}")
            results.append(self.fetch(url))
            if i < len(urls) - 1:
                time.sleep(delay)
        return results
