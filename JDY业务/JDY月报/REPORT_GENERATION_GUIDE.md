# JDY战区月报分析报告生成指南

> 本文档记录了整个JDY战区月报分析报告的生成流程、关键脚本和修复记录，供后续AI复刻使用。

---

## 1. 项目概述

### 1.1 数据环境
- **分析周期**: 2026年1-4月（业务记录）
- **大单口径**: 历史累计JDY合同金额 >= 50万
- **数据文件**: 10个Excel文件，位于项目根目录

### 1.2 数据文件清单

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `合同明细.xlsx` | 合同记录 | 模块1/2/3/5 |
| `机会明细.xlsx` | 销售机会 | 模块3/4/5 |
| `客户JDY商务明细.xlsx` | 商务活动记录 | 模块3 |
| `公司明细.xlsx` | 公司/客户信息 | 模块5 |
| `业绩明细.xlsx` | 业绩数据 | 模块1 |
| `业绩达成.xlsx` | 目标达成数据 | 模块1 |
| `低价买断合同.xlsx` | 特殊合同 | 模块2 |
| `公转私买断客户.xlsx` | 客户分类 | 模块2 |
| `到期续费明细.xlsx` | 续费数据 | 模块3 |
| `线索明细.xlsx` | 线索数据 | 模块3 |

### 1.3 输出结构
报告分为5个模块：
1. **模块1**: 业绩完成评估（echarts图表）
2. **模块2**: 经营结构诊断
3. **模块3**: 本月跟进复盘（chart.js图表）
4. **模块4**: 下月核心待办
5. **模块5**: 客户突破策略（行业卡片+竞争对手分析）

---

## 2. 模块生成脚本

### 2.1 模块1-4生成脚本

模块1-4由独立的Python脚本生成，生成独立的HTML文件：

- `generate_module1.py` -> `JDY战区月报_模块1_业绩完成评估.html`
- `generate_module2.py` -> `JDY战区月报_模块2_经营结构诊断.html`
- `generate_module3.py` -> `JDY战区月报_模块3_本月跟进复盘.html`
- `generate_module4.py` -> `JDY战区月报_模块4_下月核心待办.html`

**关键特征**:
- 使用 `pandas` + `openpyxl` 读取Excel数据
- 模块1使用 **echarts**（`<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js">`）
- 模块3使用 **chart.js**（`<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js">`）
- 各模块HTML为完整独立文件（含DOCTYPE、html、head、body）

### 2.2 模块5生成脚本（关键）

模块5是核心复杂模块，使用 `generate_module5_v8.py` 生成。

#### 2.2.1 核心逻辑

```python
# 大单客户：累计JDY合同金额 >= 50万
big_customers = company_contract[company_contract["合同简道云金额"] >= 500000]

# 纯潜客：全产品累计合同金额 = 0，且不在大客户列表中
pure_prospects = df_company[
    (df_company["公司全产品累计合同金额"] == 0) & 
    (~df_company["公司ID"].isin(big_customer_ids))
]
```

#### 2.2.2 行业标签（关键词匹配）

```python
def tag_industry(name):
    tags = {
        "制造": "制造业",
        "汽车": "汽车/交通",
        "能源": "能源/化工",
        "金融": "金融/保险",
        "银行": "金融/保险",
        "科技": "IT/互联网",
        "医药": "医药/医疗",
        "教育": "教育/培训",
        "建筑": "建筑/地产",
        "零售": "零售/消费",
    }
    # 按关键词匹配...
```

#### 2.2.3 竞争对手映射（仅公开可验证案例）

竞争对手数据基于各厂商官网公开的客户案例页面，**不使用机会明细中的"竞争对手"字段**。

```python
COMPETITOR_CUSTOMER_CASES = {
    "明道云": {
        "延长石油": "https://blog.mingdao.com/35429.html",
        "华夏银行": "https://blog.mingdao.com/28347.html",
        # ... 共约40个案例
    },
    "轻流": {
        "酷家乐": "https://news.qingflow.com/case-kjl/",
        # ... 共约25个案例
    },
    "飞书": {
        "物美集团": "https://www.feishu.cn/customers/wumart",
        # ... 共约25个案例
    },
    "氚云": {...},
    "宜搭": {...},
    "泛微": {...},
}

def resolve_case_url(competitor, company_name):
    """精确匹配，无fallback"""
    cases = COMPETITOR_CUSTOMER_CASES.get(competitor, {})
    for keyword in sorted(cases.keys(), key=len, reverse=True):
        if keyword in company_name:
            return cases[keyword], "exact"
    return "#", "none"  # 无匹配时返回"无"
```

