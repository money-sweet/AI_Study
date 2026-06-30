# -*- coding: utf-8 -*-
import pandas as pd
import json
from collections import Counter
import re

df = pd.read_excel('agent用户问题埋点.xlsx')

# 基础统计
print("=" * 60)
print("一、数据概览")
print("=" * 60)
print(f"总问题数: {len(df)}")
print(f"去重会话数: {df['sessionId'].nunique()}")
print(f"时间范围: {df['timestamp'].min()} 至 {df['timestamp'].max()}")
print(f"总inputTokens: {df['inputTokens'].sum():,}")
print(f"平均inputTokens: {df['inputTokens'].mean():.0f}")
print(f"中位数inputTokens: {df['inputTokens'].median():.0f}")
print()

# 团队分布
print("=" * 60)
print("二、团队分布（三级团队）")
print("=" * 60)
for team, count in df['三级团队'].value_counts().items():
    pct = count / len(df) * 100
    print(f"  {team}: {count}条 ({pct:.1f}%)")
print()

# 每日问题量
print("=" * 60)
print("三、每日问题量分布")
print("=" * 60)
df['date'] = pd.to_datetime(df['timestamp']).dt.date
for date, count in df['date'].value_counts().sort_index().items():
    print(f"  {date}: {count}条")
print()

# 关键词提取与分类
print("=" * 60)
print("四、问题关键词分析")
print("=" * 60)

keywords = {
    "业绩/达成分析": ["业绩", "达成", "目标", "完成", "差距", "销售", "签约", "签单", "回款", "销售额", "达成率"],
    "数据报表/仪表板": ["报表", "报告", "分析看板", "仪表板", "故事板", "html", "宽表", "图表", "数据"],
    "行业分析": ["行业", "电力", "银行", "烟草", "军工", "金融", "半导体", "大消费"],
    "区域/战区分析": ["区域", "战区", "大区", "上海", "华南", "华北", "西北", "东北", "苏皖", "华中", "浙闽"],
    "客户分析": ["客户", "客群", "A类", "老客", "新客", "标杆", "准标杆", "分层"],
    "机会/线索分析": ["机会", "线索", "转化", "跟进", "储备", "覆盖", "满足率", "LTC"],
    "人员/销售分析": ["售前", "dsm", "销售", "代表", "sr", "个人", "小组", "人员画像", "拜访"],
    "产品分析": ["产品", "JDY", "策略产品", "BI", "FR", "简道云", "增购", "续费", "新购"],
    "运营分析": ["运营", "毛利", "帕累托", "波士顿", "二八", "品类", "商品", "门店", "设备"],
    "时间/周期": ["2025", "2026", "同比", "同期", "月度", "季度", "年度", "近三年"],
    "数据纠正/校验": ["不对", "错误", "修正", "纠正", "重新", "优化", "更新", "不对吧", "有问题"],
    "改善/行动建议": ["改善", "改进", "建议", "行动", "计划", "方案", "落地", "挽救"]
}

questions = df['question'].tolist()
question_text = ' '.join(questions)

category_counts = {}
for cat, words in keywords.items():
    count = 0
    for q in questions:
        for w in words:
            if w.lower() in q.lower():
                count += 1
                break
    category_counts[cat] = count

sorted_cats = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
for cat, count in sorted_cats:
    pct = count / len(df) * 100
    print(f"  {cat}: {count}条 ({pct:.1f}%)")
print()

# 统计具体高频词
print("=" * 60)
print("五、高频关键词TOP20")
print("=" * 60)
all_words = []
for q in questions:
    # 提取2-8个字的中文词（简化处理）
    words = re.findall(r'[\u4e00-\u9fff]{2,8}', q)
    all_words.extend(words)

# 过滤常见停用词
stop_words = set(['分析', '一下', '一下', '根据', '基于', '按照', '可以', '需要', '然后', '一下', '看看', '帮我', '给我', '现在', '这个', '这些', '那些', '以上', '下面', '一下', '一份', '一个', '一下'])
filtered = [w for w in all_words if w not in stop_words and len(w) >= 2]

counter = Counter(filtered)
for word, count in counter.most_common(30):
    print(f"  {word}: {count}次")
print()

# 典型问题示例
print("=" * 60)
print("六、典型问题示例（按类别）")
print("=" * 60)

