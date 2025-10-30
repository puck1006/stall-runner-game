# Netlify 拖拽部署完整步骤

## 📦 准备工作

已为你准备好部署文件夹: `netlify-deploy/`

包含文件:
- ✅ `escape.html` - 游戏主文件
- ✅ `index.html` - 自动跳转到 escape.html

---

## 🚀 部署步骤

### Step 1: 访问 Netlify Drop

1. 打开浏览器,访问: **https://app.netlify.com/drop**
2. 如果没有账号,点击右上角 "Sign up" 注册(可以用 GitHub/Google 账号快速登录)

### Step 2: 拖拽部署

1. 打开 Finder,进入目录:
   ```
   /Users/tom/Desktop/摊位主理人_小游戏/netlify-deploy
   ```

2. **选中文件夹内的所有文件** (escape.html 和 index.html)

3. **拖拽到 Netlify Drop 页面的虚线框内**

4. 等待上传和部署(大约 10-30 秒)

5. 部署完成后,你会看到一个临时域名,类似:
   ```
   https://random-name-123456.netlify.app
   ```

6. 点击链接测试游戏是否正常运行

---

## 🌐 绑定自定义域名

### Step 1: 进入域名设置

1. 在 Netlify 部署成功页面,点击 **"Domain settings"** 或 **"Set up a custom domain"**

2. 或者点击左侧菜单 **"Domain management"**

### Step 2: 添加域名

1. 点击 **"Add custom domain"** 或 **"Add domain alias"**

2. 输入你的域名:
   ```
   www.leiyumail.xyz
   ```

3. 点击 **"Verify"**

4. Netlify 会检测域名,点击 **"Add domain"** 确认

### Step 3: 配置 DNS

Netlify 会显示需要添加的 DNS 记录,通常是:

```
类型: CNAME
名称: www
目标: random-name-123456.netlify.app
```

**记下这个目标地址!** 你需要在域名服务商那里配置。

---

## 🔧 DNS 配置(在域名服务商)

### 如果域名在 Cloudflare

1. 登录 Cloudflare: https://dash.cloudflare.com/

2. 选择域名 `leiyumail.xyz`

3. 点击左侧 **"DNS"** → **"Records"**

4. 点击 **"Add record"**

5. 填写:
   - **Type**: CNAME
   - **Name**: www
   - **Target**: `你的项目名.netlify.app` (从 Netlify 复制)
   - **Proxy status**: DNS only (灰色云朵,关闭代理)
   - **TTL**: Auto

6. 点击 **"Save"**

### 如果域名在阿里云

1. 登录阿里云控制台: https://dns.console.aliyun.com/

2. 找到域名 `leiyumail.xyz`,点击 **"解析设置"**

3. 点击 **"添加记录"**

4. 填写:
   - **记录类型**: CNAME
   - **主机记录**: www
   - **记录值**: `你的项目名.netlify.app`
   - **TTL**: 10分钟

5. 点击 **"确认"**

### 如果域名在腾讯云

1. 登录腾讯云 DNSPod: https://console.dnspod.cn/

2. 找到域名 `leiyumail.xyz`,点击 **"解析"**

3. 点击 **"添加记录"**

4. 填写:
   - **主机记录**: www
   - **记录类型**: CNAME
   - **记录值**: `你的项目名.netlify.app`
   - **TTL**: 600

5. 点击 **"保存"**

### 如果域名在 GoDaddy

1. 登录 GoDaddy: https://dcc.godaddy.com/

2. 找到域名 `leiyumail.xyz`,点击 **"DNS"**

3. 点击 **"Add"** → **"CNAME"**

4. 填写:
   - **Name**: www
   - **Value**: `你的项目名.netlify.app`
   - **TTL**: 1 Hour

5. 点击 **"Save"**

---

## ✅ 验证部署

### 1. 等待 DNS 生效

DNS 配置后需要等待 5-30 分钟生效。

### 2. 检查 DNS 是否生效

打开终端,运行:
```bash
nslookup www.leiyumail.xyz
```

如果看到指向 Netlify 的记录,说明 DNS 已生效。

### 3. 访问你的域名

在浏览器访问:
```
https://www.leiyumail.xyz/escape.html
```

或者:
```
https://www.leiyumail.xyz
```

### 4. HTTPS 证书

Netlify 会自动为你的域名配置 SSL 证书,通常在 DNS 生效后 1-5 分钟内完成。

如果看到 "Not secure" 警告,等待几分钟后刷新即可。

---

## 🔄 更新游戏

如果需要更新游戏内容:

### 方法 1: 重新拖拽部署

1. 修改 `escape.html`
2. 复制到 `netlify-deploy/` 文件夹
3. 访问 Netlify 项目页面
4. 点击 **"Deploys"** 标签
5. 将新文件拖拽到 **"Need to update your site?"** 区域

### 方法 2: 使用 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
cd /Users/tom/Desktop/摊位主理人_小游戏/netlify-deploy
netlify deploy --prod
```

---

## 📋 完整流程总结

1. ✅ 访问 https://app.netlify.com/drop
2. ✅ 拖拽 `netlify-deploy` 文件夹内的文件
3. ✅ 等待部署完成,获得临时域名
4. ✅ 测试临时域名是否正常
5. ✅ 点击 "Domain settings" 添加 `www.leiyumail.xyz`
6. ✅ 记下 Netlify 提供的 CNAME 目标地址
7. ✅ 在域名服务商添加 CNAME 记录
8. ✅ 等待 DNS 生效(5-30分钟)
9. ✅ 访问 https://www.leiyumail.xyz/escape.html
10. ✅ 完成! 🎉

---

## ❓ 常见问题

### Q: 域名访问显示 404

**A**: 检查 DNS 是否正确配置,等待 DNS 生效。

### Q: 显示 "Not secure"

**A**: 等待 Netlify 自动配置 SSL 证书,通常 1-5 分钟。

### Q: 想让根域名也能访问

**A**: 在 Netlify 添加 `leiyumail.xyz` (不带 www),然后在 DNS 添加 A 记录指向 Netlify 的 IP。

### Q: 如何查看访问统计

**A**: 在 Netlify 项目页面,点击 "Analytics" 查看访问数据。

---

## 📞 需要帮助?

如果遇到任何问题,告诉我具体的错误信息,我会帮你解决!

**当前状态**: 
- ✅ 文件已准备好: `/Users/tom/Desktop/摊位主理人_小游戏/netlify-deploy/`
- ⏳ 等待你拖拽部署到 Netlify
- ⏳ 等待绑定域名

**下一步**: 访问 https://app.netlify.com/drop 开始部署!

