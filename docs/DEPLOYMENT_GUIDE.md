# TravelLens - 多端部署指南

## 一、Web 端部署

### 1.1 开发环境

```bash
cd web
npm install
npm run dev
# 访问 http://localhost:5173
```

### 1.2 生产构建

```bash
npm run build
# 输出到 dist/ 目录
```

### 1.3 部署到 Vercel

```bash
npm i -g vercel
vercel --prod
```

---

## 二、iOS 端部署

### 2.1 初始化 Capacitor

```bash
cd web
npm install @capacitor/ios
npx cap add ios
```

### 2.2 同步代码

```bash
npm run build
npx cap sync ios
npx cap open ios
```

### 2.3 Xcode 配置

1. 打开 `ios/App/App.xcworkspace`
2. 配置 Bundle ID: `com.travellens.app`
3. 配置签名证书
4. 添加地图权限到 `Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要获取您的位置以显示附近景点</string>
```

### 2.4 打包上架

```bash
# Archive → Distribute → App Store Connect
```

---

## 三、Android 端部署

### 3.1 初始化

```bash
npm install @capacitor/android
npx cap add android
```

### 3.2 同步代码

```bash
npm run build
npx cap sync android
npx cap open android
```

### 3.3 Android Studio 配置

1. 修改 `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.travellens.app"
        minSdkVersion 22
        targetSdkVersion 33
    }
}
```

2. 添加地图权限到 `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 3.4 打包签名

```bash
cd android
./gradlew assembleRelease
# 输出: app/build/outputs/apk/release/app-release.apk
```
