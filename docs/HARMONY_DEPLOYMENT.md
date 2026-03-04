## 四、鸿蒙端部署

### 4.1 技术方案

**方案选择**: 使用 **WebView 容器** + **HMS Core 地图服务**

鸿蒙暂不支持 Capacitor 官方插件，需要手动配置。

### 4.2 创建鸿蒙项目

1. 下载 DevEco Studio
2. 创建新项目: `Empty Ability (JS)`
3. 配置项目结构:

```
harmony/
├── entry/
│   ├── src/
│   │   └── main/
│   │       ├── js/
│   │       │   └── default/
│   │       │       ├── pages/
│   │       │       │   └── index/
│   │       │       │       ├── index.hml
│   │       │       │       ├── index.css
│   │       │       │       └── index.js
│   │       └── config.json
│   └── build.gradle
└── build.gradle
```

### 4.3 WebView 集成

**index.hml**:
```html
<div class="container">
  <web src="{{webUrl}}" id="web"></web>
</div>
```

**index.js**:
```javascript
export default {
  data: {
    webUrl: 'https://travellens.com'  // 或本地 file:///
  },
  onInit() {
    this.$element('web').setWebViewClient({
      onPageBegin: (url) => {
        console.log('Page loading: ' + url);
      }
    });
  }
}
```

### 4.4 HMS 地图集成

1. 在华为开发者联盟申请 API Key
2. 添加依赖到 `build.gradle`:

```gradle
dependencies {
    implementation 'com.huawei.hms:maps:6.10.0.300'
}
```

3. 配置权限到 `config.json`:

```json
{
  "reqPermissions": [
    {
      "name": "ohos.permission.LOCATION"
    },
    {
      "name": "ohos.permission.INTERNET"
    }
  ]
}
```

### 4.5 打包发布

```bash
# 生成 HAP 包
./gradlew assembleRelease

# 输出: entry/build/outputs/hap/release/entry-release.hap
```

上传到华为应用市场审核。

---

## 五、多端差异处理

### 5.1 平台检测

```typescript
// src/utils/platform.ts
export const getPlatform = (): 'web' | 'ios' | 'android' | 'harmony' => {
  if (typeof window === 'undefined') return 'web';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('harmony')) return 'harmony';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  if (ua.includes('android')) return 'android';
  
  return 'web';
};
```

### 5.2 地图服务适配

```typescript
// src/services/map.service.ts
import { getPlatform } from '@/utils/platform';

export class MapService {
  static getMapSDK() {
    const platform = getPlatform();
    
    switch(platform) {
      case 'web':
        return import('./map/amap-web');
      case 'ios':
      case 'android':
        return import('./map/amap-native');
      case 'harmony':
        return import('./map/hms-map');
    }
  }
}
```
