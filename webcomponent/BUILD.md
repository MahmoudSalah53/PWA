# 🔨 Build Instructions - تعليمات البناء

## 📋 المتطلبات

- Node.js (v18 أو أحدث)
- npm

---

## 🚀 خطوات البناء

### 1. تثبيت Dependencies

```bash
cd webcomponent
npm install
```

سيتم تثبيت:
- `lit` - Web Components framework
- `livekit-client` - للاتصال الصوتي
- `vite` - Build tool
- `typescript` - Type checking

### 2. Development Mode

```bash
npm run dev
```

- سيفتح على `http://localhost:5173`
- Hot reload تلقائي
- لاختبار الـ Component

### 3. Build للإنتاج

```bash
npm run build
```

**الناتج في `dist/`:**
```
dist/
├── voice-agent.mjs       ← الملف الرئيسي (ESM format)
├── voice-agent.d.ts      ← TypeScript type definitions
└── voice-agent.mjs.map   ← Source map للـ debugging
```

**حجم الملف:**
- Uncompressed: **878 KB**
- Gzipped: **173 KB**

### 4. Preview بعد البناء

```bash
npm run preview
```

لعرض النسخة المبنية (production build)

---

## 📁 هيكل المشروع

```
webcomponent/
├── voice-agent-component.ts  ← المكون الرئيسي (Lit)
│   ├── AudioMeter class      ← لقياس الصوت
│   ├── VoiceAgentComponent   ← الـ Web Component
│   ├── renderSiriPulseCircle ← SVG animations
│   └── LiveKit integration   ← RPC methods
│
├── index.html               ← صفحة التجربة
├── package.json             ← Dependencies
├── tsconfig.json           ← TypeScript config
├── vite.config.ts          ← Build config
│
├── dist/                   ← Build output (بعد npm run build)
│   ├── voice-agent.mjs
│   ├── voice-agent.d.ts
│   └── voice-agent.mjs.map
│
├── README.md              ← Documentation
├── QUICKSTART.md         ← Quick start guide
└── BUILD.md              ← هذا الملف
```

---

## 🎯 استخدام الملف المبني

### في HTML عادي

```html
<script type="module" src="/voice-agent.mjs"></script>
<voice-agent></voice-agent>
```

### في React / Next.js

```bash
# انسخ الملف
cp dist/voice-agent.mjs ../public/voice-agent.js
```

```html
<!-- في public/index.html -->
<script type="module" src="/voice-agent.js"></script>
```

### في Angular

```bash
# انسخ الملف
cp dist/voice-agent.mjs ../src/assets/voice-agent.js
```

```html
<!-- في src/index.html -->
<script type="module" src="assets/voice-agent.js"></script>
```

---

## ⚙️ إعدادات البناء

### `vite.config.ts`

```typescript
{
  build: {
    lib: {
      entry: 'voice-agent-component.ts',
      name: 'VoiceAgent',
      fileName: 'voice-agent',
      formats: ['es']  // ESM only
    }
  }
}
```

**لماذا ESM فقط؟**
- Modern browsers support
- Tree shaking
- Smaller bundle size
- Web Components standard

---

## 🔍 ما تم بناؤه؟

### 1. Core Component
- ✅ LitElement base class
- ✅ Reactive properties
- ✅ Shadow DOM
- ✅ CSS animations

### 2. Audio Processing
```typescript
class AudioMeter {
  - AudioContext
  - AnalyserNode
  - RMS calculation
  - Smoothing algorithm
  - Level callback
}
```

### 3. Siri Animations
```typescript
renderSiriPulseCircle() {
  - SVG with gradients
  - Multiple ellipse layers
  - Rotation animations
  - Glow effects
  - Audio-reactive scaling
}
```

### 4. LiveKit Integration
```typescript
connectToLiveKit() {
  - Room connection
  - Track subscription
  - RPC method registration:
    * client.navigate
    * client.search
    * client.searchProduct
    * client.filter
}
```

### 5. Event System
```typescript
Events dispatched:
  - 'connected'
  - 'disconnected'
  - 'navigate'
  - 'connection-error'
```

---

## 🧪 التطوير

### Hot Reload

```bash
npm run dev
```

- التعديلات على `voice-agent-component.ts` تظهر فوراً
- التعديلات على `index.html` تُحدّث تلقائياً

### TypeScript Checking

```bash
# يتم تلقائياً أثناء البناء
npm run build
```

### Debugging

استخدم `voice-agent.mjs.map` للـ source maps في dev tools

---

## 📦 Dependencies

### Production
- **lit** (^3.1.0) - Web Components framework
- **livekit-client** (^2.0.0) - Real-time audio

### Development
- **vite** (^5.0.0) - Build tool
- **typescript** (^5.3.3) - Type checking
- **vite-plugin-dts** (^3.7.0) - Type definitions generation
- **@types/node** (^20.11.0) - Node types

---

## ⚡ تحسينات الأداء

### 1. Code Splitting
لا يتم تحميل LiveKit إلا عند الحاجة

### 2. Tree Shaking
Vite تزيل الكود غير المستخدم

### 3. Minification
Terser للتصغير

### 4. Gzip
173 KB بعد الضغط (من 878 KB)

---

## 🐛 مشاكل شائعة

### "Cannot find module 'lit'"

**الحل:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails with TypeScript errors

**الحل:**
```bash
npm run build -- --force
```

### Port 5173 already in use

**الحل:**
```bash
npm run dev -- --port 3000
```

---

## 📊 Build Stats

```
Analyzing bundle size...

voice-agent.mjs        878.96 kB
├── livekit-client     ~650 kB
├── lit                ~50 kB
└── component code     ~180 kB

Gzipped:              173.20 kB
```

---

## ✅ Checklist قبل الإنتاج

- [ ] `npm run build` بدون أخطاء
- [ ] اختبار في Chrome
- [ ] اختبار في Firefox
- [ ] اختبار في Safari
- [ ] اختبار في Edge
- [ ] اختبار على Mobile
- [ ] اختبار الـ Events
- [ ] اختبار الـ RPC methods
- [ ] اختبار الأنيميشنز
- [ ] اختبار Audio level

---

## 🎉 النتيجة

بعد البناء، ستحصل على:

1. ✅ Web Component كامل جاهز للاستخدام
2. ✅ TypeScript definitions للـ IDE support
3. ✅ Source maps للـ debugging
4. ✅ حجم محسّن (173 KB gzipped)
5. ✅ متوافق مع جميع الـ frameworks

**الملف `voice-agent.mjs` جاهز للنشر!** 🚀

---

Made with ❤️ using **Vite** + **Lit** + **TypeScript**

