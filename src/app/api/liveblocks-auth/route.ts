import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  // Use a fallback for development if your auth logic isn't ready
  const user = {
    id: "user-" + Math.floor(Math.random() * 1000),
    info: {
      name: "Rohit",
      color: "#D52B1E",
      avatar: "https://liveblocks.io/avatars/avatar-1.png",
    },
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo: user.info,
  });

  session.allow(`*`, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}