"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";

export function Room({ children, roomId }: { children: ReactNode; roomId: string }) {
  return (
    // Replace the string below with your actual pk_... key
    <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
      <RoomProvider 
        id={roomId} 
        initialStorage={{
          files: new LiveList([]), 
        }}
      >
        <ClientSideSuspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-[#1e1e1e] text-gray-500 font-mono text-sm">
            Connecting to CodeRoom...
          </div>
        }>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}