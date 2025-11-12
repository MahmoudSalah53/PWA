# 🚀 Quick Start - استخدام Voice Agent

## ✨ ما تم إنجازه

تم تحويل `VoiceAgent.tsx` بالكامل إلى Web Component باستخدام **Lit** مع:

- ✅ **نفس التصميم بالضبط** - كل الـ SVG والأنيميشنز
- ✅ **Siri Pulse Circle** - الدوائر المتحركة الملونة
- ✅ **Audio Meter** - قياس مستوى الصوت (تم تحويل useAudioMeter hook إلى class)
- ✅ **LiveKit Integration** - كامل مع RPC methods
- ✅ **جميع الـ CSS Animations** - layerRotate, sphereGlow, corePulse, highlightDrift
- ✅ **Test Buttons** - أزرار الاختبار (كليك يمين)
- ✅ **Command Bubble** - الفقاعة التي تعرض الأوامر
- ✅ **Events System** - connected, disconnected, navigate, connection-error

---

## 📦 الملفات الناتجة

```
webcomponent/
├── dist/
│   ├── voice-agent.mjs       ← الملف الرئيسي (878 KB)
│   ├── voice-agent.d.ts      ← TypeScript definitions
│   └── voice-agent.mjs.map   ← Source map
├── voice-agent-component.ts  ← الكود المصدري
├── index.html               ← صفحة التجربة
├── package.json
├── README.md
└── QUICKSTART.md            ← هذا الملف
```

---

## 🧪 التجربة المحلية

### 1. تشغيل Dev Server

```bash
cd webcomponent
npm run dev
```

افتح المتصفح على: `http://localhost:5173`

### 2. ماذا سترى؟

- صفحة جميلة مع gradients
- زر دائري في أسفل اليمين (Voice Agent)
- معلومات عن الـ Web Component
- حالة الاتصال في الأعلى

### 3. كيف تجربه؟

1. **اضغط على الزر الدائري** → سيبدأ الاتصال بـ LiveKit
2. **انتظر حتى يتصل** → ستظهر أنيميشنز Siri
3. **تكلم معه**: 
   - "ابحث عن ايفون"
   - "روح للصفحة الرئيسية"
   - "خذني للمنتجات"
4. **كليك يمين على الزر** → ستظهر أزرار الاختبار

---

## 🎯 استخدامه في مشروعك

### الخطوة 1: انسخ الملف

```bash
# من مجلد webcomponent
cp dist/voice-agent.mjs ../public/voice-agent.js
```

### الخطوة 2: أضفه للـ HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>My App</h1>
  
  <!-- Voice Agent Web Component -->
  <voice-agent
    backend-url="http://148.230.125.200:9060"
    livekit-url="wss://ecommerce-sgjr7auj.livekit.cloud"
  ></voice-agent>

  <!-- Load the script -->
  <script type="module" src="/voice-agent.js"></script>

  <script>
    // استمع للـ events
    const voiceAgent = document.querySelector('voice-agent');
    
    voiceAgent.addEventListener('navigate', (event) => {
      console.log('Navigate to:', event.detail.route);
      // استخدم router هنا
      // router.push(event.detail.route);
    });
  </script>
</body>
</html>
```

### الخطوة 3: في React / Next.js

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
    <>
      <h1>My App</h1>
      {/* @ts-ignore */}
      <voice-agent></voice-agent>
    </>
  );
}
```

في `app/layout.tsx` أو `public/index.html`:

```html
<script type="module" src="/voice-agent.js"></script>
```

### الخطوة 4: في Angular

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ⚠️ مهم!
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

في `src/index.html`:

```html
<script type="module" src="assets/voice-agent.js"></script>
```

---

## 🎨 التخصيص

### تغيير الموقع

```css
voice-agent {
  bottom: 20px;
  left: 20px; /* بدلاً من اليمين */
}
```

### تغيير الخلفية

```css
voice-agent::part(button) {
  background: linear-gradient(to right, #your-color1, #your-color2);
}
```

### إخفاء في صفحات معينة

```css
.no-voice-page voice-agent {
  display: none;
}
```

---

## 📋 Properties المتاحة

| Property | Default | Description |
|----------|---------|-------------|
| `backend-url` | `http://148.230.125.200:9060` | رابط Backend API |
| `livekit-url` | `wss://ecommerce-sgjr7auj.livekit.cloud` | رابط LiveKit |
| `token-endpoint` | `/api/voice/getToken` | API endpoint للتوكن |
| `show-test-buttons` | `false` | إظهار أزرار الاختبار |

---

## 🎯 Events المتاحة

| Event | Description | Detail |
|-------|-------------|--------|
| `connected` | عند الاتصال بنجاح | - |
| `disconnected` | عند قطع الاتصال | - |
| `navigate` | طلب التنقل | `{ route, payload }` |
| `connection-error` | خطأ في الاتصال | `{ error }` |

---

## ⚡ ملاحظات مهمة

### 1. التصميم كامل 100%
جميع الأنيميشنز والتصميمات من `VoiceAgent.tsx` موجودة:
- ✅ SiriPulseCircle بكل الطبقات الملونة
- ✅ الدوائر تتحرك وتدور (layerRotate1, layerRotate2, etc)
- ✅ Core pulse animation
- ✅ Sphere glow animation  
- ✅ Highlight drift animation
- ✅ Audio level visualization

### 2. AudioMeter Class
تم تحويل `useAudioMeter` hook إلى class مع نفس المنطق:
- ✅ RMS calculation
- ✅ Smoothing
- ✅ Threshold filtering
- ✅ Frame-based updates

### 3. LiveKit Integration
كامل مع:
- ✅ Room connection
- ✅ Microphone enable
- ✅ Audio track subscription
- ✅ RPC methods: navigate, search, searchProduct, filter
- ✅ Data channel للـ transcripts

### 4. حجم الملف
- **878 KB** uncompressed
- **173 KB** gzipped
- يحتوي على livekit-client بالكامل

---

## 🐛 Troubleshooting

### المشكلة: الزر لا يظهر

**الحل:**
```html
<!-- تأكد من تحميل الـ script -->
<script type="module" src="/voice-agent.js"></script>
```

### المشكلة: "unknown element" في Angular

**الحل:**
```typescript
schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

### المشكلة: الـ Events لا تعمل في React

**الحل:**
```tsx
// استخدم addEventListener بدلاً من props
voiceAgent?.addEventListener('navigate', handler);
```

### المشكلة: الأنيميشنز لا تظهر

**الحل:**
الأنيميشنز مدمجة في Shadow DOM، لا تحتاج CSS خارجي!

---

## ✅ الخلاصة

تم بنجاح تحويل `VoiceAgent.tsx` بالكامل إلى Web Component باستخدام Lit مع:

1. ✅ كل التصميمات والأنيميشنز
2. ✅ AudioMeter للـ audio visualization
3. ✅ LiveKit integration كامل
4. ✅ RPC methods للتحكم
5. ✅ Events system للتواصل
6. ✅ Test buttons للاختبار
7. ✅ Command bubble
8. ✅ TypeScript support

**الملف جاهز للاستخدام في أي framework!** 🚀

---

Made with ❤️ using **Lit** + **LiveKit**

