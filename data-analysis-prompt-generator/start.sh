#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动数据分析提示词生成器..."
echo "请在浏览器中访问 http://localhost:8080"
cd backend
node server.js
