# -*- coding: utf-8 -*-
import pandas as pd
from collections import Counter

df = pd.read_excel('agent用户问题埋点.xlsx')

print('=== 数据概览 ===')
print(f'总记录数: {len(df)}')
print(f'去重session数: {df["sessionId"].nunique()}')
print(f'时间范围: {df["timestamp"].min()} 至 {df["timestamp"].max()}')
print(f'总inputTokens: {df["inputTokens"].sum():,}')
print(f'平均inputTokens: {df["inputTokens"].mean():.0f}')
print(f'中位数inputTokens: {df["inputTokens"].median():.0f}')
print()

print('=== 一级组织分布 ===')
print(df['一级组织'].value_counts().to_string())
print()

print('=== 一级团队分布 ===')
print(df['一级团队'].value_counts().to_string())
print()

print('=== 三级团队分布 ===')
print(df['三级团队'].value_counts().to_string())
print()

print('=== 每日问题量 ===')
df['date'] = pd.to_datetime(df['timestamp']).dt.date
print(df['date'].value_counts().sort_index().to_string())
print()

# 将问题内容导出以便分析
questions = df['question'].tolist()
with open('questions.txt', 'w', encoding='utf-8') as f:
    for i, q in enumerate(questions, 1):
        f.write(f'{i}. {q}\n\n')
print('问题已导出到 questions.txt')
