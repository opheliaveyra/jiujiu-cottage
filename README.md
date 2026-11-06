# 玖玖の小屋 · Jiujiu's Atelier

一个轻量、可交互的个人作品小屋。静态网页，不需要打包工具或后端。

## 页面
- \`index.html\`：首页、作品卡、灵感橱窗、便签筛选、开发手记、灵感签。
- \`projects/cleos.html\`：Cleos 项目档案。
- \`projects/cistella.html\`：Cistella 项目档案。
- \`projects/ai-room.html\`：AI 群聊实验室项目档案。
- \`assets/site.css\`：响应式设计、日夜主题、渐入、飘浮和光影动画。
- \`assets/site.js\`：主题、进度条、低动效兼容、卡片筛选和灵感签。

## 本地查看
直接用浏览器打开 \`index.html\` 即可，或在项目根目录运行 \`python -m http.server 8000\`，访问 \`http://localhost:8000\`。

## Cloudflare Pages
若 Pages 项目已连接此仓库的 \`main\` 分支：
- 构建命令：留空
- 构建输出目录：\`/\`（项目根目录，或 \`.\`，按 Pages 界面要求设置）
- 无需框架预设、环境变量或秘密凭证

此仓库提交成功**不等于**已确认 Cloudflare Pages 部署成功；具体发布地址及自定义域名状态需在 Cloudflare Pages 中查看。不要把 \`00024.asia\` 自动绑定到站点。

## 交互与维护
- 尊重系统 \`prefers-reduced-motion\` 设置；不支持 JS 时正文依然可见。
- 夜间模式储存在浏览器本地，没有后台账号或数据上传。
- 原画展区目前使用 CSS 原创装饰图形，尚未导入独立的角色插画文件。更新时请以有权使用的本地图片素材替换并标注。
- 项目卡上的状态是创作说明，不等同于软件已正式发布。