examples = {
    "业绩达成与差距分析": [
        "苏皖JDY当前的业绩怎么样",
        "按照这个思路，你把所有A类客户生成一个报告给我",
        "帮我分析华南JDY新产品的业绩完成情况，以及差距分析和改进计划"
    ],
    "数据纠正与迭代": [
        "苏皖战区的年度目标是2300万，不是3,678万，修正一下数据",
        "你这个25年的数据绝逼不对",
        "我打断你一下，我需要分析的26年的数据",
        "数据点的提示可以添加目标和达成数据吗"
    ],
    "行业与客群深度分析": [
        "客群结构分为3块：1、新客...2、Fine+老客...3、JDY老客...",
        "西北区域电力行业目前机会分析，是否可支撑2026年全面目标达成",
        "对上边4个行业签单客户展开进行详细分析"
    ],
    "销售与售前人员分析": [
        "分析一下销售个人的线索跟进效率",
        "业绩表现最好的5个DSM",
        "售前shay.liu 刘懿瑶26年6.30之前能签多少？",
        "杨冬雪是2024年入职的，所以4月的异常低值不是入职首月的原因"
    ],
    "机会与线索转化": [
        "JDY老客下滑是什么原因，比如我该续费的没有续费么",
        "从线索到机会到合同转化，看一下各个销售小组和销售同学的跟进情况",
        "能不能增加一下从商务记录里面针对于简道云机会状态更新一下"
    ],
    "报告生成与可视化": [
        "基于当前的分析看板，帮我生成一个完整的可对外分享的数据分析报告",
        "生成分析仪表板 和 分析报告",
        "布局不要用流式布局，用那种驾驶舱布局，最好可以用大屏模式",
        "变成深色，内容变得酷炫一点"
    ]
}

for cat, exs in examples.items():
    print(f"\n【{cat}】")
    for e in exs:
        print(f"  - {e}")

# 问题长度分布
print()
print("=" * 60)
print("七、问题长度分布")
print("=" * 60)
df['q_len'] = df['question'].str.len()
print(f"  平均长度: {df['q_len'].mean():.0f}字")
print(f"  中位数长度: {df['q_len'].median():.0f}字")
print(f"  最长问题: {df['q_len'].max()}字")
print(f"  最短问题: {df['q_len'].min()}字")
print(f"  100字以上长问题: {(df['q_len'] > 100).sum()}条 ({(df['q_len'] > 100).sum()/len(df)*100:.1f}%)")
print(f"  20字以下短问题: {(df['q_len'] < 20).sum()}条 ({(df['q_len'] < 20).sum()/len(df)*100:.1f}%)")

# 长问题占比高，说明用户问题复杂
print()
print("=" * 60)
print("八、会话深度分析（按session聚合）")
print("=" * 60)
session_stats = df.groupby('sessionId').agg({
    'question': 'count',
    'inputTokens': 'sum'
}).rename(columns={'question': '轮次'})
print(f"  平均会话轮次: {session_stats['轮次'].mean():.1f}")
print(f"  最大会话轮次: {session_stats['轮次'].max()}")
print(f"  平均会话tokens: {session_stats['inputTokens'].mean():.0f}")
print(f"  超过5轮的会话: {(session_stats['轮次'] >= 5).sum()}个")
print(f"  超过10轮的会话: {(session_stats['轮次'] >= 10).sum()}个")

# 识别数据纠错类问题
print()
print("=" * 60)
print("九、数据纠错/质疑类问题统计")
print("=" * 60)
correction_keywords = ['不对', '错误', '修正', '纠正', '重新', '优化', '更新', '有问题', '少了', '多了', '不对吧', '绝逼', '是不是', '只有', '不是']
correction_count = 0
correction_examples = []
for q in questions:
    for kw in correction_keywords:
        if kw in q:
            correction_count += 1
            if len(correction_examples) < 10:
                correction_examples.append(q)
            break

print(f"  涉及数据纠错/质疑的问题: {correction_count}条 ({correction_count/len(df)*100:.1f}%)")
print("  典型示例:")
for e in correction_examples[:8]:
    print(f"    - {e[:80]}...")

# 导出分析摘要
summary = {
    "总问题数": len(df),
    "去重会话数": int(df['sessionId'].nunique()),
    "时间范围": f"{df['timestamp'].min()} 至 {df['timestamp'].max()}",
    "总tokens": int(df['inputTokens'].sum()),
    "平均tokens": int(df['inputTokens'].mean()),
    "团队分布": {k: int(v) for k, v in df['三级团队'].value_counts().items()},
    "问题类别分布": {k: int(v) for k, v in category_counts.items()},
    "高频词": {k: int(v) for k, v in counter.most_common(20)},
    "数据纠错类问题数": correction_count
}

with open('analysis_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print()
print("分析摘要已导出到 analysis_summary.json")
