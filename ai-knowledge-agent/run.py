#!/usr/bin/env python3
"""本地开发启动脚本"""
import os
import sys

if not os.getenv("KIMI_API_KEY"):
    print("❌ 请设置环境变量 KIMI_API_KEY")
    print("   PowerShell: $env:KIMI_API_KEY='sk-xxx'")
    print("   CMD: set KIMI_API_KEY=sk-xxx")
    sys.exit(1)

import uvicorn
print("🚀 启动服务: http://localhost:8000")
uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
