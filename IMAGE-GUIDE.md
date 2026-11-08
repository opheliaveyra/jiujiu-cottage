# 玖玖の小屋 · 图片更换指南

本次更新把首页的 10 处图片统一成可替换插画槽。原来的 CSS 插画不会删除。没有上传图片、图片路径错误或加载失败时，旧插画仍显示，不会出现破图。

## 怎么替换

1. 在仓库中创建（或使用）目录 `assets/visuals/`，把图片上传进去，例如 `assets/visuals/miorune.webp`。
2. 编辑 `assets/visuals-config.js`，找到 `"project-miorune"`，将 `src:""` 改为 `src:"assets/visuals/miorune.webp"`。
3. 提交至你要预览的分支并刷新页面。此时所有访问该分支页面的人会看到新图，而不是只有当前浏览器能看到。

## 所有可更换的位置

| 配置 key | 页面中的位置 |
| --- | --- |
| project-miorune | Miorune 项目封面 |
| project-cistella | Cistella 项目封面 |
| project-ai-room | AI 群聊项目封面 |
| studio-sunset | 灵感区：落日收藏夹 |
| studio-moon | 灵感区：夜色写给月亮 |
| studio-sketch | 灵感区：未完成的草图 |
| scrapbook-miorune | 创作手记：手机 |
| scrapbook-cistella | 创作手记：世界 |
| scrapbook-ai | 创作手记：群聊 |
| scrapbook-cottage | 创作手记：网页小屋 |

建议作品封面使用横图，正式绘画尽量保持原图比例，优先 WebP 或 AVIF；文件名建议使用英文或数字。

## 画廊操作

首页的「灵感也需要一个角落」区，现在每个插画卡右上角有「查看作品」。点击会打开大图；键盘左右箭头、弹窗内的左右按钮或手机横向滑动都能换图，按 Esc 或点击关闭按钮退出。

大图也遵循图片配置：还没有正式图时展示旧 CSS 插画，上传图片后自动使用新图。

## 不会改变的部分

- 暂不覆盖正式 `main`：本次修改在 `illustrated-preview-v1` 分支。
- `00024.asia` 不因为这次提交而自动绑定。
- 不会把用户本地挑选的照片自动上传到服务器。
