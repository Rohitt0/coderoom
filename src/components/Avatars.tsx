'use client';

import { useOthers } from "@liveblocks/react/suspense";
import styles from "./Avatars.module.css";

interface AvatarsProps {
  username: string;
}

export function Avatars({ username }: AvatarsProps) {
  const others = useOthers();

  // Use the prop passed from the lobby as the primary name
  const myDisplayName = username || "Anonymous";

  return (
    <div className={styles.avatars}>
      {/* Current User Avatar */}
      <div className="relative first:ml-0">
        <Avatar 
          picture={`https://api.dicebear.com/7.x/avataaars/svg?seed=${myDisplayName}`} 
          name={`${myDisplayName} (Me)`} 
        />
      </div>

      {/* Others' Avatars */}
      {others.slice(0, 3).map(({ connectionId, info }) => {
        const otherName = (info as any)?.name || "Collaborator";
        
        return (
          <Avatar 
            key={connectionId} 
            picture={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`} 
            name={otherName} 
          />
        );
      })}

      {/* Overflow indicator[cite: 1] */}
      {others.length > 3 && (
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#9ca3af] text-[10px] font-bold text-white border-4 border-white -ml-3 z-10">
          +{others.length - 3}
        </div>
      )}
    </div>
  );
}

// Internal Avatar component to maintain reference styling[cite: 1]
function Avatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div className={styles.avatar} data-tooltip={name}>
      <img
        src={picture}
        className={styles.avatar_picture}
        alt={name}
      />
    </div>
  );
}