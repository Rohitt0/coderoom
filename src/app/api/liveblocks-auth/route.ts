import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });

    const userId = `user-${Math.floor(Math.random() * 1000000)}`;

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: "Anonymous",
        color: "#00bfff",
      },
    });

    session.allow("*", session.FULL_ACCESS);

    const { status, body } = await session.authorize();

    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);

    return new NextResponse("Authentication failed", {
      status: 500,
    });
  }
}