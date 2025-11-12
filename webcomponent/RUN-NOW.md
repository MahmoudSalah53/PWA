# 🚀 شغّل الآن - تعليمات بسيطة

## ✅ الحل النهائي للمشكلة

المشكلة: **Token endpoint مش موجود (404)**  
الحل: **شغل المشروع الأساسي (Next.js) الأول!**

---

## 📋 الخطوات (بالترتيب)

### 1️⃣ شغل المشروع الأساسي (Next.js)

**Terminal 1:**
```bash
# اطلع من مجلد webcomponent لو انت فيه
cd ..

# شغل المشروع الأساسي
npm run dev
```

✅ **انتظر حتى ترى:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

### 2️⃣ شغل webcomponent dev server

**Terminal 2 (جديد):**
```bash
# ادخل لمجلد webcomponent
cd webcomponent

# شغل dev server
npm run dev
```

✅ **انتظر حتى ترى:**
```
VITE v5.x.x  ready in xxx ms
➜ Local:   http://localhost:5173
```

---

### 3️⃣ افتح المتصفح

افتح: **http://localhost:5173**

---

### 4️⃣ جرب Voice Agent

1. **اضغط على الزر الدائري** (أسفل اليمين)
2. **افتح Console (اضغط F12)**
3. **شاهد الرسائل:**

✅ **المفروض تشوف:**
```
✅ Token received: {token: "...", room: "..."}
✅ Connected to LiveKit!
```

❌ **لو شفت:**
```
❌ Failed to get token: 404
```
**يعني المشروع الأساسي مش شغال!**

---

## 🎯 ملخص سريع

```bash
# Terminal 1: المشروع الأساسي
cd PWA  # المجلد الرئيسي
npm run dev  # port 3000

# Terminal 2: Web Component
cd PWA/webcomponent
npm run dev  # port 5173
```

**افتح:** http://localhost:5173  
**اضغط:** الزر الدائري  
**استمتع:** بالأنيميشنز! 🎨

---

## 🔍 كيف يعمل؟

```
Browser (localhost:5173)
    ↓
    | يطلب /api/voice/getToken
    ↓
Vite Proxy
    ↓
    | يحول الطلب إلى localhost:3000
    ↓
Next.js API (localhost:3000)
    ↓
    | يتصل بـ Backend
    ↓
Backend (148.230.125.200:9060)
    ↓
    | يرجع Token
    ↓
Voice Agent يتصل بـ LiveKit ✅
```

---

## ❌ مشاكل شائعة وحلولها

### المشكلة 1: "404 Not Found"
```
❌ Failed to get token: 404
```

**السبب:** المشروع الأساسي مش شغال

**الحل:**
```bash
# Terminal 1
cd .. # اطلع من webcomponent
npm run dev # شغل Next.js
```

---

### المشكلة 2: "EADDRINUSE: Port 3000 already in use"
```
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**السبب:** في حاجة تانية شغالة على port 3000

**الحل:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# اقفل أي برنامج على port 3000 وأعد المحاولة
```

---

### المشكلة 3: "Connection failed"
```
✅ Token received
❌ Connection failed: WebSocket connection failed
```

**السبب:** LiveKit URL غلط أو Token مش صحيح

**الحل:**
1. تحقق من LiveKit URL في `index.html`
2. تأكد أن Backend شغال: `http://148.230.125.200:9060`

---

### المشكلة 4: "Proxy error"
```
❌ [vite] http proxy error
```

**السبب:** Next.js مش شغال على port 3000

**الحل:** تأكد أن Terminal 1 فيه Next.js شغال

---

## 🧪 اختبار سريع

### 1. تأكد أن Next.js شغال:
افتح في متصفح جديد: http://localhost:3000

يجب أن تشوف المشروع الأساسي

### 2. تأكد أن API شغال:
افتح Console وجرب:
```javascript
fetch('http://localhost:3000/api/voice/getToken', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Test'})
}).then(r => r.json()).then(console.log)
```

يجب أن ترجع: `{token: "...", room: "..."}`

### 3. تأكد أن Proxy شغال:
من صفحة `localhost:5173`، افتح Console:
```javascript
fetch('/api/voice/getToken', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Test'})
}).then(r => r.json()).then(console.log)
```

يجب أن تنجح!

---

## ✨ بعد ما يشتغل

### جرب الأوامر:
1. **كليك يمين** على الزر → أزرار الاختبار
2. جرب:
   - بحث: ايفون
   - منتج #1
   - فلاتر

### شاهد الأنيميشنز:
- الدوائر تدور
- الألوان تتحرك
- يتوهج مع الصوت

---

## 🎉 كل شيء يعمل؟

**رائع!** الآن لديك:
- ✅ Voice Agent Web Component شغال
- ✅ LiveKit متصل
- ✅ Siri animations تعمل
- ✅ RPC methods جاهزة

**الخطوة التالية:**
استخدمه في مشروعك! انظر `README.md` لأمثلة React/Angular/Vue

---

## 📞 تحتاج مساعدة؟

1. **افتح Console (F12)** وشاهد الأخطاء
2. **اقرأ HOW-TO-RUN.md** للتفاصيل
3. **تحقق من Terminals** - يجب أن يكون اثنان يعملان

---

**الآن شغّل! 🚀**

```bash
# Terminal 1
npm run dev

# Terminal 2  
cd webcomponent && npm run dev
```

