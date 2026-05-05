'use client';

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Room } from "@/components/room";
import { useStorage, useMutation } from "@liveblocks/react/suspense";
import { X, FileText, Plus } from "lucide-react";

// CRITICAL FIX: We removed the `.then(mod => ...)` part. 
// Now it correctly grabs the default export from your CollaborativeEditor file.
const CollaborativeEditor = dynamic(
  () => import("@/components/CollaborativeEditor"),
  { ssr: false }
);

function EditorWorkspace({ roomId, username }: { roomId: string, username: string }) {
  const files = useStorage((root: any) => root.files);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  if (files === undefined) return null;

  const addFile = useMutation(({ storage }) => {
    const fileName = prompt("Enter file name:");
    if (!fileName) return;
    const newFile = { id: `file-${Date.now()}`, name: fileName };
    const storageFiles = storage.get("files") as any;
    storageFiles.push(newFile);
    setActiveFileId(newFile.id);
  }, []);

  const deleteFile = useMutation(({ storage }, fileId: string) => {
    const storageFiles = storage.get("files") as any;
    const index = storageFiles.findIndex((f: any) => f.id === fileId);
    if (index !== -1) {
      storageFiles.delete(index);
      if (activeFileId === fileId) setActiveFileId(null);
    }
  }, [activeFileId]);

  const handleRunClick = () => {
    window.dispatchEvent(new CustomEvent('trigger-run-code'));
  };

  return (
    <div className="relative flex h-screen w-full bg-[#0a0a0a] text-[#ededed] font-sans overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      {/* -------------------------------- */}

      {/* Sidebar */}
      <aside 
        className="relative flex flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-2xl select-none shrink-0 w-[220px] shadow-2xl z-20"
        onContextMenu={(e) => { e.preventDefault(); addFile(); }}
      >
        {/* Top App Bar / Home Redirect */}
        <div className="px-5 py-6 border-b border-white/5 flex flex-col gap-2">
          <Link 
            href="/" 
            className="hover:opacity-80 transition-opacity no-underline w-fit"
          >
            <span className="text-[#ededed] font-black tracking-wider text-3xl">Coderoom</span>
          </Link>
        </div>

        {/* Explorer Header */}
        <div 
          className="px-5 pt-8 pb-4 flex items-center justify-between cursor-pointer group" 
          onClick={addFile}
        >
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold group-hover:text-gray-300 transition-colors">
            Explorer
          </span>
          <Plus size={16} className="text-gray-600 group-hover:text-white transition-colors" />
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto mt-1 flex flex-col gap-1 px-3" onClick={(e) => { if (e.target === e.currentTarget) addFile(); }}>
          {files.map((file: any) => (
            <div 
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer text-sm transition-colors ${activeFileId === file.id ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 truncate px-1 pointer-events-none">
                <FileText size={16} className="opacity-50 shrink-0" />
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <X 
                size={14} 
                className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-0.5" 
                onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Action Area */}
        <div className="p-5 border-t border-white/5">
          <button 
            onClick={handleRunClick}
            className="w-full bg-[#ededed] text-black text-xs uppercase tracking-widest px-4 py-3 rounded-md hover:bg-white hover:scale-[1.02] transition-all font-bold shadow-lg"
          >
            Run Code
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full z-10">
        <CollaborativeEditor 
          key={activeFileId || 'empty'} 
          activeFileId={activeFileId} 
          username={username} 
        />
      </main>
    </div>
  );
}

// Safely pulling the roomId from the URL
export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const searchParams = useSearchParams();
  const username = searchParams.get("name") || "Anonymous";

  if (!roomId) return null;

  return (
    <Room roomId={roomId}>
      <EditorWorkspace roomId={roomId} username={username} />
    </Room>
  );
}