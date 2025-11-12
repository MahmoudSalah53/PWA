# 🎤 Voice Agent Web Component

مساعد صوتي ذكي مبني بـ **Lit** مع نفس التصميم والأنيميشنز من المشروع الأساسي!

## ✨ المزايا

- ✅ **Built with Lit** - خفيف وسريع
- ✅ **نفس التصميم** - كل التصميمات والأنيميشنز من VoiceAgent.tsx
- ✅ **Siri-style Animations** - أنيميشنز دائرية متحركة مع الصوت
- ✅ **Audio Meter** - قياس مستوى الصوت بدقة
- ✅ **LiveKit Integration** - اتصال صوتي متقدم
- ✅ **RPC Methods** - navigate, search, searchProduct, filter
- ✅ **Framework Agnostic** - يعمل مع أي framework
- ✅ **TypeScript** - Type definitions كاملة
- ✅ **Events System** - للتحكم من الخارج

## 📦 التثبيت والبناء

### 1. تثبيت Dependencies

```bash
cd webcomponent
npm install
```

### 2. Build للإنتاج

```bash
npm run build
```

سيتم إنشاء الملفات في `dist/`:
- `voice-agent.js` - الملف الرئيسي
- `voice-agent.d.ts` - TypeScript definitions

### 3. تشغيل Dev Server للتجربة

```bash
npm run dev
```

افتح المتصفح على `http://localhost:5173`

## 🎯 الاستخدام

### في HTML عادي

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>My App</h1>
  
  <!-- Voice Agent -->
  <voice-agent
    backend-url="http://148.230.125.200:9060"
    livekit-url="wss://ecommerce-sgjr7auj.livekit.cloud"
    token-endpoint="/api/voice/getToken"
  ></voice-agent>

  <!-- Load Script -->
  <script type="module" src="path/to/voice-agent.js"></script>

  <script>
    // Listen to events
    const voiceAgent = document.querySelector('voice-agent');
    
    voiceAgent.addEventListener('navigate', (event) => {
      console.log('Navigate to:', event.detail.route);
      // Use your router here
    });
  </script>
</body>
</html>
```

### في React

```jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const voiceAgentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const voiceAgent = voiceAgentRef.current;

    const handleNavigate = (e) => {
      navigate(e.detail.route);
    };

    voiceAgent?.addEventListener('navigate', handleNavigate);

    return () => {
      voiceAgent?.removeEventListener('navigate', handleNavigate);
    };
  }, [navigate]);

  return (
    <div>
      <h1>My React App</h1>
      <voice-agent ref={voiceAgentRef}></voice-agent>
    </div>
  );
}
```

```html
<!-- public/index.html -->
<script type="module" src="%PUBLIC_URL%/voice-agent.js"></script>
```

### في Angular

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <voice-agent
      backend-url="http://148.230.125.200:9060"
      (navigate)="handleNavigation($event)"
    ></voice-agent>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  handleNavigation(event: any) {
    this.router.navigateByUrl(event.detail.route);
  }
}
```

```html
<!-- index.html -->
<script type="module" src="assets/voice-agent.js"></script>
```

### في Vue

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>My Vue App</h1>
    <voice-agent 
      ref="voiceAgent"
      @navigate="handleNavigate"
    ></voice-agent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const voiceAgent = ref(null);

const handleNavigate = (event) => {
  router.push(event.detail.route);
};
</script>
```

```html
<!-- public/index.html -->
<script type="module" src="/voice-agent.js"></script>
```

### في Next.js

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const voiceAgent = document.querySelector('voice-agent');
    
    const handleNavigate = (e: any) => {
      router.push(e.detail.route);
    };

    voiceAgent?.addEventListener('navigate', handleNavigate);

    return () => {
      voiceAgent?.removeEventListener('navigate', handleNavigate);
    };
  }, [router]);

  return (
    <div>
      <h1>My Next.js App</h1>
      {/* @ts-ignore */}
      <voice-agent></voice-agent>
    </div>
  );
}
```

```html
<!-- app/layout.tsx or public/index.html -->
<script type="module" src="/voice-agent.js"></script>
```

## ⚙️ Properties (Attributes)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backend-url` | String | `http://148.230.125.200:9060` | رابط الـ Backend API |
| `livekit-url` | String | `wss://ecommerce-sgjr7auj.livekit.cloud` | رابط LiveKit Server |
| `token-endpoint` | String | `/api/voice/getToken` | Endpoint للحصول على Token |
| `show-test-buttons` | Boolean | `false` | إظهار أزرار الاختبار |

### مثال:

```html
<voice-agent
  backend-url="https://api.example.com"
  livekit-url="wss://livekit.example.com"
  token-endpoint="/api/voice/token"
  show-test-buttons="true"
></voice-agent>
```

## 📡 Events

### `connected`
يُطلق عند الاتصال بنجاح بالـ LiveKit

```javascript
voiceAgent.addEventListener('connected', () => {
  console.log('✅ Connected!');
});
```

### `disconnected`
يُطلق عند قطع الاتصال

```javascript
voiceAgent.addEventListener('disconnected', () => {
  console.log('❌ Disconnected');
});
```

### `navigate`
يُطلق عند طلب التنقل - يحتوي على:
- `detail.route` - المسار المطلوب
- `detail.payload` - البيانات الإضافية

```javascript
voiceAgent.addEventListener('navigate', (event) => {
  const { route, payload } = event.detail;
  console.log('Navigate to:', route);
  router.push(route);
});
```

### `connection-error`
يُطلق عند حدوث خطأ في الاتصال

```javascript
voiceAgent.addEventListener('connection-error', (event) => {
  console.error('Error:', event.detail);
});
```

## 🎨 التصميم والأنيميشنز

### Siri-style Orb
- دائرة متحركة مع طبقات ملونة
- تتحرك وتتوهج مع الصوت
- أنيميشنز ناعمة ومتزامنة

### Audio Level Visualization
- قياس مستوى الصوت بدقة
- تغيير حجم الدائرة حسب الصوت
- توهج وإضاءة ديناميكية

### Command Bubble
- فقاعة تظهر الأوامر الحالية
- أيقونة متحركة
- تختفي تلقائياً بعد ثواني

## 🎯 RPC Methods المتاحة

1. **`client.navigate`** - للتنقل بين الصفحات
2. **`client.search`** - للبحث عن منتجات
3. **`client.searchProduct`** - للبحث عن منتج محدد
4. **`client.filter`** - لتطبيق فلاتر

## 🔧 التخصيص

### تغيير الموقع:

```css
voice-agent {
  position: fixed;
  bottom: 20px;
  left: 20px; /* بدلاً من اليمين */
}
```

### إخفاء في صفحات معينة:

```css
.no-voice voice-agent {
  display: none;
}
```

## 🧪 التطوير

```bash
# Dev Server
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📁 الملفات

```
webcomponent/
├── voice-agent-component.ts  # الملف الرئيسي (Lit)
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript Config
├── vite.config.ts           # Build Config
├── index.html               # Test Page
└── README.md                # هذا الملف
```

## 🐛 Troubleshooting

### الـ Component لا يظهر:

1. تأكد من تحميل الـ script:
```html
<script type="module" src="voice-agent.js"></script>
```

2. تحقق من Console للأخطاء

### في Angular - "unknown element":

أضف `CUSTOM_ELEMENTS_SCHEMA`:
```typescript
schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

### الـ Events لا تعمل:

تأكد من استخدام `addEventListener` بدلاً من `@event` في بعض الـ frameworks

## 📄 License

MIT

---

Made with ❤️ using **Lit** + **LiveKit**

