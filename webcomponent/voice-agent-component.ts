import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Room, RoomEvent, Track } from 'livekit-client';

/**
 * AudioMeter Class - يحول useAudioMeter hook إلى class
 */
class AudioMeter {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private rafId: number | null = null;
  private smoothed: number = 0;
  private lastUpdate: number = 0;
  private updateCounter: number = 0;
  private callback: (level: number) => void;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(callback: (level: number) => void) {
    this.callback = callback;
  }

  start(stream: MediaStream) {
    this.stop();

    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (!this.analyser) {
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.6;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    try {
      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
    } catch (e) {
      console.error('Failed to create audio stream source:', e);
      return;
    }

    this.tick();
  }

  private tick = () => {
    if (!this.analyser || !this.dataArray) return;

    const data = this.dataArray;
    // @ts-ignore - TypeScript type mismatch but works correctly at runtime
    this.analyser.getByteTimeDomainData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / data.length);
    const mapped = Math.pow(rms, 0.6);

    const smoothingFactor = 0.25;
    const targetSmoothing = mapped > this.smoothed ? smoothingFactor * 1.2 : smoothingFactor * 0.9;
    this.smoothed = this.smoothed * (1 - targetSmoothing) + mapped * targetSmoothing;

    const finalLevel = Math.min(1, Math.max(0, this.smoothed));
    const threshold = 0.008;
    const cleanLevel = finalLevel > threshold ? finalLevel : 0;

    this.updateCounter++;
    if (this.updateCounter >= 3) {
      this.updateCounter = 0;
      const diff = Math.abs(cleanLevel - this.lastUpdate);
      if (diff > 0.02) {
        this.lastUpdate = cleanLevel;
        this.callback(cleanLevel);
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    try {
      if (this.source) this.source.disconnect();
      if (this.analyser) this.analyser.disconnect();
    } catch (e) {
      console.error('Error disconnecting audio meter:', e);
    }
    this.smoothed = 0;
    this.lastUpdate = 0;
    this.callback(0);
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

@customElement('voice-agent')
export class VoiceAgentComponent extends LitElement {
  // Properties
  @property({ type: String, attribute: 'backend-url' })
  backendUrl = 'http://148.230.125.200:9060';

  @property({ type: String, attribute: 'livekit-url' })
  livekitUrl = 'wss://ecommerce-sgjr7auj.livekit.cloud';

  @property({ type: String, attribute: 'token-endpoint' })
  tokenEndpoint = '/api/voice/getToken';

  @property({ type: Boolean, attribute: 'show-test-buttons' })
  showTestButtons = false;

  // State
  @state() private _isConnected = false;
  @state() private _isConnecting = false;
  @state() private currentCommand = '';
  @state() private isAgentSpeaking = false;
  @state() private audioLevel = 0;

  // Private fields
  private room: Room | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private audioMeter: AudioMeter | null = null;
  private token: string | null = null;
  private roomName: string | null = null;

  constructor() {
    super();
    this.audioMeter = new AudioMeter((level: number) => {
      this.audioLevel = level;
      this.isAgentSpeaking = level > 0.05;
    });
  }

  static styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 50;
    }

    .container {
      position: relative;
    }

    .test-panel {
      position: absolute;
      bottom: 96px;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 16px;
      min-width: 250px;
    }

    .test-panel-title {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .test-button {
      width: 100%;
      padding: 8px 12px;
      margin-top: 8px;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .test-button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .test-button.green {
      background: #10b981;
    }

    .test-button.blue {
      background: #3b82f6;
    }

    .test-button.purple {
      background: #a855f7;
    }

    .test-button.orange {
      background: #f97316;
    }

    .test-button.gray {
      background: #9ca3af;
      color: #374151;
    }

    .voice-button {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;  /* ← شفاف تماماً! */
      box-shadow: none;  /* ← بدون ظل */
    }

    .voice-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .voice-button.connecting {
      background: transparent;  /* ← شفاف حتى عند الاتصال */
    }

    .voice-button.idle {
      background: transparent;  /* ← شفاف */
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .command-bubble {
      position: absolute;
      bottom: 96px;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 16px;
      min-width: 300px;
      max-width: 400px;
      border: 1px solid rgba(229, 231, 235, 1);
    }

    .command-content {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .command-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    .command-text-wrapper {
      flex: 1;
    }

    .command-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .command-text {
      font-size: 14px;
      color: #111827;
    }

    /* SVG Animations */
    @keyframes sphereGlow {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 0.85; }
    }

    @keyframes layerRotate1 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes layerRotate2 {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @keyframes layerRotate3 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes layerRotate4 {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @keyframes corePulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    @keyframes highlightDrift {
      0%, 100% { transform: translate(0, 0); opacity: 0.25; }
      50% { transform: translate(5px, 5px); opacity: 0.35; }
    }

    .siri-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      cursor: pointer;
      transition: transform 0.15s ease-out;
    }

    .siri-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3));
    }
  `;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }
    if (this.audioMeter) {
      this.audioMeter.dispose();
    }
  }

  private async searchProductByName(productName: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.backendUrl}/api/services/search?query=${encodeURIComponent(productName)}&k=1`
      );

      if (!response.ok) return null;

      const data = await response.json();

      if (data.services && data.services.length > 0) {
        const product = data.services[0];
        return {
          id: product.serviceId || product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          image: product.image,
          inStock: product.inStock,
        };
      }

      return null;
    } catch (error) {
      console.error('Product search error:', error);
      return null;
    }
  }

  private async handleNavigation(payload: any) {
    try {
      let route = '/';
      let displayMessage = '';

      if (
        payload.product_name ||
        payload.service_name ||
        payload.name ||
        payload.product ||
        payload.service
      ) {
        const productName =
          payload.product_name ||
          payload.service_name ||
          payload.name ||
          payload.product ||
          payload.service;
        this.currentCommand = `🔍 Searching for "${productName}"...`;

        const product = await this.searchProductByName(productName);

        if (product && product.id) {
          route = `/services/${product.id}`;
          displayMessage = `Found: ${product.name}`;
        } else {
          route = `/services?search=${encodeURIComponent(productName)}`;
          displayMessage = `Searching for "${productName}"`;
        }
      } else if (payload.product_id || payload.service_id || payload.id) {
        const serviceId = String(payload.product_id || payload.service_id || payload.id);
        route = `/services/${serviceId}`;
        displayMessage = `Opening product #${serviceId}`;
      } else if (payload.url) {
        route = payload.url;
        displayMessage = `Navigating to ${route}`;
      } else if (payload.page) {
        const pageMap: { [key: string]: string } = {
          home: '/',
          products: '/services',
          services: '/services',
          cart: '/cart',
          checkout: '/checkout',
          dashboard: '/profile',
          profile: '/profile',
          login: '/auth/signin',
          signin: '/auth/signin',
          signup: '/auth/signup',
        };
        route = pageMap[payload.page.toLowerCase()] || '/';
        displayMessage = `Going to ${payload.page}`;
      }

      this.currentCommand = displayMessage;
      
      // Dispatch navigate event
      this.dispatchEvent(
        new CustomEvent('navigate', {
          detail: { route, payload },
          bubbles: true,
          composed: true,
        })
      );

      setTimeout(() => {
        this.currentCommand = '';
      }, 3000);

      return {
        status: 'success',
        message: `Navigated to ${route}`,
        route: route,
        data: payload,
      };
    } catch (error) {
      console.error('Navigation error:', error);
      return {
        status: 'error',
        message: 'Navigation failed',
      };
    }
  }

  private async handleSearch(payload: any) {
    try {
      const query =
        payload.query || payload.product_name || payload.service_name || payload.name || '';
      const category = payload.category || '';

      if (query && !category) {
        this.currentCommand = `🔍 Searching for "${query}"...`;
        const product = await this.searchProductByName(query);

        if (product && product.id) {
          const route = `/services/${product.id}`;
          this.currentCommand = `Found: ${product.name}`;
          
          this.dispatchEvent(
            new CustomEvent('navigate', {
              detail: { route },
              bubbles: true,
              composed: true,
            })
          );

          setTimeout(() => {
            this.currentCommand = '';
          }, 3000);

          return {
            status: 'success',
            message: `Found product: ${product.name}`,
            route: route,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
            },
          };
        }
      }

      let route = '/services';
      const params = new URLSearchParams();

      if (query) params.append('search', query);
      if (category) params.append('category', category);
      if (params.toString()) route += `?${params.toString()}`;

      this.currentCommand = `Searching for: ${query || category}`;
      
      this.dispatchEvent(
        new CustomEvent('navigate', {
          detail: { route },
          bubbles: true,
          composed: true,
        })
      );

      setTimeout(() => {
        this.currentCommand = '';
      }, 2000);

      return {
        status: 'success',
        message: `Searched for ${query || category}`,
        route: route,
        data: payload,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        status: 'error',
        message: 'Search failed',
      };
    }
  }

