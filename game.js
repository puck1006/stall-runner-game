// 游戏配置
const CONFIG = {
  playerSize: 35,
  enemySize: 30,
  enemyMinSpeed: 3, // 最小速度
  enemyMaxSpeed: 8, // 最大速度
  enemySpawnRate: 800, // 初始生成间隔（毫秒）
  minSpawnRate: 200, // 最小生成间隔
  speedIncreaseRate: 0.3, // 速度递增率
  difficultyIncreaseInterval: 3000, // 难度递增间隔
};

// 游戏状态
let gameState = {
  isPlaying: false,
  score: 0,
  startTime: 0,
  survivedTime: 0,
  currentSpawnRate: CONFIG.enemySpawnRate,
};

// 画布设置
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 玩家对象
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: CONFIG.playerSize,
  color: "#fbbf24",
  targetX: canvas.width / 2,
  targetY: canvas.height / 2,

  draw(dangerLevel = 0) {
    // 危险警告圈（当有敌人接近时显示）
    if (dangerLevel > 0) {
      const warningAlpha = Math.min(0.5, dangerLevel / 100);
      ctx.strokeStyle = `rgba(239, 68, 68, ${warningAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.size / 2 + 15 + Math.sin(performance.now() / 100) * 5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    // 外层光晕
    ctx.fillStyle = "rgba(251, 191, 36, 0.3)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2 + 5, 0, Math.PI * 2);
    ctx.fill();

    // 主体
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 绘制眼睛
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.x - 8, this.y - 5, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 8, this.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // 绘制笑脸
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y + 3, 8, 0, Math.PI);
    ctx.stroke();
  },

  update() {
    // 平滑移动到目标位置（XY轴都移动）
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.x += dx * 0.15;
    this.y += dy * 0.15;

    // 限制在画布内
    this.x = Math.max(
      this.size / 2,
      Math.min(canvas.width - this.size / 2, this.x)
    );
    this.y = Math.max(
      this.size / 2,
      Math.min(canvas.height - this.size / 2, this.y)
    );
  },

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
  },

  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.targetX = canvas.width / 2;
    this.targetY = canvas.height / 2;
  },
};

// 敌人数组
let enemies = [];

// 敌人类
class Enemy {
  constructor(playerX, playerY) {
    // 从屏幕四周随机出现
    const side = Math.floor(Math.random() * 4); // 0=上, 1=右, 2=下, 3=左

    if (side === 0) {
      // 从上方出现
      this.x = Math.random() * canvas.width;
      this.y = -CONFIG.enemySize;
    } else if (side === 1) {
      // 从右方出现
      this.x = canvas.width + CONFIG.enemySize;
      this.y = Math.random() * canvas.height;
    } else if (side === 2) {
      // 从下方出现
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + CONFIG.enemySize;
    } else {
      // 从左方出现
      this.x = -CONFIG.enemySize;
      this.y = Math.random() * canvas.height;
    }

    this.size = CONFIG.enemySize + Math.random() * 15; // 大小随机
    this.color = this.getRandomColor();
    this.type = Math.floor(Math.random() * 3); // 3种敌人类型

    // 移动模式：0=直线飞向玩家初始位置, 1=追踪玩家, 2=随机方向
    this.moveMode = Math.floor(Math.random() * 3);

    // 基础速度（随机）
    const baseSpeed =
      CONFIG.enemyMinSpeed +
      Math.random() * (CONFIG.enemyMaxSpeed - CONFIG.enemyMinSpeed);

    if (this.moveMode === 0) {
      // 直线飞向玩家当前位置
      const angle = Math.atan2(playerY - this.y, playerX - this.x);
      this.vx = Math.cos(angle) * baseSpeed;
      this.vy = Math.sin(angle) * baseSpeed;
    } else if (this.moveMode === 2) {
      // 随机方向飞行
      const randomAngle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(randomAngle) * baseSpeed;
      this.vy = Math.sin(randomAngle) * baseSpeed;
    } else {
      // 追踪模式
      this.vx = 0;
      this.vy = 0;
      this.speed = baseSpeed;
    }

    this.rotation = Math.random() * Math.PI * 2; // 旋转角度
    this.rotationSpeed = (Math.random() - 0.5) * 0.15; // 旋转速度
  }

  getRandomColor() {
    const colors = [
      "#ef4444",
      "#f97316",
      "#ec4899",
      "#8b5cf6",
      "#06b6d4",
      "#10b981",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // 绘制阴影/光晕
    ctx.fillStyle = this.color
      .replace(")", ", 0.3)")
      .replace("rgb", "rgba")
      .replace("#", "rgba(");

    ctx.fillStyle = this.color;

    // 根据类型绘制不同形状
    if (this.type === 0) {
      // 圆形
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 1) {
      // 正方形
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      // 三角形
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
    }

    // 添加眼睛效果
    if (this.size > 20) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-6, -3, 3, 0, Math.PI * 2);
      ctx.arc(6, -3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  update(playerX, playerY) {
    if (this.moveMode === 1) {
      // 追踪模式：始终朝向玩家
      const angle = Math.atan2(playerY - this.y, playerX - this.x);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
  }

  isOffScreen() {
    // 如果离开屏幕很远就移除
    const margin = 200;
    return (
      this.x < -margin ||
      this.x > canvas.width + margin ||
      this.y < -margin ||
      this.y > canvas.height + margin
    );
  }

  collidesWith(player) {
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.size / 2 + player.size / 2 - 5; // 稍微宽容一点
  }
}

// 粒子效果（碰撞时）
let particles = [];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.size = Math.random() * 5 + 3;
    this.color = color;
    this.life = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // 重力
    this.life -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  isDead() {
    return this.life <= 0;
  }
}

// 生成敌人
let lastSpawnTime = 0;

function spawnEnemy() {
  enemies.push(new Enemy(player.x, player.y));
}

// 触摸/鼠标控制
let touchActive = false;

canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);
canvas.addEventListener("mousedown", handleMouseDown, false);
canvas.addEventListener("mousemove", handleMouseMove, false);
canvas.addEventListener("mouseup", handleMouseUp, false);

function handleTouchStart(e) {
  e.preventDefault();
  touchActive = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  player.moveTo(x, y);
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchActive || !gameState.isPlaying) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  player.moveTo(x, y);
}

function handleTouchEnd(e) {
  e.preventDefault();
  touchActive = false;
}

function handleMouseDown(e) {
  touchActive = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  player.moveTo(x, y);
}

function handleMouseMove(e) {
  if (!touchActive || !gameState.isPlaying) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  player.moveTo(x, y);
}

function handleMouseUp(e) {
  touchActive = false;
}

// 碰撞检测
function checkCollisions() {
  for (let enemy of enemies) {
    if (enemy.collidesWith(player)) {
      createExplosion(player.x, player.y, player.color);
      createExplosion(enemy.x, enemy.y, enemy.color);
      gameOver();
      return true;
    }
  }
  return false;
}

// 创建爆炸效果
function createExplosion(x, y, color) {
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// 更新游戏
function update(currentTime) {
  if (!gameState.isPlaying) return;

  // 更新存活时间和分数
  gameState.survivedTime = (currentTime - gameState.startTime) / 1000;
  gameState.score = Math.floor(gameState.survivedTime * 10);

  // 更新UI
  document.getElementById("score").textContent = gameState.score;
  document.getElementById("time").textContent =
    gameState.survivedTime.toFixed(2);

  // 难度递增（生成间隔越来越短）
  const difficultyMultiplier = Math.floor(gameState.survivedTime / 3);
  gameState.currentSpawnRate = Math.max(
    CONFIG.minSpawnRate,
    CONFIG.enemySpawnRate - difficultyMultiplier * 50
  );

  // 生成敌人
  if (currentTime - lastSpawnTime > gameState.currentSpawnRate) {
    spawnEnemy();
    lastSpawnTime = currentTime;
  }

  // 更新玩家
  player.update();

  // 更新敌人
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update(player.x, player.y);

    // 移除屏幕外的敌人
    if (enemies[i].isOffScreen()) {
      enemies.splice(i, 1);
    }
  }

  // 更新粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // 检测碰撞
  checkCollisions();
}

// 绘制游戏
function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制动态背景网格效果（根据时间移动）
  if (gameState.isPlaying) {
    const offset = (performance.now() / 50) % 50;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = -50; i < canvas.width + 50; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i + offset, 0);
      ctx.lineTo(i + offset, canvas.height);
      ctx.stroke();
    }
    for (let i = -50; i < canvas.height + 50; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i + offset);
      ctx.lineTo(canvas.width, i + offset);
      ctx.stroke();
    }
  }

  // 绘制敌人
  for (let enemy of enemies) {
    enemy.draw();
  }

  // 绘制粒子
  for (let particle of particles) {
    particle.draw();
  }

  // 绘制玩家
  if (gameState.isPlaying) {
    // 计算危险等级（最近敌人的距离）
    let dangerLevel = 0;
    if (enemies.length > 0) {
      let minDistance = Infinity;
      for (let enemy of enemies) {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        minDistance = Math.min(minDistance, distance);
      }
      // 距离越近危险等级越高
      if (minDistance < 150) {
        dangerLevel = 100 - (minDistance / 150) * 100;
      }
    }

    player.draw(dangerLevel);

    // 绘制危险提示（敌人数量显示）
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `敌人: ${enemies.length}`,
      canvas.width / 2,
      canvas.height - 20
    );
  }
}

// 游戏循环
let lastTime = 0;

function gameLoop(currentTime) {
  update(currentTime);
  draw();
  requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";

  // 重置游戏状态
  gameState.isPlaying = true;
  gameState.score = 0;
  gameState.startTime = performance.now();
  gameState.survivedTime = 0;
  gameState.currentSpawnRate = CONFIG.enemySpawnRate;

  // 重置游戏对象
  enemies = [];
  particles = [];
  player.reset();
  lastSpawnTime = performance.now();

  // 更新画布尺寸
  resizeCanvas();
}

// 游戏结束
function gameOver() {
  gameState.isPlaying = false;

  // 显示最终分数
  document.getElementById("finalTime").textContent =
    gameState.survivedTime.toFixed(2);
  document.getElementById("finalScore").textContent = gameState.score;

  // 保存到排行榜
  saveScore(gameState.score, gameState.survivedTime);

  // 显示排名信息
  const rank = getCurrentRank();
  let message = "";
  if (rank === 1) {
    message = "🏆 恭喜！你是新的排行榜第一名！";
  } else if (rank <= 3) {
    message = `🥈 太棒了！你排名第 ${rank} 名！`;
  } else if (rank <= 10) {
    message = `⭐ 不错！你排名第 ${rank} 名！`;
  } else {
    message = "💪 继续加油，挑战更高分数！";
  }
  document.getElementById("rankMessage").textContent = message;

  // 显示游戏结束画面
  setTimeout(() => {
    document.getElementById("gameOverScreen").style.display = "flex";
  }, 500);
}

// 重新开始游戏
function restartGame() {
  startGame();
}

// 排行榜系统（使用 localStorage）
function saveScore(score, time) {
  let rankings = JSON.parse(localStorage.getItem("gameRankings") || "[]");

  const newRecord = {
    score: score,
    time: time,
    date: new Date().toLocaleString("zh-CN"),
  };

  rankings.push(newRecord);
  rankings.sort((a, b) => b.time - a.time); // 按存活时间排序
  rankings = rankings.slice(0, 50); // 只保留前50名

  localStorage.setItem("gameRankings", JSON.stringify(rankings));
}

function getCurrentRank() {
  let rankings = JSON.parse(localStorage.getItem("gameRankings") || "[]");
  rankings.sort((a, b) => b.time - a.time);

  for (let i = 0; i < rankings.length; i++) {
    if (rankings[i].time === gameState.survivedTime) {
      return i + 1;
    }
  }
  return rankings.length;
}

function showRankList() {
  let rankings = JSON.parse(localStorage.getItem("gameRankings") || "[]");
  rankings.sort((a, b) => b.time - a.time);

  const rankContent = document.getElementById("rankContent");

  if (rankings.length === 0) {
    rankContent.innerHTML =
      '<div style="text-align: center; padding: 50px; opacity: 0.6;">暂无排行数据<br>快来创造第一个记录吧！</div>';
  } else {
    let html = "";
    rankings.slice(0, 20).forEach((record, index) => {
      const medal =
        index === 0
          ? "🥇"
          : index === 1
          ? "🥈"
          : index === 2
          ? "🥉"
          : `${index + 1}.`;
      const className = index < 3 ? "rankItem top3" : "rankItem";
      html += `
                <div class="${className}">
                    <span>${medal} ${record.time.toFixed(2)}秒</span>
                    <span>${record.score}分</span>
                </div>
            `;
    });
    rankContent.innerHTML = html;
  }

  document.getElementById("rankList").style.display = "block";
}

function hideRankList() {
  document.getElementById("rankList").style.display = "none";
}

// 启动游戏循环
gameLoop(0);
