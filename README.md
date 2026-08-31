# 训练记录 Android App

这是一个用 [Capacitor](https://capacitorjs.com/) 把 `web-demo` 打包成安卓 APK 的项目。

## 项目结构

```
.
├── web-demo/              # 网页版训练记录（功能源码）
├── copy-web.js            # 把 web-demo 复制到 dist/
├── capacitor.config.json  # Capacitor 配置
├── package.json
└── .github/workflows/
    └── build-apk.yml      # GitHub Actions：自动构建 APK
```

## 本地构建 APK

### 前置条件

1. 安装 Node.js：https://nodejs.org
2. 安装 Android Studio 或 Android SDK
3. 配置环境变量：
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### 命令

```bash
npm install
npx cap add android        # 只需第一次执行
npm run build-debug        # 生成调试版 APK
```

生成的 APK：

```
android/app/build/outputs/apk/debug/app-debug.apk
```

如果要生成发布版（未签名）：

```bash
npm run build-release
```

> 发布到应用商店前，需要为 release APK 签名。

## GitHub Actions 自动构建

本项目已配置 `.github/workflows/build-apk.yml`。把代码推到 GitHub 后：

1. 进入仓库的 **Actions** 页面。
2. 选择 **Build APK** 工作流，点击 **Run workflow**。
3. 等待几分钟后，在页面底部下载 `app-debug.apk`。

## 注意事项

- `capacitor.config.json` 中的 `appId` 默认是 `com.example.sportrecord`，正式发布前请改成你自己的唯一包名。
- 当前 `web-demo/` 里的数据保存在浏览器 `localStorage` 中；Capacitor 打包后同样保存在 App 内部，卸载即清除。
