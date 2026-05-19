# Confluence MCP 工具完全使用教程

> 本教程详细介绍 Kimi 中 Confluence 集成工具的使用方法，帮助你高效地进行文档的读取、写入和管理。
> 
> **文档位置**: `/Users/jeff/Documents/Obsidian Vault/03-AI工具/01-配置与日志/Confluence-MCP-工具使用教程.md`
> **创建时间**: 2026-04-08

---

## 📋 目录

1. [概述](#概述)
2. [环境配置](#环境配置)
3. [页面操作工具](#页面操作工具)
4. [搜索工具](#搜索工具)
5. [附件管理工具](#附件管理工具)
6. [评论与协作工具](#评论与协作工具)
7. [版本历史工具](#版本历史工具)
8. [实用场景示例](#实用场景示例)

---

## 概述

### 什么是 Confluence MCP 工具？

Confluence MCP (Model Context Protocol) 工具是一套与 Atlassian Confluence 集成的工具集，允许 Kimi 直接与你的 Confluence 实例进行交互，包括：

- 📄 **页面管理**：创建、读取、更新、删除页面
- 🔍 **内容搜索**：使用 CQL (Confluence Query Language) 搜索内容
- 📎 **附件管理**：上传、下载、管理文件附件
- 💬 **评论协作**：添加和回复评论
- 📊 **版本控制**：查看页面历史和差异对比

### 支持的 Confluence 版本

| 版本类型 | 支持状态 | 说明 |
|---------|---------|------|
| **Confluence Cloud** | ✅ 完全支持 | 所有功能可用 |
| **Server/Data Center** | ⚠️ 部分支持 | 部分 API 有差异，如 Analytics 不可用 |

### 你的 Confluence 配置信息

```yaml
Server: https://kms.fineres.com
Space: xingxiao (产品&行业解决方案行销部)
默认父页面ID: 632916624 (jeff-钟珍慧)
认证方式: Personal Access Token (已配置在 MCP 中)
```

---

## 环境配置

### MCP 配置

Confluence 工具通过 MCP (Model Context Protocol) 提供，配置在 `~/.kimi/mcp.json`：

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "CONFLUENCE_URL": "https://kms.fineres.com",
        "CONFLUENCE_TOKEN": "your-personal-access-token",
        "CONFLUENCE_USERNAME": "your-username"
      }
    }
  }
}
```

### 获取 Personal Access Token

**Confluence Cloud**:
1. 登录 Confluence → 点击头像 → 管理账户
2. 安全 → 创建和管理 API 令牌
3. 创建令牌并复制

**Confluence Server/Data Center**:
1. 登录 Confluence → 点击头像 → 设置
2. 个人访问令牌 → 创建令牌

---

## 页面操作工具

### 1. 获取页面内容

**工具**: `confluence_get_page`

#### 通过页面 ID 获取

```python
# 参数说明
{
    "page_id": "123456789",           # 页面ID（URL中的数字）
    "convert_to_markdown": true,      # 转换为 Markdown（推荐）
    "include_metadata": true          # 包含元数据
}
```

**示例** - 获取你的个人页面：
```python
confluence_get_page(
    page_id="632916624",
    convert_to_markdown=true,
    include_metadata=true
)
```

#### 通过标题和空间获取

```python
confluence_get_page(
    title="jeff-钟珍慧",
    space_key="xingxiao",
    convert_to_markdown=true
)
```

**返回内容示例**：
```json
{
  "id": "632916624",
  "title": "jeff-钟珍慧",
  "space": "xingxiao",
  "version": 5,
  "content": "# 页面内容...",
  "created": "2024-01-15T10:30:00.000Z",
  "last_modified": "2024-03-20T14:22:00.000Z"
}
```

---

### 2. 创建页面

**工具**: `confluence_create_page`

#### 基础创建

```python
confluence_create_page(
    space_key="xingxiao",
    title="我的新页面",
    content="# 标题\n\n这是页面内容",
    content_format="markdown"    # 可选: markdown, wiki, storage
)
```

#### 创建子页面

```python
confluence_create_page(
    space_key="xingxiao",
    title="项目文档",
    content="# 项目概述\n\n详细内容...",
    parent_id="632916624",       # 父页面ID
    emoji="📚",                  # 页面图标
    enable_heading_anchors=true   # 启用标题锚点
)
```

#### 内容格式说明

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| `markdown` | Markdown 格式（默认） | 简单内容、快速创建 |
| `wiki` | Confluence Wiki 标记 | 复杂格式、宏支持 |
| `storage` | HTML 存储格式 | 精确控制、高级功能 |

#### 创建带表格的页面

```python
content = """
# 项目进度报告

## 关键指标

| 指标 | 目标 | 实际 | 完成率 |
|------|------|------|--------|
| 销售额 | 100万 | 85万 | 85% |
| 客户数 | 50 | 48 | 96% |

## 风险识别

<span style="color:red">●</span> 高风险：交付延期
<span style="color:orange">●</span> 中风险：资源不足
<span style="color:green">●</span> 低风险：文档更新滞后
"""

confluence_create_page(
    space_key="xingxiao",
    title="2024-Q1项目进度",
    content=content,
    parent_id="632916624"
)
```

---

### 3. 更新页面

**工具**: `confluence_update_page`

#### 基础更新

```python
confluence_update_page(
    page_id="632916624",
    title="更新后的标题",
    content="# 新内容\n\n更新后的内容...",
    is_minor_edit=false,         # 是否为小编辑
    version_comment="更新了项目进度"  # 版本注释
)
```

#### 移动到新的父页面

```python
confluence_update_page(
    page_id="123456789",
    title="页面标题",
    content="内容...",
    parent_id="987654321"        # 新的父页面ID
)
```

---

### 4. 删除页面

**工具**: `confluence_delete_page`

```python
confluence_delete_page(
    page_id="123456789"
)
```

⚠️ **警告**: 删除操作不可恢复，谨慎使用！

---

### 5. 移动页面

**工具**: `confluence_move_page`

#### 移动到另一个父页面下

```python
confluence_move_page(
    page_id="123456789",
    target_parent_id="987654321",
    position="append"            # append, above, below
)
```

#### 移动到另一个空间

```python
confluence_move_page(
    page_id="123456789",
    target_space_key="OTHER",
    position="append"
)
```

---

### 6. 获取子页面

**工具**: `confluence_get_page_children`

```python
confluence_get_page_children(
    parent_id="632916624",
    limit=25,                    # 最多返回数量
    start=0,                     # 起始索引（分页）
    include_folders=true,        # 包含文件夹
    include_content=false        # 是否包含内容
)
```

---

## 搜索工具

### 1. 页面搜索

**工具**: `confluence_search`

#### 简单文本搜索

```python
confluence_search(
    query="项目进度",
    limit=10
)
```

#### CQL 高级搜索

```python
# 搜索特定空间中的页面
confluence_search(
    query='type=page AND space=xingxiao',
    limit=20
)

# 搜索标题包含关键字的页面
confluence_search(
    query='title~"会议纪要"',
    limit=10
)

# 搜索最近修改的内容
confluence_search(
    query='lastModified > startOfWeek()',
    limit=10
)

# 搜索特定标签的内容
confluence_search(
    query='label=documentation',
    limit=10
)
```

#### 常用 CQL 语法

| CQL 表达式 | 说明 |
|-----------|------|
| `type=page` | 只搜索页面 |
| `space=SPACEKEY` | 指定空间 |
| `title~"关键词"` | 标题包含关键词 |
| `text ~ "关键词"` | 内容包含关键词 |
| `creator = currentUser()` | 当前用户创建 |
| `lastModified > startOfWeek()` | 本周修改 |
| `lastModified > startOfMonth("-1M")` | 上月修改 |
| `created >= "2024-01-01"` | 指定日期后创建 |
| `label=documentation` | 包含特定标签 |

---

### 2. 用户搜索

**工具**: `confluence_search_user`

```python
confluence_search_user(
    query='user.fullname ~ "张三"',
    limit=10
)
```

---

## 附件管理工具

### 1. 列出附件

**工具**: `confluence_get_attachments`

```python
confluence_get_attachments(
    content_id="632916624",       # 页面ID
    limit=50,
    filename="report.pdf"         # 可选：按文件名过滤
)
```

---

### 2. 上传附件

**工具**: `confluence_upload_attachment`

#### 单个文件上传

```python
confluence_upload_attachment(
    content_id="632916624",
    file_path="/path/to/document.pdf",
    comment="Q4 2024 季度报告",
    minor_edit=false
)
```

#### 批量上传

```python
confluence_upload_attachments(
    content_id="632916624",
    file_paths="/path/to/file1.pdf,/path/to/file2.png,/path/to/file3.docx",
    comment="项目相关文档",
    minor_edit=true
)
```

---

### 3. 下载附件

**工具**: `confluence_download_attachment`

```python
confluence_download_attachment(
    attachment_id="att123456789"
)
```

获取 attachment_id 的方法：
```python
# 先列出附件
attachments = confluence_get_attachments(content_id="632916624")
# 从返回结果中获取 attachment_id（格式如：att123456789）
```

---

### 4. 下载页面所有图片

**工具**: `confluence_get_page_images`

```python
confluence_get_page_images(
    content_id="632916624"
)
```

---

### 5. 删除附件

**工具**: `confluence_delete_attachment`

```python
confluence_delete_attachment(
    attachment_id="att123456789"
)
```

⚠️ **警告**: 删除后无法恢复！

---

## 评论与协作工具

### 1. 获取评论

**工具**: `confluence_get_comments`

```python
confluence_get_comments(
    page_id="632916624"
)
```

---

### 2. 添加评论

**工具**: `confluence_add_comment`

```python
confluence_add_comment(
    page_id="632916624",
    body="这个分析很有价值，建议补充一些具体数据。"
)
```

---

### 3. 回复评论

**工具**: `confluence_reply_to_comment`

```python
confluence_reply_to_comment(
    comment_id="456789",
    body="感谢反馈，我会补充相关数据。"
)
```

---

### 4. 管理标签

**工具**: `confluence_get_labels`, `confluence_add_label`

#### 获取标签

```python
confluence_get_labels(
    page_id="632916624"
)
```

#### 添加标签

```python
confluence_add_label(
    page_id="632916624",
    name="项目文档"
)

confluence_add_label(
    page_id="632916624",
    name="approved"
)
```

---

## 版本历史工具

### 1. 获取页面历史版本

**工具**: `confluence_get_page_history`

```python
confluence_get_page_history(
    page_id="632916624",
    version=3,                    # 版本号
    convert_to_markdown=true
)
```

---

### 2. 对比版本差异

**工具**: `confluence_get_page_diff`

```python
confluence_get_page_diff(
    page_id="632916624",
    from_version=2,
    to_version=5
)
```

---

### 3. 获取页面浏览统计

**工具**: `confluence_get_page_views`

```python
confluence_get_page_views(
    page_id="632916624",
    include_title=true
)
```

⚠️ **注意**: 此功能仅在 Confluence Cloud 上可用

---

## 实用场景示例

### 场景 1：发布分析报告

**需求**: 将本地分析报告发布到 Confluence，并添加标签

```python
# 步骤1：创建页面
page = confluence_create_page(
    space_key="xingxiao",
    title="2024-Q1业务分析报告",
    content="""
# 2024-Q1业务分析报告

**分析日期**: 2024-04-08  
**分析人**: Jeff

---

## 一、关键指标

| 指标 | Q1实际 | Q1目标 | 完成率 |
|------|--------|--------|--------|
| 销售额 | 850万 | 1000万 | 85% |
| 新客户 | 48 | 50 | 96% |
| 续约率 | 92% | 90% | 102% |

## 二、风险与机会

<span style="color:red">●</span> 高风险：市场竞争加剧，需加快产品迭代
<span style="color:orange">●</span> 中风险：销售人员流动率上升
<span style="color:green">●</span> 机会：AI产品线受到市场热烈反响

## 三、行动计划

1. 加强产品差异化竞争
2. 优化销售团队激励机制
3. 加速AI产品商业化进程
""",
    parent_id="632916624",
    emoji="📊"
)

# 步骤2：添加标签
confluence_add_label(
    page_id=page["id"],
    name="业务分析"
)

confluence_add_label(
    page_id=page["id"],
    name="Q1-2024"
)
```

---

### 场景 2：同步会议纪要

**需求**: 上传会议纪要文档，创建页面并关联文件

```python
# 步骤1：创建会议纪要页面
page = confluence_create_page(
    space_key="xingxiao",
    title="2024-04-08-业务破圈会议-纪要",
    content="""
# 会议纪要：业务破圈专项讨论

**日期**: 2024-04-08  
**时长**: 90分钟  
**记录人**: Kimi

---

## 一、核心内容

### 1. AI产品发布计划
- 发布时间：4月15日
- 目标市场：金融行业
- 核心卖点：与BI产品互补

### 2. 客户攻坚策略
- 西安银行：作为标杆重点突破
- 烟草行业：借助数据大赛扩大影响

## 二、待办事项

| 事项 | 负责人 | 截止时间 | 优先级 |
|------|--------|----------|--------|
| 完成产品演示视频 | 产品经理 | 4月10日 | 高 |
| 准备西安银行方案 | 销售经理 | 4月12日 | 高 |
| 协调数据大赛资源 | 市场经理 | 4月15日 | 中 |

## 三、附件

- 会议录音转写
- 产品演示PPT
""",
    parent_id="632916624"
)

# 步骤2：上传附件
confluence_upload_attachment(
    content_id=page["id"],
    file_path="/path/to/会议录音转写.txt",
    comment="飞书会议转写文件"
)

confluence_upload_attachment(
    content_id=page["id"],
    file_path="/path/to/产品演示.pptx",
    comment="产品演示PPT"
)
```

---

### 场景 3：批量整理文档

**需求**: 整理某个主题下的所有文档

```python
# 步骤1：搜索相关文档
results = confluence_search(
    query='text ~ "AI产品" AND space=xingxiao',
    limit=20
)

# 步骤2：创建一个索引页面
index_content = "# AI产品相关文档索引\n\n"
for page in results["results"]:
    index_content += f"- [{page['title']}](https://kms.fineres.com/pages/viewpage.action?pageId={page['id']})\n"

confluence_create_page(
    space_key="xingxiao",
    title="AI产品文档索引",
    content=index_content,
    parent_id="632916624"
)
```

---

### 场景 4：页面归档流程

**需求**: 将过期的项目页面归档

```python
# 步骤1：搜索过期的项目页面
old_pages = confluence_search(
    query='title~"2023" AND label=项目文档',
    limit=50
)

# 步骤2：创建归档汇总页面
archive_page = confluence_create_page(
    space_key="xingxiao",
    title="2023年项目文档归档",
    content="""
# 2023年项目文档归档

本页面汇总了2023年的所有项目文档，已统一归档处理。

## 归档文档列表

""",
    parent_id="632916624"
)

# 步骤3：移动旧页面到归档目录下
for page in old_pages["results"]:
    confluence_move_page(
        page_id=page["id"],
        target_parent_id=archive_page["id"]
    )
    
# 步骤4：添加归档标签
    confluence_add_label(
        page_id=page["id"],
        name="archived"
    )
```

---

### 场景 5：内容同步更新

**需求**: 更新多个页面中的相同内容

```python
# 搜索包含特定内容的页面
pages = confluence_search(
    query='text ~ "旧产品名称" AND space=xingxiao',
    limit=50
)

# 批量更新
for page_info in pages["results"]:
    # 获取页面内容
    page = confluence_get_page(
        page_id=page_info["id"],
        convert_to_markdown=true
    )
    
    # 替换内容
    new_content = page["content"].replace("旧产品名称", "新产品名称")
    
    # 更新页面
    confluence_update_page(
        page_id=page_info["id"],
        title=page["title"],
        content=new_content,
        is_minor_edit=true,
        version_comment="统一更新产品名称"
    )
```

---

## 故障排查

### 常见问题

#### 1. 创建页面失败

**可能原因**:
- MCP 工具在 Server/Data Center 版本有兼容性问题
- 空间 key 错误
- 权限不足

**解决方案**:
```bash
# 使用 curl 作为备选方案
curl -sL -X POST "https://kms.fineres.com/rest/api/content" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "page",
    "title": "页面标题",
    "space": {"key": "xingxiao"},
    "ancestors": [{"id": 632916624}],
    "body": {"storage": {"value": "<h1>内容</h1>", "representation": "storage"}}
  }'
```

#### 2. 搜索无结果

**检查事项**:
- CQL 语法是否正确
- 空间 key 是否正确
- 是否有搜索权限

#### 3. 附件上传失败

**检查事项**:
- 文件路径是否正确
- 文件大小是否超过限制
- 是否有写入权限

#### 4. 内容格式问题

**注意事项**:
- Confluence 内容中避免使用 emoji
- 使用 HTML 颜色标签替代：`<span style="color:red">●</span>`
- Markdown 表格需要标准格式

---

## 附录

### A. 工具清单

| 类别 | 工具名 | 功能 |
|------|--------|------|
| **页面** | confluence_get_page | 获取页面内容 |
| **页面** | confluence_create_page | 创建页面 |
| **页面** | confluence_update_page | 更新页面 |
| **页面** | confluence_delete_page | 删除页面 |
| **页面** | confluence_move_page | 移动页面 |
| **页面** | confluence_get_page_children | 获取子页面 |
| **搜索** | confluence_search | CQL 搜索 |
| **搜索** | confluence_search_user | 用户搜索 |
| **附件** | confluence_get_attachments | 列出附件 |
| **附件** | confluence_upload_attachment | 上传附件 |
| **附件** | confluence_upload_attachments | 批量上传 |
| **附件** | confluence_download_attachment | 下载附件 |
| **附件** | confluence_delete_attachment | 删除附件 |
| **附件** | confluence_get_page_images | 获取页面图片 |
| **协作** | confluence_get_comments | 获取评论 |
| **协作** | confluence_add_comment | 添加评论 |
| **协作** | confluence_reply_to_comment | 回复评论 |
| **协作** | confluence_get_labels | 获取标签 |
| **协作** | confluence_add_label | 添加标签 |
| **版本** | confluence_get_page_history | 获取历史版本 |
| **版本** | confluence_get_page_diff | 版本对比 |
| **版本** | confluence_get_page_views | 浏览统计 |

### B. 参考链接

- [Confluence REST API 文档](https://developer.atlassian.com/cloud/confluence/rest/)
- [CQL 语法参考](https://developer.atlassian.com/cloud/confluence/advanced-searching-using-cql/)
- [MCP Atlassian 项目](https://github.com/stephane-klein/mcp-atlassian)

### C. 快速参考卡片

**常用命令速查**:

```
获取页面:     confluence_get_page(page_id="632916624")
创建页面:     confluence_create_page(space_key="xingxiao", title="标题", content="内容", parent_id="632916624")
更新页面:     confluence_update_page(page_id="632916624", title="标题", content="内容")
搜索内容:     confluence_search(query='space=xingxiao AND title~"关键词"')
上传附件:     confluence_upload_attachment(content_id="632916624", file_path="/path/to/file")
添加标签:     confluence_add_label(page_id="632916624", name="标签名")
```

---

> 💡 **提示**: 所有工具都可以通过自然语言指令调用，例如：
> - "帮我搜索关于 AI 的文档"
> - "创建一个新页面，标题是项目计划"
> - "把这个文件上传到 Confluence"
