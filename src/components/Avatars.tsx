'use client';

import { useOthers, useSelf } from "@liveblocks/react/suspense";

interface AvatarsProps {
  username: string;
}

export function Avatars({ username }: AvatarsProps) {
  const others = useOthers();
  const self = useSelf();

  // We prioritize the username passed from the lobby/URL
  const myDisplayName = username || "Anonymous";

  return (
    <div className="flex items-center -space-x-2 overflow-hidden px-2">
      {/* Current User Avatar - Uses the prop instead of self.info */}
      <div 
        className="relative inline-block h-7 w-7 rounded-full ring-2 ring-black hover:z-10 transition-transform hover:scale-110 cursor-help" 
        title={`${myDisplayName} (Me)`}
      >
        <img 
          className="rounded-full bg-[#222]" 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${myDisplayName}`} 
          alt="Me" 
        />
      </div>

      {/* Others' Avatars - Includes strict null checks */}
      {others.slice(0, 3).map(({ connectionId, info }) => {
        // If info or name is missing, we use a generic name to prevent crashes
        const otherName = (info as any)?.name || "Collaborator";
        
        return (
          <div 
            key={connectionId} 
            className="relative inline-block h-7 w-7 rounded-full ring-2 ring-black hover:z-10 transition-transform hover:scale-110 cursor-help" 
            title={otherName}
          >
            <img 
              className="rounded-full bg-[#222]" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`} 
              alt="User" 
            />
          </div>
        );
      })}

      {/* Count for additional users */}
      {others.length > 3 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222] text-[9px] font-bold text-white ring-2 ring-black">
          +{others.length - 3}
        </div>
      )}
    </div>
  );
}