**关键原则**:
- 仅当客户名称与竞争对手官网公开案例精确匹配时才显示链接
- 无匹配时显示 `<span class="text-slate-400 text-xs">无</span>`
- **不**使用通用案例中心链接
- **不**使用搜索引擎fallback

#### 2.2.4 布局参数

```python
# 两列布局：左40%（大客户），右60%（纯潜客）
.two-col {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 16px;
}
```

---

## 3. 整合脚本（核心）

整合脚本 `merge_modules_fix.py` 将5个独立模块合并为单一HTML文件，带Tab导航切换。

### 3.1 完整脚本代码

见同目录文件 `merge_modules_fix.py`（296行，完整可执行）。

### 3.2 关键函数说明

#### `find_matching_close(html, start_idx)`
使用div深度计数精确匹配关闭标签。支持`<div >`和`<div>`两种形式。

#### `remove_sticky_header(body)`
移除模块1/2中包含模块tab导航的sticky header块。

#### `remove_h1_title(body)`
移除模块3/4/5中的h1标题块。精确匹配外层容器`<div class="flex items-center justify-between mb-2">`。

#### `remove_maxw7xl_container(body)`
解包模块1/2中的max-w-7xl容器（移除开闭标签，保留内部内容）。

#### `fix_orphaned_closing_divs(body)`
修复原始文件中多余的`</div>`。模块3/4/5原始HTML各有1个多余的`</div>`。

#### `extract_body_content(html, module_idx)`
提取body内容并应用所有清理函数。

### 3.3 整合后HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- 合并所有CDN: tailwindcss, echarts, chart.js -->
  <!-- 合并所有模块的<style>块 -->
</head>
<body>
  <!-- 固定导航栏 -->
  <div class="nav-fixed">
    <button class="nav-btn" data-target="module1">模块1 ...</button>
    <button class="nav-btn" data-target="module2">模块2 ...</button>
    ...
  </div>
  
  <!-- 模块内容，默认只显示模块1 -->
  <section id="module1" class="module-section" style="display: block;">...</section>
  <section id="module2" class="module-section" style="display: none;">...</section>
  ...
  
  <script>
    function showModule(moduleId) {
      document.querySelectorAll('.module-section').forEach(sec => sec.style.display = 'none');
      document.getElementById(moduleId).style.display = 'block';
      // 更新导航按钮高亮
    }
  </script>
</body>
</html>
```

### 3.4 关键修复记录

#### 修复1: body标签属性匹配
**问题**: 模块3/4/5的body标签有class属性（`<body class="max-w-7xl...">`），原始正则`<body>(.*?)</body>`无法匹配。  
**修复**: 使用`<body[^>]*>(.*?)</body>`。

#### 修复2: sticky header移除不完全
**问题**: `find_matching_close`函数最初只匹配`<div `（带空格），不匹配`<div>`（无属性）。  
**修复**: `if html[i:i+5] == '<div ' or html[i:i+5] == '<div>':`

#### 修复3: h1标题块内层div匹配错误
**问题**: `remove_h1_title`使用`rfind('<div')`找到的是内层`<div>`而非外层容器。  
**修复**: 直接匹配完整的外层容器class `<div class="flex items-center justify-between mb-2">`。

#### 修复4: max-w-7xl容器处理
**问题**: 直接移除容器会丢失所有内容。  
**修复**: 解包容器（移除开闭标签，保留内部内容）。

#### 修复5: 原始文件多余`</div>`
**问题**: 模块3/4/5原始HTML各有1个多余的`</div>`。  
**修复**: `fix_orphaned_closing_divs`函数通过div深度计数检测并移除。

#### 修复6: Tab切换（锚点->显示/隐藏）
**问题**: 导航使用锚点跳转，所有模块按顺序排列，滚动可见全部内容。  
**修复**: 
- 导航按钮改为`<button data-target="moduleX">`
- section默认`display: none`，仅模块1为`display: block`
- JavaScript实现`showModule()`函数切换显示

---

## 4. 环境要求

### 4.1 Python环境
```bash
# 使用项目内.venv
.\.venv\Scripts\python.exe
```

### 4.2 依赖包
```
pandas
openpyxl
numpy
```

### 4.3 外部CDN（自动引入）
- TailwindCSS: `https://cdn.tailwindcss.com`
- ECharts: `https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js`
- Chart.js: `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`

