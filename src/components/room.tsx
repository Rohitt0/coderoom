'use client';

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
  const publicApi = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!;

  return (
    <LiveblocksProvider publicApiKey={publicApi}>
      {/* ADD initialStorage HERE */}
      <RoomProvider 
        id={roomId} 
        initialPresence={{}} 
        initialStorage={{ 
          language: "javascript" 
        }}
      >
        <ClientSideSuspense fallback={<div className="text-white p-10">Loading CodeRoom...</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}