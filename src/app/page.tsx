'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      router.push(`/room/${roomId}?name=${encodeURIComponent(username)}`);
    }
  };

  const createNewRoom = () => {
    if (!username.trim()) {
      alert("Please enter a username first");
      return;
    }
    const randomId = Math.random().toString(36).substring(2, 9);
    router.push(`/room/${randomId}?name=${encodeURIComponent(username)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-md w-full space-y-6 bg-[#1e1e1e] p-10 rounded-2xl border border-[#333] shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-blue-500">CodeRoom</h1>
        </div>

        {/* Username Input - Always required */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Rohit"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <button 
          onClick={createNewRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
        >
          Create New Room
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#333]"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase">OR</span>
          <div className="flex-grow border-t border-[#333]"></div>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono"
          />
          <button 
            type="submit"
            className="w-full bg-[#252526] hover:bg-[#2d2d2e] border border-[#444] text-gray-300 font-bold py-4 rounded-xl transition-all"
          >
            Join with Code
          </button>
        </form>
      </div>
    </div>
  );
}