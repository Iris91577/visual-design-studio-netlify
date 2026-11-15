# V7 部署说明

此版本让研究者后台的实验设置真正保存到 Netlify Blobs，并区分草稿与发布版本。

## 上传

将本文件夹内的项目文件覆盖上传到 GitHub 仓库根目录，提交到 `main`，等待 Netlify 部署完成。

## 必须配置的环境变量

在 Netlify 项目中进入 **Environment variables**，新增：

- Key: `VDS_ADMIN_PASSWORD`
- Value: 自己设置的研究者后台密码，建议至少 12 位。

保存后重新触发一次 Production deploy。

## 使用

1. 重新登录 `/admin/login`。
2. 修改实验设置并点击 **Save draft**。
3. Human/AI 研究者预览会读取最新草稿。
4. 点击 **Publish v2** 后，正式被试链接才会切换到 v2。

旧会话不会被新版本覆盖。
