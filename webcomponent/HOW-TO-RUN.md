# 🚀 كيف تشغل Voice Agent للتجربة

## ⚠️ المشكلة

الـ Voice Agent محتاج **LiveKit Token** عشان يتصل، والتوكن ده بيجي من API endpoint.

عندك **3 طرق** للتشغيل:

---

## 🎯 الطريقة 1: استخدام المشروع الأساسي (Next.js)

### الخطوات:

**Terminal 1: شغل المشروع الأساسي**
```bash
# من المجلد الرئيسي
cd ..
npm run dev
```
سيعمل على: `http://localhost:3000`

**Terminal 2: شغل webcomponent dev server**
```bash
# من مجلد webcomponent
npm run dev
```
سيعمل على: `http://localhost:5173`

**عدّل vite.config.ts:**
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',  // ← المشروع الأساسي
    changeOrigin: true,
  }
}
```

---

## 🎯 الطريقة 2: استخدام Mock API (أسرع للتجربة)

### الخطوات:

**1. ثبت الـ dependencies:**
```bash
npm install
```

**2. شغل Mock API Server:**

**Terminal 1:**
```bash
npm run mock-api
```
سيعمل على: `http://localhost:3001`

**Terminal 2:**
```bash
npm run dev
```
سيعمل على: `http://localhost:5173`

**ملاحظة:** الـ vite.config.ts مضبوط على port 3001 تلقائياً!

---

## 🎯 الطريقة 3: استخدام Token مباشر (للاختبار السريع)

بدل ما تستخدم API، استخدم token مباشر:

**عدّل index.html:**

```html
<script>
  // Override getFreshToken method
  const voiceAgent = document.querySelector('voice-agent');
  
  // Wait for component to be ready
  customElements.whenDefined('voice-agent').then(() => {
    // Inject a test token directly
    voiceAgent.setAttribute('token-endpoint', 'mock');
    
    // Override the getFreshToken method
    const originalConnect = voiceAgent.toggleConnection;
    voiceAgent.toggleConnection = async function() {
      // استخدم token من Backend مباشرة
      const response = await fetch('http://148.230.125.200:9060/api/auth/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: 'Guest-Test' })
      });
      
      const { token, roomName } = await response.json();
      this.token = token;
      this.roomName = roomName;
      await this.connectToLiveKit(token, roomName);
    };
  });
</script>
```

---

## ✅ التحقق من أن كل شيء يعمل

### 1. افتح Console في المتصفح

اضغط `F12` واذهب لـ **Console**

### 2. اضغط على زر Voice Agent

يجب أن ترى:
```
✅ Connected to LiveKit!
```

### 3. إذا رأيت أخطاء:

#### خطأ: "Failed to fetch"
```
❌ TypeError: Failed to fetch
```
**الحل:** تأكد أن Mock API Server شغال على port 3001

#### خطأ: "Failed to get token"
```
❌ Failed to get token
```
**الحل:** تحقق من:
- Mock server شغال
- vite.config.ts proxy مضبوط صح
- أو استخدم المشروع الأساسي

#### خطأ: "Connection failed"
```
❌ Connection failed: WebSocket connection failed
```
**الحل:** تحقق من LiveKit URL في:
- `index.html` → `livekit-url` attribute
- Backend يجب يكون شغال على `http://148.230.125.200:9060`

---

## 🎉 الخلاصة السريعة

**للتجربة الأسرع:**

```bash
# Terminal 1
npm install
npm run mock-api

# Terminal 2
npm run dev
```

افتح: `http://localhost:5173`

اضغط على الزر الدائري → استمتع! 🎤

---

## 🔍 Debug Tips

### تأكد أن Mock API يعمل:
```bash
curl http://localhost:3001/health
# يجب أن يرد: {"status":"ok"}
```

### تأكد أن Proxy يعمل:
افتح في المتصفح:
```
http://localhost:5173/api/health
```

### شاهد الـ Network في Dev Tools:
1. اضغط F12
2. اذهب لـ Network tab
3. اضغط على زر Voice Agent
4. شاهد الـ request لـ `/api/voice/getToken`

---

## 📝 ملاحظات مهمة

### LiveKit Credentials
الـ Mock server يحتاج LiveKit credentials:

```bash
# في mock-server.js
const LIVEKIT_API_KEY = 'YOUR_KEY';
const LIVEKIT_API_SECRET = 'YOUR_SECRET';
```

أو ضعها في environment variables:
```bash
export LIVEKIT_API_KEY="your-key"
export LIVEKIT_API_SECRET="your-secret"
npm run mock-api
```

### CORS Issues
إذا واجهت مشاكل CORS:
- Mock server فيه `cors()` middleware
- Vite proxy يحل المشكلة تلقائياً
- أو استخدم المشروع الأساسي

---

## 🆘 مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| الزر ما يتصل | تأكد Mock API شغال |
| Connection timeout | تحقق من LiveKit URL |
| Token expired | أعد تشغيل Mock server |
| Proxy error | تحقق من port في vite.config |

---

## ✅ Checklist

- [ ] `npm install` ✅
- [ ] Mock server شغال (`npm run mock-api`)
- [ ] Dev server شغال (`npm run dev`)
- [ ] افتح `http://localhost:5173`
- [ ] اضغط على الزر الدائري
- [ ] شاهد Console للـ logs
- [ ] جرب الكلام!

---

**كل شيء جاهز؟ شغّل الآن!** 🚀

```bash
npm install && npm run mock-api &
npm run dev
```