  private async handleProductSearch(payload: any) {
    try {
      const productName = payload.product_name || payload.name || payload.query || '';

      if (!productName) {
        return {
          status: 'error',
          message: 'Product name required',
          product: null,
        };
      }

      this.currentCommand = `🔍 Searching for "${productName}"...`;
      const product = await this.searchProductByName(productName);
      setTimeout(() => {
        this.currentCommand = '';
      }, 2000);

      if (product && product.id) {
        const productId = String(product.id);

        return {
          status: 'success',
          message: `Found product: ${product.name}`,
          product: {
            id: productId,
            product_id: productId,
            name: product.name,
            price: product.price,
            category: product.category,
            inStock: product.inStock !== false,
          },
        };
      } else {
        return {
          status: 'not_found',
          message: `Product not found: ${productName}`,
          product: null,
        };
      }
    } catch (error) {
      console.error('Product search error:', error);
      return {
        status: 'error',
        message: 'Search error',
        product: null,
      };
    }
  }

  private async handleFilter(payload: any) {
    try {
      const { action, filters } = payload;

      if (action === 'filter' && filters) {
        let route = '/services';
        const params = new URLSearchParams();

        if (filters.categories && filters.categories.length > 0) {
          params.append('category', filters.categories.join(','));
        }

        if (filters.brands && filters.brands.length > 0) {
          params.append('brand', filters.brands.join(','));
        }

        if (filters.price_ranges && filters.price_ranges.length > 0) {
          params.append('price_range', filters.price_ranges.join(','));
        }

        if (filters.features && filters.features.length > 0) {
          params.append('feature', filters.features.join(','));
        }

        if (params.toString()) {
          route += `?${params.toString()}`;
        }

        this.currentCommand = `Applying filters...`;
        
        this.dispatchEvent(
          new CustomEvent('navigate', {
            detail: { route },
            bubbles: true,
            composed: true,
          })
        );

        setTimeout(() => {
          this.currentCommand = '';
        }, 2000);

        return {
          status: 'success',
          message: 'Filters applied',
          route: route,
          filters: filters,
        };
      } else {
        throw new Error('Invalid filter data');
      }
    } catch (error) {
      console.error('Filter error:', error);
      return {
        status: 'error',
        message: 'Filter failed',
      };
    }
  }

