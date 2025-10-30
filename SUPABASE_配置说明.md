# Supabase 排行榜配置说明

## ✅ 已完成的配置

### 1. Supabase 项目信息
- **项目名称**: game-leaderboard
- **项目 ID**: upppvolvuxtlvinzdphd
- **项目 URL**: https://upppvolvuxtlvinzdphd.supabase.co
- **区域**: ap-northeast-1 (东京)
- **状态**: ACTIVE_HEALTHY

### 2. 数据库表结构

已创建 `leaderboard` 表,包含以下字段:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGSERIAL | 主键,自增 |
| name | TEXT | 玩家姓名 |
| score | INTEGER | 游戏分数 |
| time | INTEGER | 存活时间(秒) |
| created_at | TIMESTAMPTZ | 创建时间,默认当前时间 |

### 3. 数据库索引
- 已创建索引: `idx_leaderboard_score` (按 score DESC, time DESC 排序)

### 4. 安全策略 (RLS)
已启用行级安全策略:
- ✅ 允许公开读取 (SELECT)
- ✅ 允许公开插入 (INSERT)

### 5. 代码集成

#### 已修改的文件
- `escape.html` - 游戏主文件

#### 集成内容
1. **引入 Supabase SDK**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```

2. **初始化 Supabase 客户端**
   ```javascript
   const SUPABASE_URL = 'https://upppvolvuxtlvinzdphd.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGci...';
   const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```

3. **双存储机制**
   - 数据同时保存到 Supabase 和 localStorage
   - Supabase 失败时自动降级到 localStorage
   - 确保离线和在线都能正常工作

## 🎮 功能说明

### 排行榜功能
1. **保存分数**: 玩家提交分数时,自动保存到 Supabase 数据库
2. **读取排行榜**: 从 Supabase 读取全球排行榜数据
3. **前三名展示**: 首页显示当前前三名
4. **完整排行榜**: 显示前 20 名玩家

### 容错机制
- ✅ 网络失败时自动使用 localStorage 备份
- ✅ 数据同步到本地,提升加载速度
- ✅ 错误日志输出到控制台,便于调试

## 🔧 测试验证

已完成以下测试:
- ✅ 数据库表创建成功
- ✅ 插入测试数据成功
- ✅ 查询排序功能正常
- ✅ RLS 策略配置正确

## 📊 数据库管理

### 查看所有数据
访问 Supabase 控制台:
https://supabase.com/dashboard/project/upppvolvuxtlvinzdphd

### SQL 查询示例

#### 查看前 10 名
```sql
SELECT * FROM leaderboard 
ORDER BY score DESC, time DESC 
LIMIT 10;
```

#### 删除测试数据
```sql
DELETE FROM leaderboard WHERE name = '测试玩家';
```

#### 查看总记录数
```sql
SELECT COUNT(*) FROM leaderboard;
```

#### 清空所有数据
```sql
TRUNCATE TABLE leaderboard;
```

## 🚀 部署说明

### 当前配置
- 游戏地址: https://www.leiyumail.xyz/escape.html
- 数据库: Supabase (全球可访问)
- 备份: localStorage (本地浏览器)

### 注意事项
1. **API 密钥安全**: 当前使用的是 `anon` 密钥,已配置 RLS 策略,安全可用
2. **数据持久化**: Supabase 免费版提供 500MB 数据库空间,足够使用
3. **并发限制**: 免费版支持足够的并发连接数

## 📝 后续优化建议

1. **数据清理**: 定期清理旧数据,保留最近 30 天或前 1000 名
2. **防作弊**: 添加分数验证逻辑,防止异常高分
3. **实时更新**: 使用 Supabase Realtime 功能实现排行榜实时更新
4. **数据分析**: 添加统计功能,如日活跃用户、平均分数等
5. **玩家资料**: 扩展表结构,支持玩家头像、等级等信息

## 🔑 重要信息

### API 密钥 (已配置在代码中)
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcHB2b2x2dXh0bHZpbnpkcGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2OTk2NjYsImV4cCI6MjA3NzI3NTY2Nn0.n8Uukj_Bj2Zc1LWr0YJER5WCv0g3viFwDStVtTjjMbE`

⚠️ **注意**: Service Role Key 不应在前端代码中使用,仅用于后端管理操作。

## ✨ 完成状态

- [x] 创建 Supabase 项目
- [x] 创建数据库表
- [x] 配置 RLS 安全策略
- [x] 集成 Supabase SDK
- [x] 修改保存逻辑
- [x] 修改读取逻辑
- [x] 测试功能
- [x] 文档说明

**所有功能已完成并测试通过!** 🎉

