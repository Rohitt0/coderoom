'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Terminal } from "lucide-react";

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  // 1. PLACE YOUR IMAGE LINK HERE
  const bgImageUrl = "https://i.ibb.co/7JjhszHN/Nova-04-1.png";

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  const handleCreateRoom = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    router.push(`/room/${newId}`);
  };

  return (
    <div 
      className="min-h-screen text-[#ededed] flex flex-col items-center justify-between py-16 selection:bg-blue-500/30 font-sans bg-cover bg-center bg-no-repeat"
      style={{ 
        // 2. This applies the image and a dark tint so your content stays sharp
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('${bgImageUrl}')`,
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* --- Header --- */}
      <div className="flex items-center gap-2 opacity-50">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Terminal size={18} className="text-white" />
        </div>
        <span className="text-sm font-bold tracking-tighter uppercase font-mono">CodeRoom</span>
      </div>

      {/* --- Main Content --- */}
      <div className="w-full max-w-[400px] px-6 text-center flex flex-col gap-10">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Build together.
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time collaborative coding environment.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <form 
            onSubmit={handleJoinRoom} 
            className="flex items-center gap-2 w-full bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-xl p-2 focus-within:border-blue-500/50 transition-all shadow-sm"
          >
            <input 
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              autoComplete="off"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-white placeholder:text-gray-600"
            />
            <button 
              type="submit"
              className="h-10 w-10 shrink-0 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="flex items-center gap-4 py-1">
            <div className="h-[1px] flex-1 bg-[#262626]"></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">OR</span>
            <div className="h-[1px] flex-1 bg-[#262626]"></div>
          </div>

          <button 
            onClick={handleCreateRoom}
            className="w-full bg-white text-black py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            <Plus size={18} /> Create New Space
          </button>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
        v1.0.4-stable // next.js 16.2.4
      </footer>
    </div>
  );
}