"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAudioMeter from "../app/hooks/useAudioMeter";
import AIIconMotion from "./ai-icon";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://148.230.125.200:9060";

// Animated 3D Siri-style orb component
function SiriPulseCircle({ 
  level = 0, 
  isSpeaking = false, 
  isStatic = false 
}: { 
  level?: number; 
  isSpeaking?: boolean;
  isStatic?: boolean;
}) {
  const layer1Speed = 8;
  const layer2Speed = 10;
  const layer3Speed = 12;
  const layer4Speed = 9;
  const layer5Speed = 11;
  const coreSpeed = 2.5;
  const sphereSpeed = 3;
  const highlightSpeed = 4;
  
  const pulseScale = isStatic ? 1 : 1 + (level * 0.30);
  const glowIntensity = isStatic ? 0.3 : (isSpeaking ? 0.6 + (level * 0.4) : 0.3);

  return (
    <div 
      className="flex items-center justify-center w-16 h-16 cursor-pointer relative transition-transform duration-150 ease-out" 
      style={{ transform: `scale(${pulseScale})` }}
    >
      <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="mainSphere" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0e7490" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#001f3f" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="cyanLayer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#067e8c" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="blueLayer" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="pinkLayer" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#be185d" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="purpleLayer" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#d946ef" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="greenLayer" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
          </linearGradient>

          <radialGradient id="brightCore" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#f0f9ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        <circle cx="160" cy="160" r="155" fill="none" stroke="#000a1a" strokeWidth="2" opacity="0.5" />

        <circle
          cx="160"
          cy="160"
          r="150"
          fill="url(#mainSphere)"
          style={{
            animation: isStatic ? 'none' : `sphereGlow ${sphereSpeed}s ease-in-out infinite`,
            opacity: isStatic ? 0.7 : (isSpeaking && level > 0.1 ? 0.85 + (level * 0.15) : 0.7),
            filter: `drop-shadow(0 0 ${isStatic ? 20 : (isSpeaking && level > 0.1 ? 20 + (level * 40) : 20)}px rgba(6, 182, 212, ${glowIntensity})) brightness(${isSpeaking && level > 0.1 ? 1.1 + (level * 0.6) : 1})`,
            transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
          }}
        />

        <g style={{ animation: isStatic ? 'none' : `layerRotate1 ${layer1Speed}s linear infinite`, transformOrigin: "160px 160px" }}>
          <ellipse 
            cx="160" cy="100" rx="65" ry="85" 
            fill="url(#cyanLayer)" 
            opacity={isStatic ? 0.6 : (isSpeaking && level > 0.1 ? 0.7 + (level * 0.3) : 0.6)}
            style={{ 
              filter: (isSpeaking && level > 0.1) ? `brightness(${1.2 + (level * 0.8)})` : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          />
        </g>

        <g style={{ animation: isStatic ? 'none' : `layerRotate2 ${layer2Speed}s linear infinite reverse`, transformOrigin: "160px 160px" }}>
          <ellipse 
            cx="200" cy="160" rx="75" ry="70" 
            fill="url(#pinkLayer)" 
            opacity={isStatic ? 0.55 : (isSpeaking && level > 0.1 ? 0.65 + (level * 0.35) : 0.55)}
            style={{ 
              filter: (isSpeaking && level > 0.1) ? `brightness(${1.2 + (level * 0.8)})` : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          />
        </g>

        <g style={{ animation: isStatic ? 'none' : `layerRotate3 ${layer3Speed}s linear infinite`, transformOrigin: "160px 160px" }}>
          <ellipse 
            cx="140" cy="200" rx="80" ry="60" 
            fill="url(#blueLayer)" 
            opacity={isStatic ? 0.5 : (isSpeaking && level > 0.1 ? 0.6 + (level * 0.4) : 0.5)}
            style={{ 
              filter: (isSpeaking && level > 0.1) ? `brightness(${1.2 + (level * 0.8)})` : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          />
        </g>

        <g style={{ animation: isStatic ? 'none' : `layerRotate4 ${layer4Speed}s linear infinite reverse`, transformOrigin: "160px 160px" }}>
          <ellipse 
            cx="110" cy="150" rx="70" ry="75" 
            fill="url(#purpleLayer)" 
            opacity={isStatic ? 0.5 : (isSpeaking && level > 0.1 ? 0.6 + (level * 0.4) : 0.5)}
            style={{ 
              filter: (isSpeaking && level > 0.1) ? `brightness(${1.2 + (level * 0.8)})` : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          />
        </g>

        <g style={{ animation: isStatic ? 'none' : `layerRotate1 ${layer5Speed}s linear infinite`, transformOrigin: "160px 160px" }}>
          <ellipse 
            cx="180" cy="120" rx="60" ry="80" 
            fill="url(#greenLayer)" 
            opacity={isStatic ? 0.4 : (isSpeaking && level > 0.1 ? 0.5 + (level * 0.5) : 0.4)}
            style={{ 
              filter: (isSpeaking && level > 0.1) ? `brightness(${1.2 + (level * 0.8)})` : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          />
        </g>

        <circle
          cx="160"
          cy="160"
          r={isStatic ? 35 : (isSpeaking && level > 0.1 ? 35 + (level * 12) : 35)}
          fill="url(#brightCore)"
          style={{
            animation: isStatic ? 'none' : `corePulse ${coreSpeed}s ease-in-out infinite`,
            filter: isStatic 
              ? `drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))` 
              : `drop-shadow(0 0 ${isSpeaking && level > 0.1 ? 15 + (level * 35) : 15}px rgba(255, 255, 255, ${isSpeaking && level > 0.1 ? 0.5 + (level * 0.5) : 0.4})) brightness(${isSpeaking && level > 0.1 ? 1.3 + (level * 0.9) : 1})`,
            transition: 'r 0.2s ease-out, filter 0.2s ease-out'
          }}
        />

        <ellipse
          cx="135"
          cy="135"
          rx="40"
          ry="45"
          fill="#ffffff"
          opacity={isStatic ? 0.25 : (isSpeaking && level > 0.1 ? 0.35 + (level * 0.5) : 0.25)}
          style={{
            animation: isStatic ? 'none' : `highlightDrift ${highlightSpeed}s ease-in-out infinite`,
            filter: (isSpeaking && level > 0.1) ? `blur(8px) brightness(${1.4 + (level * 1)})` : "blur(8px)",
            transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
          }}
        />
      </svg>
    </div>
  );
}

export default function VoiceAgent() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const roomRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTestButtons, setShowTestButtons] = useState(false);

  const [agentAudioStream, setAgentAudioStream] = useState<MediaStream | null>(null);
  const { level } = useAudioMeter(agentAudioStream);

  useEffect(() => {
    setIsAgentSpeaking(level > 0.05);
  }, [level]);

  const searchProductByName = async (productName: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/services/search?query=${encodeURIComponent(productName)}&k=1`
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
          inStock: product.inStock
        };
      }

      return null;
    } catch (error) {
      console.error("Product search error:", error);
      return null;
    }
  };

  const handleNavigation = async (payload: any) => {
    try {
      let route = "/";
      let displayMessage = "";

      if (payload.product_name || payload.service_name || payload.name || payload.product || payload.service) {
        const productName = payload.product_name || payload.service_name || payload.name || payload.product || payload.service;
        setCurrentCommand(`🔍 Searching for "${productName}"...`);

        const product = await searchProductByName(productName);

        if (product && product.id) {
          route = `/services/${product.id}`;
          displayMessage = `Found: ${product.name}`;
        } else {
          route = `/services?search=${encodeURIComponent(productName)}`;
          displayMessage = `Searching for "${productName}"`;
        }
      }
      else if (payload.product_id || payload.service_id || payload.id) {
        const serviceId = String(payload.product_id || payload.service_id || payload.id);
        route = `/services/${serviceId}`;
        displayMessage = `Opening product #${serviceId}`;
      }
      else if (payload.url) {
        route = payload.url;
        displayMessage = `Navigating to ${route}`;
      }
      else if (payload.page) {
        const pageMap: { [key: string]: string } = {
          "home": "/",
          "products": "/services",
          "services": "/services",
          "cart": "/cart",
          "checkout": "/checkout",
          "dashboard": "/profile",
          "profile": "/profile",
          "login": "/auth/signin",
          "signin": "/auth/signin",
          "signup": "/auth/signup",
        };
        route = pageMap[payload.page.toLowerCase()] || "/";
        displayMessage = `Going to ${payload.page}`;
      }

      setCurrentCommand(displayMessage);
      router.push(route);
      setTimeout(() => setCurrentCommand(""), 3000);

      return {
        status: "success",
        message: `Navigated to ${route}`,
        route: route,
        data: payload
      };
    } catch (error) {
      console.error("Navigation error:", error);
      return {
        status: "error",
        message: "Navigation failed"
      };
    }
  };

  const handleSearch = async (payload: any) => {
    try {
      const query = payload.query || payload.product_name || payload.service_name || payload.name || "";
      const category = payload.category || "";

      if (query && !category) {
        setCurrentCommand(`🔍 Searching for "${query}"...`);
        const product = await searchProductByName(query);

        if (product && product.id) {
          const route = `/services/${product.id}`;
          setCurrentCommand(`Found: ${product.name}`);
          router.push(route);
          setTimeout(() => setCurrentCommand(""), 3000);

          return {
            status: "success",
            message: `Found product: ${product.name}`,
            route: route,
            product: {
              id: product.id,
              name: product.name,
              price: product.price
            }
          };
        }
      }

      let route = "/services";
      const params = new URLSearchParams();

      if (query) params.append("search", query);
      if (category) params.append("category", category);
      if (params.toString()) route += `?${params.toString()}`;

      setCurrentCommand(`Searching for: ${query || category}`);
      router.push(route);
      setTimeout(() => setCurrentCommand(""), 2000);

      return {
        status: "success",
        message: `Searched for ${query || category}`,
        route: route,
        data: payload
      };
    } catch (error) {
      console.error("Search error:", error);
      return {
        status: "error",
        message: "Search failed"
      };
    }
  };

  const handleProductSearch = async (payload: any) => {
    try {
      const productName = payload.product_name || payload.name || payload.query || "";

      if (!productName) {
        return {
          status: "error",
          message: "Product name required",
          product: null
        };
      }

      setCurrentCommand(`🔍 Searching for "${productName}"...`);
      const product = await searchProductByName(productName);
      setTimeout(() => setCurrentCommand(""), 2000);

      if (product && product.id) {
        const productId = String(product.id);

        return {
          status: "success",
          message: `Found product: ${product.name}`,
          product: {
            id: productId,
            product_id: productId,
            name: product.name,
            price: product.price,
            category: product.category,
            inStock: product.inStock !== false
          }
        };
      } else {
        return {
          status: "not_found",
          message: `Product not found: ${productName}`,
          product: null
        };
      }
    } catch (error) {
      console.error("Product search error:", error);
      return {
        status: "error",
        message: "Search error",
        product: null
      };
    }
  };

  const handleFilter = async (payload: any) => {
    try {
      const { action, filters } = payload;

      if (action === "filter" && filters) {
        let route = "/services";
        const params = new URLSearchParams();

        if (filters.categories && filters.categories.length > 0) {
          params.append("category", filters.categories.join(","));
        }

        if (filters.brands && filters.brands.length > 0) {
          params.append("brand", filters.brands.join(","));
        }

        if (filters.price_ranges && filters.price_ranges.length > 0) {
          params.append("price_range", filters.price_ranges.join(","));
        }

        if (filters.features && filters.features.length > 0) {
          params.append("feature", filters.features.join(","));
        }

        if (params.toString()) {
          route += `?${params.toString()}`;
        }

        setCurrentCommand(`Applying filters...`);
        router.push(route);
        setTimeout(() => setCurrentCommand(""), 2000);

        return {
          status: "success",
          message: "Filters applied",
          route: route,
          filters: filters
        };
      } else {
        throw new Error("Invalid filter data");
      }
    } catch (error) {
      console.error("Filter error:", error);
      return {
        status: "error",
        message: "Filter failed"
      };
    }
  };

  useEffect(() => {
    return () => {
      if (roomRef.current) roomRef.current.disconnect();
      if (audioRef.current) audioRef.current.remove();
    };
  }, []);

  const connectToLiveKit = async (connectionToken?: string, connectionRoom?: string) => {
    const useToken = connectionToken || token;
    const useRoom = connectionRoom || roomName;

    if (!useToken || !useRoom || isConnected) return;

    setIsConnecting(true);

    try {
      const { Room, RoomEvent } = await import('livekit-client');
      const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://ecommerce-sgjr7auj.livekit.cloud";

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Register RPC methods for agent communication
        room.localParticipant.registerRpcMethod('client.navigate', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await handleNavigation(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.search', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await handleSearch(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.searchProduct', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await handleProductSearch(payload);
          return JSON.stringify(result);
        });

        room.localParticipant.registerRpcMethod('client.filter', async (data: any) => {
          const payload = JSON.parse(data.payload);
          const result = await handleFilter(payload);
          return JSON.stringify(result);
        });
      });

      room.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setIsConnecting(false);
        roomRef.current = null;
        if (audioRef.current) {
          audioRef.current.remove();
          audioRef.current = null;
        }
        setAgentAudioStream(null);
      });

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === 'audio') {
          const audioEl = track.attach();
          audioRef.current = audioEl;
          document.body.appendChild(audioEl);
          audioEl.play();

          try {
            const stream = new MediaStream([track.mediaStreamTrack]);
            setAgentAudioStream(stream);
          } catch (e) {
            console.error("Failed to capture agent audio stream:", e);
          }
        }
      });

      room.on(RoomEvent.DataReceived, (payload) => {
        try {
          const message = new TextDecoder().decode(payload);
          const data = JSON.parse(message);
          if (data.type === 'transcript' && data.text) {
            setCurrentCommand(data.text);
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      });

      await room.connect(LIVEKIT_URL, useToken, { autoSubscribe: true });
      await room.localParticipant.setMicrophoneEnabled(true);

    } catch (err) {
      console.error("Connection failed:", err);
      setIsConnecting(false);
    }
  };

  const disconnectFromLiveKit = () => {
    if (roomRef.current) roomRef.current.disconnect();
    if (audioRef.current) audioRef.current.remove();
    setToken(null);
    setRoomName(null);
    setIsConnected(false);
    setCurrentCommand("");
    setIsAgentSpeaking(false);
    setAgentAudioStream(null);
  };

  const getFreshToken = async () => {
    const sessionId = localStorage.getItem('sessionId') ||
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);

    const res = await fetch("/api/voice/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Guest-${sessionId.slice(-6)}`,
        title: "Customer"
      }),
    });

    if (!res.ok) throw new Error("Failed to get token");
    return await res.json();
  };

  const toggleConnection = async () => {
    if (isConnected) {
      disconnectFromLiveKit();
    } else {
      try {
        setIsConnecting(true);
        const { token: newToken, room: newRoom } = await getFreshToken();
        setToken(newToken);
        setRoomName(newRoom);
        await connectToLiveKit(newToken, newRoom);
      } catch (err) {
        console.error("Token error:", err);
        setIsConnecting(false);
      }
    }
  };

  // Test functions (right-click on button to show)
  const testSearchiPhone = async () => {
    await handleNavigation({ product_name: "ايفون" });
  };

  const testNavigateToProduct = async (productId: string) => {
    await handleNavigation({ product_id: productId });
  };

  const testFilters = async () => {
    const testFilterData = {
      action: "filter",
      filters: {
        categories: ["الإلكترونيات"],
        brands: ["Apple", "Samsung"],
        price_ranges: ["1000-5000"],
        features: ["شحن مجاني"]
      }
    };

    const result = await handleFilter(testFilterData);

    if (result.status === "success") {
      alert(`✅ Filters applied!\n${result.route}`);
    } else {
      alert(`❌ Filter failed: ${result.message}`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showTestButtons && (
        <div className="absolute bottom-24 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[250px] space-y-2">
          <p className="text-xs font-semibold text-gray-700 mb-2">🧪 Test Functions:</p>
          <button
            onClick={() => testSearchiPhone()}
            className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            بحث: ايفون
          </button>
          <button
            onClick={() => testNavigateToProduct("1")}
            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            منتج #1
          </button>
          <button
            onClick={() => testNavigateToProduct("2")}
            className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            منتج #2
          </button>
          <button
            onClick={() => testFilters()}
            className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
          >
            فلاتر
          </button>
          <button
            onClick={() => setShowTestButtons(false)}
            className="w-full px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            إخفاء
          </button>
        </div>
      )}

      <button
        onClick={toggleConnection}
        disabled={isConnecting}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowTestButtons(!showTestButtons);
        }}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
          isConnecting 
            ? "bg-gradient-to-r from-teal-600 to-cyan-700 shadow-lg"
            : "bg-black/20 backdrop-blur-sm shadow-2xl"
          }`}
      >
        <div className="relative z-10">
          {isConnecting ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isConnected ? (
            <SiriPulseCircle level={level} isSpeaking={isAgentSpeaking} />
          ) : (
            <SiriPulseCircle isStatic={true} />
          )}
        </div>
      </button>

      {currentCommand && (
        <div className="absolute bottom-24 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 min-w-[300px] max-w-[400px] border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center">
                <AIIconMotion level={level} isSpeaking={isAgentSpeaking} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1 font-medium">AI Assistant</p>
              <p className="text-sm text-gray-900">{currentCommand}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
