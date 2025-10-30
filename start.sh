#!/bin/bash

# 极限躲避游戏 - 快速启动脚本

echo "🎮 极限躲避 - 游戏服务器启动中..."
echo ""

# 检测端口是否被占用
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    echo "⚠️  端口 $PORT 已被占用，尝试端口 $((PORT+1))..."
    PORT=$((PORT+1))
done

echo "✅ 使用端口: $PORT"
echo ""

# 获取本机IP地址（macOS）
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

if [ -z "$IP" ]; then
    IP="localhost"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 游戏已启动！"
echo ""
echo "   本机访问: http://localhost:$PORT"
echo "   局域网访问: http://$IP:$PORT"
echo ""
echo "📱 手机扫码游玩："
echo "   1. 确保手机和电脑在同一WiFi"
echo "   2. 用二维码生成器生成: http://$IP:$PORT"
echo "   3. 扫码即可游玩"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务器"
echo ""

# 启动Python HTTP服务器
python3 -m http.server $PORT

