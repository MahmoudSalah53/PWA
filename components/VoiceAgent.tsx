"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { NavigationMCP } from "@/lib/mcp/navigation-mcp";
import { useRouter } from "next/navigation";

export default function VoiceAgent() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);

  const mcpRef = useRef<NavigationMCP | null>(null);
  const roomRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize MCP
  useEffect(() => {
    mcpRef.current = new NavigationMCP(router);
  }, [router]);

  // Get LiveKit token
  useEffect(() => {
    async function getToken() {
      try {
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
        
        const data = await res.json();
        setToken(data.token);
        setRoomName(data.room);
      } catch (err) {
        console.error("Failed to get voice token:", err);
      }
    }

    getToken();
  }, []);

  // Connect to LiveKit
  const connectToLiveKit = async () => {
    if (!token || !roomName || isConnected) return;

    setIsConnecting(true);

    try {
      const { Room, RoomEvent } = await import('livekit-client');
      
      const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://subject-tutor-ppfych9q.livekit.cloud";
      
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        console.log("Connected to LiveKit room:", roomName);
        setIsConnected(true);
        setIsConnecting(false);
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from LiveKit");
        setIsConnected(false);
      });

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log("Participant joined:", participant.identity);
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === 'audio') {
          const audioEl = track.attach();
          audioRef.current = audioEl;
          document.body.appendChild(audioEl);
          audioEl.play();
        }
      });

      room.on(RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        
        try {
          const data = JSON.parse(message);
          
          // Handle navigation commands from agent
          if (data.type === 'navigation' && data.command && mcpRef.current) {
            setCurrentCommand(data.command);
            const result = mcpRef.current.processVoiceCommand(data.command);
            console.log('Navigation result:', result);
            
            // Clear command after execution
            setTimeout(() => setCurrentCommand(""), 2000);
          }
          
          // Handle transcript display
          if (data.type === 'transcript' && data.text) {
            setCurrentCommand(data.text);
          }
        } catch (e) {
          console.error('Failed to parse data:', e);
        }
      });

      await room.connect(LIVEKIT_URL, token, {
        autoSubscribe: true,
      });

      await room.localParticipant.setMicrophoneEnabled(true);
      
    } catch (err) {
      console.error("Failed to connect to LiveKit:", err);
      setIsConnecting(false);
    }
  };

  // Disconnect from LiveKit
  const disconnectFromLiveKit = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.remove();
      audioRef.current = null;
    }
    setIsConnected(false);
    setCurrentCommand("");
  };

  // Toggle connection
  const toggleConnection = () => {
    if (isConnected) {
      disconnectFromLiveKit();
    } else {
      connectToLiveKit();
    }
  };

  return (
    <>
      {/* Main Voice Button with Animation */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleConnection}
          disabled={isConnecting || !token}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            isConnected
              ? "bg-red-500 hover:bg-red-600 shadow-2xl"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {/* Pulsing Rings Animation */}
          {isConnected && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
              <span className="absolute inset-0 rounded-full bg-red-300 animate-pulse opacity-50"></span>
              <span className="absolute -inset-2 rounded-full bg-red-200 animate-ping opacity-25 animation-delay-200"></span>
              <span className="absolute -inset-4 rounded-full bg-red-100 animate-ping opacity-10 animation-delay-400"></span>
            </>
          )}

          {/* Icon */}
          <div className="relative z-10">
            {isConnecting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isConnected ? (
              <MicOff className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Status Indicator */}
          {isConnected && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center animate-bounce">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>

        {/* Command Display */}
        {currentCommand && (
          <div className="absolute bottom-24 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[300px] max-w-[400px] animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Agent command:</p>
                <p className="text-sm text-gray-900 font-medium">{currentCommand}</p>
              </div>
            </div>
            
            {/* Audio Wave Animation */}
            <div className="flex items-center justify-center gap-1 mt-3 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-wave"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: '100%'
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Status Text */}
        {!currentCommand && isConnected && (
          <div className="absolute bottom-24 right-0 bg-green-50 border border-green-200 rounded-lg shadow-lg p-3 animate-fade-in">
            <p className="text-sm text-green-700 font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Agent listening...
            </p>
          </div>
        )}

        {/* Connecting Status */}
        {isConnecting && (
          <div className="absolute bottom-24 right-0 bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-3 animate-fade-in">
            <p className="text-sm text-blue-700 font-medium">Connecting...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </>
  );
}