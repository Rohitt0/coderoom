'use client';

import React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation"; // Add this
import { Room } from "@/components/room";

const CollaborativeEditor = dynamic(
  () => import("@/components/CollaborativeEditor").then((mod) => mod.CollaborativeEditor),
  { ssr: false }
);

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = React.use(params);
  const searchParams = useSearchParams();
  const username = searchParams.get("name") || "Anonymous"; // Get name from URL

  return (
    <main className="h-screen w-full overflow-hidden">
      <Room roomId={roomId}>
        {/* Pass the username as a prop */}
        <CollaborativeEditor username={username} />
      </Room>
    </main>
  );
}