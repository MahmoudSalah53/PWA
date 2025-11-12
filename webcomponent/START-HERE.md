# 🚀 ابدأ من هنا - Voice Agent

## ✅ كل شيء جاهز!

تم بناء Voice Agent Web Component بنجاح! 🎉

---

## 🎯 الطريقة الأسهل - شغّل الآن!

```bash
cd webcomponent
npm run dev
```

افتح المتصفح على: **http://localhost:5173**

---

## 💡 هل يعمل؟

1. **افتح الصفحة** → سترى زر دائري في أسفل اليمين
2. **اضغط على الزر** → سيبدأ الاتصال
3. **شاهد الأنيميشنز!** → دوائر Siri تتحرك

### إذا لم يتصل:

**افتح Console (F12)** وشاهد الرسائل:

#### ✅ يعمل:
```
✅ Token received: {...}
✅ Connected to LiveKit!
```

#### ❌ خطأ في Token:
```
❌ Failed to get token: 404
```

**الحل:**
```bash
# تأكد أن الـ backend شغال على:
# http://148.230.125.200:9060
```

أو **عدّل في index.html:**
```html
<voice-agent
  token-endpoint="YOUR_BACKEND_URL/api/auth/livekit-token"
></voice-agent>
```

---

## 🎨 ماذا ترى في الصفحة؟

- ✅ صفحة جميلة مع gradients ألوان
- ✅ معلومات عن الـ Web Component
- ✅ Features cards
- ✅ تعليمات الاستخدام
- ✅ زر Voice Agent في أسفل اليمين (الأهم!)

---

## 🧪 كيف تجرب الوظائف؟

### 1. الاتصال الأساسي
- اضغط على الزر → ينتظر الاتصال
- ستظهر دائرة Siri متحركة

### 2. أزرار الاختبار
- **كليك يمين** على الزر
- ستظهر قائمة بأزرار الاختبار:
  - بحث: ايفون
  - منتج #1
  - منتج #2
  - فلاتر

### 3. الأوامر الصوتية (إذا اتصل)
جرب تقول:
- "ابحث عن ايفون"
- "روح للصفحة الرئيسية"
- "خذني للمنتجات"

---

## 📁 الملفات المهمة

```
webcomponent/
├── dist/
│   └── voice-agent.mjs       ← استخدم هذا في مشروعك
├── index.html                ← صفحة التجربة (افتحها الآن!)
├── voice-agent-component.ts  ← الكود المصدري
├── README.md                 ← توثيق كامل
├── QUICKSTART.md            ← دليل سريع
└── HOW-TO-RUN.md            ← حلول مشاكل الاتصال
```

---

## 🎯 استخدامه في مشروعك

### في HTML عادي:

```html
<script type="module" src="/voice-agent.mjs"></script>

<voice-agent
  backend-url="http://148.230.125.200:9060"
  livekit-url="wss://ecommerce-sgjr7auj.livekit.cloud"
  token-endpoint="http://148.230.125.200:9060/api/auth/livekit-token"
></voice-agent>
```

### في React/Next.js:

```tsx
// انسخ الملف
cp dist/voice-agent.mjs ../public/voice-agent.js

// في HTML
<script type="module" src="/voice-agent.js"></script>

// في Component
<voice-agent></voice-agent>
```

---

## 🔍 Debug - إذا لم يعمل

### 1. افتح Console (F12)

شاهد الرسائل:
- `✅ Token received` → Token جاء بنجاح
- `✅ Connected` → LiveKit متصل
- `❌ Failed to get token` → مشكلة في Backend
- `❌ Connection failed` → مشكلة في LiveKit

### 2. افتح Network Tab (F12)

عند الضغط على الزر، شاهد:
- Request إلى `/api/auth/livekit-token`
- Status code (يجب يكون 200)
- Response body (يجب يحتوي على token)

### 3. الأخطاء الشائعة

| الخطأ | السبب | الحل |
|-------|-------|------|
| `404 Not Found` | Backend مش شغال | شغل Backend أو غير URL |
| `CORS error` | Backend مش سامح requests | أضف CORS headers |
| `Connection timeout` | LiveKit URL غلط | تحقق من URL |
| `Token expired` | Token قديم | اضغط الزر مرة أخرى |

---

## ⚙️ إعدادات مهمة

### Backend URL
```html
backend-url="http://148.230.125.200:9060"
```
غيره إذا كان Backend على URL مختلف

### LiveKit URL
```html
livekit-url="wss://ecommerce-sgjr7auj.livekit.cloud"
```
غيره إذا كنت تستخدم LiveKit server مختلف

### Token Endpoint
```html
token-endpoint="http://YOUR_BACKEND/api/auth/livekit-token"
```
يجب يرجع: `{ token: "...", roomName: "..." }`

---

## ✨ المزايا الموجودة

- ✅ **Siri Animations** - دوائر ملونة متحركة
- ✅ **Audio Visualization** - تتحرك مع الصوت
- ✅ **LiveKit Integration** - اتصال صوتي كامل
- ✅ **RPC Methods** - navigate, search, filter
- ✅ **Events** - connected, disconnected, navigate
- ✅ **Test Buttons** - للاختبار السريع
- ✅ **TypeScript** - Type definitions كاملة
- ✅ **Shadow DOM** - معزول عن باقي CSS

---

## 📚 توثيق إضافي

- **README.md** - شرح كامل مع أمثلة لكل framework
- **QUICKSTART.md** - دليل سريع للاستخدام
- **HOW-TO-RUN.md** - حلول مشاكل الاتصال
- **BUILD.md** - تعليمات البناء

---

## 🎉 جاهز؟

```bash
npm run dev
```

**افتح:** http://localhost:5173

**اضغط** على الزر الدائري في أسفل اليمين

**استمتع!** 🎤

---

## 🆘 تحتاج مساعدة؟

1. اقرأ **HOW-TO-RUN.md** - فيه حلول لكل المشاكل
2. شاهد Console للـ errors
3. تحقق من Backend/LiveKit URLs
4. جرب أزرار الاختبار (كليك يمين)

---

**Made with ❤️ using Lit + LiveKit**

🚀 **Happy Coding!**

