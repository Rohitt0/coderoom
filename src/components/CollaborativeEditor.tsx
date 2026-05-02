'use client';

import { useRoom, useStorage, useMutation, useOthers, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MonacoBinding } from "y-monaco";
import { Editor } from "@monaco-editor/react";
import {
  FolderIcon,
  FileCodeIcon,
  DownloadIcon,
  TerminalIcon,
  ChevronRightIcon,
  PlayIcon,
  FilePlusIcon,
  FolderPlusIcon,
  RotateCwIcon,
  Undo2Icon,
  Redo2Icon
} from "lucide-react";

// --- Step 1: Presence Avatars Component ---
function Avatars() {
  const others = useOthers();
  const self = useSelf();

  return (
    <div className="flex items-center -space-x-2 overflow-hidden px-2">
      {self && (
        <div className="relative inline-block h-7 w-7 rounded-full ring-2 ring-black hover:z-10 transition-transform hover:scale-110 cursor-help" title={self.info.name}>
          <img className="rounded-full" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${self.info.name}`} alt="Me" />
        </div>
      )}
      {others.slice(0, 3).map(({ connectionId, info }) => (
        <div key={connectionId} className="relative inline-block h-7 w-7 rounded-full ring-2 ring-black hover:z-10 transition-transform hover:scale-110 cursor-help" title={info.name}>
          <img className="rounded-full" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${info.name}`} alt="User" />
        </div>
      ))}
      {others.length > 3 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222] text-[9px] font-bold text-white ring-2 ring-black">
          +{others.length - 3}
        </div>
      )}
    </div>
  );
}

export function CollaborativeEditor({ username }: { username: string }) {
  const room = useRoom();
  const [editorRef, setEditorRef] = useState<any>(null);
  const [undoManager, setUndoManager] = useState<Y.UndoManager | null>(null);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState("Console initialized...");
  const [files, setFiles] = useState([
    { id: '1', name: "server.js", type: "file", iconColor: "text-yellow-500" },
    { id: '2', name: "src", type: "folder", iconColor: "text-gray-500" },
    { id: '3', name: "package.json", type: "file", iconColor: "text-blue-400" },
  ]);

  const language = useStorage((root) => root.language) as string || "javascript";
  const updateLanguage = useMutation(({ storage }, newLang: string) => { storage.set("language", newLang); }, []);

  // --- Step 3: Custom Pitch-Black Theme ---
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('code-room-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
      ],
      colors: {
        'editor.background': '#000000', // Pitch Black match for image_b4607d.png
        'editor.lineHighlightBackground': '#ffffff08',
        'editorCursor.foreground': '#3b82f6',
      }
    });
  };

  // --- Step 4: Yjs Setup with UndoManager ---
  useEffect(() => {
    if (!editorRef || !room) return;
    const ydoc = new Y.Doc();
    const type = ydoc.getText("monaco");
    const provider = new LiveblocksYjsProvider(room, ydoc);
    
    const manager = new Y.UndoManager(type);
    setUndoManager(manager);

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];
    provider.awareness.setLocalStateField("user", { 
      name: username || "Anonymous", 
      color: userColor,
      colorLight: userColor + "33" 
    });

    const binding = new MonacoBinding(type, editorRef.getModel(), new Set([editorRef]), provider.awareness);
    return () => { ydoc.destroy(); provider.destroy(); binding.destroy(); };
  }, [editorRef, room, username]);

  // Utility Actions
  const handleDownload = () => {
    if (!editorRef) return;
    const blob = new Blob([editorRef.getValue()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `code-${room.id}.txt`; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black text-[#cccccc] overflow-hidden">
      
      {/* --- Step 2: Refined Header --- */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#222] bg-black px-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black tracking-tighter text-blue-500">CR</span>
          <div className="h-4 w-[1px] bg-[#333]"></div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            src <span className="text-gray-700">/</span> server.js
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border-r border-[#222] pr-4">
            <button onClick={() => undoManager?.undo()} className="p-2 hover:bg-[#111] rounded transition-colors" title="Undo"><Undo2Icon size={16}/></button>
            <button onClick={() => undoManager?.redo()} className="p-2 hover:bg-[#111] rounded transition-colors" title="Redo"><Redo2Icon size={16}/></button>
          </div>
          
          <Avatars /> {/* Step 1: Presence UI */}
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 rounded bg-[#111] px-3 py-1.5 text-xs font-bold border border-[#333] hover:bg-[#222] transition-all"
          >
            <DownloadIcon size={14} /> Download
          </button>
          <button className="rounded bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-all">Share</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- Explorer Sidebar --- */}
        <aside className="w-64 flex flex-col border-r border-[#222] bg-black shrink-0 select-none">
          <div className="group flex items-center justify-between p-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <span>Explorer</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FilePlusIcon size={14} className="cursor-pointer hover:text-white" />
              <FolderPlusIcon size={14} className="cursor-pointer hover:text-white" />
              <RotateCwIcon size={14} className="cursor-pointer hover:text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pt-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#111] text-xs cursor-pointer"><ChevronRightIcon size={14} className="rotate-90" /><FolderIcon size={16} className="text-blue-500 fill-blue-500/10" /><span className="font-semibold text-white">coderoom</span></div>
            <div className="pl-4 mt-1">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-2 px-4 py-1.5 hover:bg-[#111] cursor-pointer text-xs transition-colors">
                  {f.type === "folder" ? <FolderIcon size={14} className={f.iconColor} /> : <FileCodeIcon size={14} className={f.iconColor} />}
                  <span className={f.type === "folder" ? "opacity-60" : ""}>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Main Workspace --- */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1">
            <Editor
              height="100%"
              theme="code-room-dark"
              language={language}
              onMount={(editor) => setEditorRef(editor)}
              beforeMount={handleEditorWillMount}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                padding: { top: 20 },
                automaticLayout: true,
                scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
              }}
            />
          </div>

          {/* --- Output Section --- */}
          <div className="h-44 flex flex-col border-t border-[#222] bg-black">
            <div className="flex items-center justify-between border-b border-[#222] px-4 py-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600"><TerminalIcon size={12} /> Console</div>
              <button 
                onClick={() => setOutput(`Executing ${language} script...\n> Success: Compilation finished.`)}
                className="flex items-center gap-1 rounded bg-blue-600/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:bg-blue-600/20"
              >
                <PlayIcon size={10} fill="currentColor" /> Run Script
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-500 whitespace-pre-wrap">{output}</div>
          </div>
        </main>
      </div>
    </div>
  );
}