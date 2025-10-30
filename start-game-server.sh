#!/bin/bash
# 游戏服务器启动脚本

# 停止旧进程
pkill -f "SimpleHTTPServer 80"

# 等待进程完全停止
sleep 2

# 切换到游戏目录
cd /var/www/game

# 启动服务器
nohup python -m SimpleHTTPServer 80 > /var/log/game-server.log 2>&1 &

# 等待启动
sleep 2

# 检查状态
if ps aux | grep "SimpleHTTPServer 80" | grep -v grep > /dev/null; then
    echo "✅ 游戏服务器启动成功!"
    echo "访问地址: http://117.72.182.249/escape.html"
    ps aux | grep "SimpleHTTPServer 80" | grep -v grep
else
    echo "❌ 启动失败,请检查日志: /var/log/game-server.log"
    exit 1
fi