---

## 5. 复刻步骤

### 步骤1: 准备数据
确保10个Excel数据文件位于项目根目录。

### 步骤2: 生成各模块HTML
运行模块1-5的生成脚本：
```bash
python generate_module1.py
python generate_module2.py
python generate_module3.py
python generate_module4.py
python generate_module5_v8.py
```

### 步骤3: 整合为单一HTML
```bash
python merge_modules_fix.py
```

输出文件: `JDY战区月报_整合版.html`

---

## 6. 验证清单

整合完成后，检查以下项目：

| 检查项 | 期望结果 |
|--------|----------|
| 文件大小 | ~300-350KB |
| echarts.js in head | True |
| chart.js in head | True |
| body内无DOCTYPE | True |
| body内无嵌套html/head | True |
| 模块1 display | block |
| 模块2-5 display | none |
| 导航按钮类型 | button |
| 图表脚本完整 | echarts.init=4, new Chart(=6 |

---

## 7. 常见问题

### Q1: 图表不显示
- 检查CDN是否正确引入（echarts.js / chart.js）
- 检查canvas元素是否有唯一id
- 检查脚本中`new Chart()`或`echarts.init()`是否在DOM加载后执行

### Q2: 模块内部有重复导航
- 检查`remove_sticky_header`是否正确移除了模块1/2的sticky header
- 检查正则是否匹配`<div class="bg-white border-b sticky top-0 z-50">`

### Q3: Tab切换无效
- 检查导航按钮是否为`<button>`而非`<a>`
- 检查`data-target`属性是否与section的`id`对应
- 检查`showModule()`函数是否在页面底部正确加载

---

## 附录: 整合脚本源代码

```python
# -*- coding: utf-8 -*-
import re
import os


def find_module_files():
    module_files = []
    for i in range(1, 6):
        prefix = f'JDY战区月报_模块{i}_'
        files = [f for f in os.listdir('.') if f.startswith(prefix) and f.endswith('.html')]
        if files:
            module_files.append(files[0])
    return module_files


def extract_head_content(html):
    head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
    if not head_match:
        return [], []
    head = head_match.group(1)
    
    scripts = []
    for m in re.finditer(r'<script[^>]*src="([^"]*)"[^>]*>[^<]*</script>', head):
        scripts.append(m.group(1))
    
    styles = []
    for m in re.finditer(r'<style>(.*?)</style>', head, re.DOTALL):
        styles.append(m.group(1).strip())
    
    return scripts, styles


def find_matching_close(html, start_idx):
    """Find the matching </div> for a <div> at start_idx."""
    depth = 0
    for i in range(start_idx, len(html)):
        if html[i:i+5] == '<div ' or html[i:i+5] == '<div>':
            depth += 1
        elif html[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
    return -1


def remove_sticky_header(body):
    """Remove the sticky header block containing module tabs."""
    idx = body.find('<div class="bg-white border-b sticky top-0 z-50">')
    if idx < 0:
        return body
    end = find_matching_close(body, idx)
    if end < 0:
        return body
    return body[:idx].rstrip() + '\n' + body[end:].lstrip()


def remove_h1_title(body):
    """Remove the standalone h1 title block if present."""
    # The title block structure is:
    # <div class="flex items-center justify-between mb-2">
    #   <div>
    #     <h1 class="text-2xl font-bold text-slate-800">...</h1>
    #     <p class="text-sm text-slate-500 mt-1">...</p>
    #   </div>
    # </div>
    h1_idx = body.find('<h1 class="text-2xl font-bold text-slate-800">')
    if h1_idx < 0:
        return body
    
    # Find the outer container: <div class="flex items-center justify-between mb-2">
    container_start = body.rfind('<div class="flex items-center justify-between mb-2">', 0, h1_idx)
    if container_start < 0:
        return body
    
    # Find the matching close for this outer container using div depth counting
    end = find_matching_close(body, container_start)
    if end < 0:
        return body
    
    return body[:container_start].rstrip() + '\n' + body[end:].lstrip()


def remove_maxw7xl_container(body):
    """Unwrap the redundant max-w-7xl container if present (keep inner content)."""
    idx = body.find('<div class="max-w-7xl mx-auto px-4 py-6">')
    if idx < 0:
        return body
    # Find the matching close
    end = find_matching_close(body, idx)
    if end < 0:
        return body
    # Remove the opening tag and closing tag, keep inner content
    open_tag_end = body.find('>', idx) + 1
    close_tag_start = end - 6  # </div> is 6 chars
    return body[:idx].rstrip() + '\n' + body[open_tag_end:close_tag_start].strip() + '\n' + body[end:].lstrip()


def clean_comments(body):
    """Remove orphaned section title comments."""
    # Remove <!-- 标题 --> or similar standalone title comments
    body = re.sub(r'\s*<!--\s*标题\s*-->\s*', '\n', body)
    body = re.sub(r'\s*<!--\s*Header\s*-->\s*', '\n', body)
    return body.strip()


def fix_orphaned_closing_divs(body):
    """Remove orphaned </div> tags at the end of body content."""
    # Count div depth
    depth = 0
    for i in range(len(body)):
        if body[i:i+5] == '<div ' or body[i:i+5] == '<div>':
            depth += 1
        elif body[i:i+6] == '</div>':
            depth -= 1
    
    # If depth is negative, there are orphaned closing divs
    while depth < 0:
        # Find the last </div>
        last_idx = body.rfind('</div>')
        if last_idx < 0:
            break
        # Check if removing this </div> is safe (it's near the end)
        after = body[last_idx+6:].strip()
        if after and not after.startswith('</body>') and not after.startswith('</section>'):
            # Not at the very end, be more careful
            pass
        body = body[:last_idx].rstrip() + '\n' + body[last_idx+6:].lstrip()
        depth += 1
    
    return body.strip()


def extract_body_content(html, module_idx):
    """Extract body content, removing internal headers."""
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    if not body_match:
        # Fallback: if no body tags, use content after </head> or full html
        head_end = html.find('</head>')
        if head_end >= 0:
            content = html[head_end + 7:]
            # Remove </html> if present
            content = re.sub(r'</html>\s*$', '', content, flags=re.DOTALL)
            return content.strip()
        return html.strip()
    
    body = body_match.group(1).strip()
    
    # Remove sticky header with module tabs (for modules 1 and 2)
    body = remove_sticky_header(body)
    
    # Remove standalone h1 title block (for modules 3, 4, 5)
    body = remove_h1_title(body)
    
    # Remove redundant max-w-7xl container (for modules 1, 2)
    body = remove_maxw7xl_container(body)
    
    # Clean up orphaned comments
    body = clean_comments(body)
    
    # Fix orphaned closing divs from original files
    body = fix_orphaned_closing_divs(body)
    
    return body


def build_merged_html(module_files):
    all_script_srcs = set()
    all_styles = []
    module_contents = []
    module_titles = []
    
    for idx, fname in enumerate(module_files):
        with open(fname, 'r', encoding='utf-8') as f:
            html = f.read()
        
        title_match = re.search(r'<title>(.*?)</title>', html)
        title = title_match.group(1) if title_match else f'模块{idx+1}'
        display_title = title.replace('JDY战区月报 - ', '').replace('JDY战区月报 ', '')
        module_titles.append(display_title)
        
        scripts, styles = extract_head_content(html)
        for s in scripts:
            all_script_srcs.add(s)
        for s in styles:
            if s not in all_styles:
                all_styles.append(s)
        
        body_content = extract_body_content(html, idx + 1)
        module_contents.append(body_content)
    
    script_tags = '\n'.join(f'<script src="{src}"></script>' for src in sorted(all_script_srcs))
    style_blocks = '\n\n'.join(f'<style>\n{s}\n</style>' for s in all_styles)
    
    nav_items = []
    for i, title in enumerate(module_titles):
        short_title = title.split('：')[-1] if '：' in title else title
        # Avoid duplicate "模块X" prefix if title already contains it
        prefix = f'模块{i+1}'
        if short_title.startswith(prefix) or short_title.startswith(f'模块{i+1}'):
            nav_text = short_title
        else:
            nav_text = f'{prefix} {short_title}'
        nav_items.append(
            f'<button class="nav-btn text-slate-600" data-target="module{i+1}">{nav_text}</button>'
        )
    
    nav_html = '\n'.join([
        '<div class="nav-fixed">',
        '  <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">',
        '    <span class="text-sm font-bold text-slate-800 mr-2 whitespace-nowrap">JDY战区月报</span>',
        '    ' + '\n    '.join(nav_items),
        '  </div>',
        '</div>',
        '<div style="height: 56px;"></div>'
    ])
    
    sections = []
    for i, content in enumerate(module_contents):
        display = 'block' if i == 0 else 'none'
        sections.append(
            f'<section id="module{i+1}" class="module-section" style="display: {display};">\n'
            f'  <div class="flex items-center gap-2 mb-4">\n'
            f'    <span class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{i+1}</span>\n'
            f'    <h2 class="text-lg font-bold text-slate-800">{module_titles[i]}</h2>\n'
            f'  </div>\n'
            f'  {content}\n'
            f'</section>'
        )
    
    merged = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JDY战区月报（模块1-5整合版）</title>
{script_tags}
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f1f5f9; }}
  .nav-fixed {{ position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #e2e8f0; }}
  .module-section {{ background: white; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 24px; }}
  .nav-btn {{ padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; transition: all 0.2s; white-space: nowrap; text-decoration: none; cursor: pointer; border: none; background: transparent; }}
  .nav-btn:hover {{ background: #e2e8f0; }}
  .nav-btn.active {{ background: #3b82f6; color: white; }}
</style>
{style_blocks}
</head>
<body>
{nav_html}
<div class="max-w-7xl mx-auto px-4 py-6">
{'\n\n'.join(sections)}
</div>
<script>
function showModule(moduleId) {{
  document.querySelectorAll('.module-section').forEach(sec => sec.style.display = 'none');
  document.getElementById(moduleId).style.display = 'block';
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.nav-btn[data-target="' + moduleId + '"]').classList.add('active');
}}
document.querySelectorAll('.nav-btn').forEach(btn => {{
  btn.addEventListener('click', function() {{
    showModule(this.dataset.target);
  }});
}});
document.addEventListener('DOMContentLoaded', function() {{
  const firstNav = document.querySelector('.nav-btn');
  if (firstNav) firstNav.classList.add('active');
}});
</script>
</body>
</html>'''
    
    return merged


if __name__ == '__main__':
    module_files = find_module_files()
    print(f'Found modules: {module_files}')
    
    merged = build_merged_html(module_files)
    
    output_file = 'JDY战区月报_整合版.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(merged)
    
    print(f'Merged HTML written to {output_file} ({len(merged)} chars, {len(merged.encode("utf-8"))} bytes)')
    
    # Verification
    with open(output_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print('Verification:')
    head_end = content.find('</head>')
    head = content[:head_end]
    print(f'  echarts.js in head: {"echarts" in head}')
    print(f'  chart.js in head: {"chart.js" in head}')
    print(f'  echarts.init calls: {content.count("echarts.init(")}')
    print(f'  new Chart( calls: {content.count("new Chart(")}')
    print(f'  DOCTYPE in body: {content.find("<!DOCTYPE", head_end) > 0}')
    print(f'  <html in body: {content.find("<html", head_end) > 0}')
    print(f'  <head in body: {content.find("<head>", head_end) > 0}')
    
    for i in range(1, 6):
        c = content.count('模块' + str(i))
        print(f'  模块{i} references: {c}')

```

---

*文档生成时间: 2026-05-09*
*对应整合版文件: JDY战区月报_整合版.html*
