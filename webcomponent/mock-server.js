// Mock API Server للتجربة المحلية
// يوفر endpoint للحصول على LiveKit token

import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock endpoint للحصول على token
app.post('/api/voice/getToken', async (req, res) => {
  try {
    const { name = 'Guest', title = 'Customer' } = req.body;

    // LiveKit credentials (من environment variables أو hardcoded للتجربة)
    const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'APILwPn2HWFZ1Mc';
    const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'your-secret-here';
    const LIVEKIT_URL = process.env.LIVEKIT_URL || 'wss://ecommerce-sgjr7auj.livekit.cloud';

    // إنشاء room name فريد
    const roomName = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // إنشاء token
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: name,
      name: title,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = token.toJwt();

    console.log(`✅ Token created for ${name} in room ${roomName}`);

    res.json({
      token: jwt,
      room: roomName,
      url: LIVEKIT_URL,
    });
  } catch (error) {
    console.error('❌ Error creating token:', error);
    res.status(500).json({
      error: 'Failed to create token',
      message: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📡 Token endpoint: http://localhost:${PORT}/api/voice/getToken`);
});