  private async connectToLiveKit(connectionToken?: string, connectionRoom?: string) {
    const useToken = connectionToken || this.token;
    const useRoom = connectionRoom || this.roomName;

    if (!useToken || !useRoom || this._isConnected) return;

    this._isConnecting = true;

    try {
      const room = new Room({ adaptiveStream: true, dynacast: true });
      this.room = room;

      room.on(RoomEvent.Connected, () => {
        this._isConnected = true;
        this._isConnecting = false;

        this.dispatchEvent(
          new CustomEvent('connected', {
            bubbles: true,
            composed: true,
          })
        );

        // Register RPC methods
        room.localParticipant.registerRpcMethod('client.navigate', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await this.handleNavigation(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.search', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await this.handleSearch(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.searchProduct', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await this.handleProductSearch(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.filter', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await this.handleFilter(payload);
          return JSON.stringify(result);
        });
      });

      room.on(RoomEvent.Disconnected, () => {
        this._isConnected = false;
        this._isConnecting = false;
        this.room = null;
        if (this.audioElement) {
          this.audioElement.remove();
          this.audioElement = null;
        }
        if (this.audioMeter) {
          this.audioMeter.stop();
        }

        this.dispatchEvent(
          new CustomEvent('disconnected', {
            bubbles: true,
            composed: true,
          })
        );
      });

      room.on(RoomEvent.TrackSubscribed, (track: Track) => {
        if (track.kind === 'audio') {
          const audioEl = track.attach() as HTMLAudioElement;
          this.audioElement = audioEl;
          document.body.appendChild(audioEl);
          audioEl.play();

          try {
            const stream = new MediaStream([track.mediaStreamTrack]);
            if (this.audioMeter) {
              this.audioMeter.start(stream);
            }
          } catch (e) {
            console.error('Failed to capture agent audio stream:', e);
          }
        }
      });

      room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
        try {
          const message = new TextDecoder().decode(payload);
          const data = JSON.parse(message);
          if (data.type === 'transcript' && data.text) {
            this.currentCommand = data.text;
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      });

      await room.connect(this.livekitUrl, useToken, { autoSubscribe: true });
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (err) {
      console.error('Connection failed:', err);
      this._isConnecting = false;
      
      this.dispatchEvent(
        new CustomEvent('connection-error', {
          detail: { error: err },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private disconnectFromLiveKit() {
    if (this.room) this.room.disconnect();
    if (this.audioElement) this.audioElement.remove();
    this.token = null;
    this.roomName = null;
    this._isConnected = false;
    this.currentCommand = '';
    this.isAgentSpeaking = false;
    if (this.audioMeter) {
      this.audioMeter.stop();
    }
  }

  private async getFreshToken() {
    const sessionId =
      localStorage.getItem('sessionId') ||
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);

    const identity = `Guest-${sessionId.slice(-6)}`;

    const res = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: identity,
        title: 'Customer',
        identity: identity,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Token error:', errorText);
      throw new Error(`Failed to get token: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log('✅ Token received:', data);

    // Handle different response formats
    // Format 1: { token, room }
    // Format 2: { token, roomName }
    // Format 3: { accessToken, roomName }
    return {
      token: data.token || data.accessToken,
      room: data.room || data.roomName || `room-${Date.now()}`,
    };
  }

  private async toggleConnection() {
    if (this._isConnected) {
      this.disconnectFromLiveKit();
    } else {
      try {
        this._isConnecting = true;
        const { token: newToken, room: newRoom } = await this.getFreshToken();
        this.token = newToken;
        this.roomName = newRoom;
        await this.connectToLiveKit(newToken, newRoom);
      } catch (err) {
        console.error('Token error:', err);
        this._isConnecting = false;
      }
    }
  }

  private renderSiriPulseCircle(level: number, isSpeaking: boolean, isStatic: boolean) {
    const layer1Speed = 8;
    const layer2Speed = 10;
    const layer3Speed = 12;
    const layer4Speed = 9;
    const layer5Speed = 11;
    const coreSpeed = 2.5;
    const sphereSpeed = 3;
    const highlightSpeed = 4;

    const pulseScale = isStatic ? 1 : 1 + level * 0.3;
    const glowIntensity = isStatic ? 0.3 : isSpeaking ? 0.6 + level * 0.4 : 0.3;

    const scaleStyle = `scale(${pulseScale})`;

    const sphereOpacity = isStatic ? 0.7 : isSpeaking && level > 0.1 ? 0.85 + level * 0.15 : 0.7;
    const sphereDropShadow = isStatic
      ? 20
      : isSpeaking && level > 0.1
      ? 20 + level * 40
      : 20;
    const sphereBrightness = isSpeaking && level > 0.1 ? 1.1 + level * 0.6 : 1;

    const layer1Opacity = isStatic ? 0.6 : isSpeaking && level > 0.1 ? 0.7 + level * 0.3 : 0.6;
    const layer2Opacity = isStatic ? 0.55 : isSpeaking && level > 0.1 ? 0.65 + level * 0.35 : 0.55;
    const layer3Opacity = isStatic ? 0.5 : isSpeaking && level > 0.1 ? 0.6 + level * 0.4 : 0.5;
    const layer4Opacity = isStatic ? 0.5 : isSpeaking && level > 0.1 ? 0.6 + level * 0.4 : 0.5;
    const layer5Opacity = isStatic ? 0.4 : isSpeaking && level > 0.1 ? 0.5 + level * 0.5 : 0.4;

    const layerBrightness = isSpeaking && level > 0.1 ? 1.2 + level * 0.8 : 1;

    const coreRadius = isStatic ? 35 : isSpeaking && level > 0.1 ? 35 + level * 12 : 35;
    const coreDropShadow = isStatic ? 15 : isSpeaking && level > 0.1 ? 15 + level * 35 : 15;
    const coreGlowOpacity = isSpeaking && level > 0.1 ? 0.5 + level * 0.5 : 0.4;
    const coreBrightness = isSpeaking && level > 0.1 ? 1.3 + level * 0.9 : 1;

    const highlightOpacity = isStatic ? 0.25 : isSpeaking && level > 0.1 ? 0.35 + level * 0.5 : 0.25;
    const highlightBrightness = isSpeaking && level > 0.1 ? 1.4 + level * 1 : 1;

    return html`
      <div class="siri-circle" style="transform: ${scaleStyle}">
        <svg viewBox="0 0 320 320" class="siri-svg">
          <defs>
            <radialGradient id="mainSphere" cx="40%" cy="40%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
              <stop offset="20%" stop-color="#e0f2fe" stop-opacity="0.4" />
              <stop offset="40%" stop-color="#7dd3fc" stop-opacity="0.3" />
              <stop offset="70%" stop-color="#0e7490" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#001f3f" stop-opacity="1" />
            </radialGradient>

            <linearGradient id="cyanLayer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.5" />
              <stop offset="50%" stop-color="#22d3ee" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#067e8c" stop-opacity="0.3" />
            </linearGradient>

            <linearGradient id="blueLayer" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5" />
              <stop offset="50%" stop-color="#60a5fa" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#1e40af" stop-opacity="0.3" />
            </linearGradient>

            <linearGradient id="pinkLayer" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ec4899" stop-opacity="0.5" />
              <stop offset="50%" stop-color="#f472b6" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#be185d" stop-opacity="0.3" />
            </linearGradient>

            <linearGradient id="purpleLayer" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.5" />
              <stop offset="50%" stop-color="#d946ef" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#6b21a8" stop-opacity="0.3" />
            </linearGradient>

            <linearGradient id="greenLayer" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.4" />
              <stop offset="50%" stop-color="#6ee7b7" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#047857" stop-opacity="0.2" />
            </linearGradient>

            <radialGradient id="brightCore" cx="50%" cy="50%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
              <stop offset="30%" stop-color="#f0f9ff" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0" />
            </radialGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Removed outer border circle for cleaner look -->

          <circle
            cx="160"
            cy="160"
            r="150"
            fill="url(#mainSphere)"
            style="
              animation: ${isStatic ? 'none' : `sphereGlow ${sphereSpeed}s ease-in-out infinite`};
              opacity: ${sphereOpacity};
              filter: drop-shadow(0 0 ${sphereDropShadow}px rgba(6, 182, 212, ${glowIntensity})) brightness(${sphereBrightness});
              transition: opacity 0.2s ease-out, filter 0.2s ease-out;
            "
          />

          <g style="animation: ${isStatic ? 'none' : `layerRotate1 ${layer1Speed}s linear infinite`}; transform-origin: 160px 160px;">
            <ellipse
              cx="160"
              cy="100"
              rx="65"
              ry="85"
              fill="url(#cyanLayer)"
              opacity="${layer1Opacity}"
              style="filter: ${isSpeaking && level > 0.1 ? `brightness(${layerBrightness})` : 'none'}; transition: opacity 0.2s ease-out, filter 0.2s ease-out;"
            />
          </g>

          <g style="animation: ${isStatic ? 'none' : `layerRotate2 ${layer2Speed}s linear infinite`}; transform-origin: 160px 160px;">
            <ellipse
              cx="200"
              cy="160"
              rx="75"
              ry="70"
              fill="url(#pinkLayer)"
              opacity="${layer2Opacity}"
              style="filter: ${isSpeaking && level > 0.1 ? `brightness(${layerBrightness})` : 'none'}; transition: opacity 0.2s ease-out, filter 0.2s ease-out;"
            />
          </g>

          <g style="animation: ${isStatic ? 'none' : `layerRotate3 ${layer3Speed}s linear infinite`}; transform-origin: 160px 160px;">
            <ellipse
              cx="140"
              cy="200"
              rx="80"
              ry="60"
              fill="url(#blueLayer)"
              opacity="${layer3Opacity}"
              style="filter: ${isSpeaking && level > 0.1 ? `brightness(${layerBrightness})` : 'none'}; transition: opacity 0.2s ease-out, filter 0.2s ease-out;"
            />
          </g>

          <g style="animation: ${isStatic ? 'none' : `layerRotate4 ${layer4Speed}s linear infinite`}; transform-origin: 160px 160px;">
            <ellipse
              cx="110"
              cy="150"
              rx="70"
              ry="75"
              fill="url(#purpleLayer)"
              opacity="${layer4Opacity}"
              style="filter: ${isSpeaking && level > 0.1 ? `brightness(${layerBrightness})` : 'none'}; transition: opacity 0.2s ease-out, filter 0.2s ease-out;"
            />
          </g>

          <g style="animation: ${isStatic ? 'none' : `layerRotate1 ${layer5Speed}s linear infinite`}; transform-origin: 160px 160px;">
            <ellipse
              cx="180"
              cy="120"
              rx="60"
              ry="80"
              fill="url(#greenLayer)"
              opacity="${layer5Opacity}"
              style="filter: ${isSpeaking && level > 0.1 ? `brightness(${layerBrightness})` : 'none'}; transition: opacity 0.2s ease-out, filter 0.2s ease-out;"
            />
          </g>

          <circle
            cx="160"
            cy="160"
            r="${coreRadius}"
            fill="url(#brightCore)"
            style="
              animation: ${isStatic ? 'none' : `corePulse ${coreSpeed}s ease-in-out infinite`};
              filter: drop-shadow(0 0 ${coreDropShadow}px rgba(255, 255, 255, ${coreGlowOpacity})) brightness(${coreBrightness});
              transition: r 0.2s ease-out, filter 0.2s ease-out;
            "
          />

          <ellipse
            cx="135"
            cy="135"
            rx="40"
            ry="45"
            fill="#ffffff"
            opacity="${highlightOpacity}"
            style="
              animation: ${isStatic ? 'none' : `highlightDrift ${highlightSpeed}s ease-in-out infinite`};
              filter: blur(8px) ${isSpeaking && level > 0.1 ? `brightness(${highlightBrightness})` : ''};
              transition: opacity 0.2s ease-out, filter 0.2s ease-out;
            "
          />
        </svg>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container">
        ${this.showTestButtons
          ? html`
              <div class="test-panel">
                <p class="test-panel-title">🧪 Test Functions:</p>
                <button
                  class="test-button green"
                  @click=${() => this.handleNavigation({ product_name: 'ايفون' })}
                >
                  بحث: ايفون
                </button>
                <button
                  class="test-button blue"
                  @click=${() => this.handleNavigation({ product_id: '1' })}
                >
                  منتج #1
                </button>
                <button
                  class="test-button purple"
                  @click=${() => this.handleNavigation({ product_id: '2' })}
                >
                  منتج #2
                </button>
                <button
                  class="test-button orange"
                  @click=${() =>
                    this.handleFilter({
                      action: 'filter',
                      filters: {
                        categories: ['الإلكترونيات'],
                        brands: ['Apple', 'Samsung'],
                        price_ranges: ['1000-5000'],
                        features: ['شحن مجاني'],
                      },
                    })}
                >
                  فلاتر
                </button>
                <button
                  class="test-button gray"
                  @click=${() => {
                    this.showTestButtons = false;
                  }}
                >
                  إخفاء
                </button>
              </div>
            `
          : ''}

        <button
          class="voice-button ${this._isConnecting ? 'connecting' : 'idle'}"
          ?disabled=${this._isConnecting}
          @click=${this.toggleConnection}
          @contextmenu=${(e: Event) => {
            e.preventDefault();
            this.showTestButtons = !this.showTestButtons;
          }}
        >
          ${this._isConnecting
            ? html`<div class="spinner"></div>`
            : this._isConnected
            ? this.renderSiriPulseCircle(this.audioLevel, this.isAgentSpeaking, false)
            : this.renderSiriPulseCircle(0, false, true)}
        </button>

        ${this.currentCommand
          ? html`
              <div class="command-bubble">
                <div class="command-content">
                  <div class="command-icon">
                    <div
                      style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(to right, #14b8a6, #06b6d4);"
                    ></div>
                  </div>
                  <div class="command-text-wrapper">
                    <p class="command-label">AI Assistant</p>
                    <p class="command-text">${this.currentCommand}</p>
                  </div>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'voice-agent': VoiceAgentComponent;
  }
}

