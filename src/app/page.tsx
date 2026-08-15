"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Plus,
  Radio,
  Terminal,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const bgImageUrl = "https://i.ibb.co/7JjhszHN/Nova-04-1.png";

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  const handleCreateRoom = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    router.push(`/room/${newId}`);
  };

  return (
    <main
      className="min-h-screen text-[#ededed] flex flex-col items-center justify-between py-16 selection:bg-blue-500/30 font-sans bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('${bgImageUrl}')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="flex items-center gap-2.5 opacity-70">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-600/90 shadow-lg shadow-blue-950/30">
          <Terminal size={16} className="text-white" />
        </div>

        <span className="font-mono text-sm font-bold uppercase tracking-[-0.04em]">
          CodeRoom
        </span>
      </header>

      {/* Hero */}
      <section className="w-full max-w-[400px] px-6 text-center">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
              Real-time coding
            </span>
          </div>

          <h1 className="text-5xl font-semibold tracking-[-0.055em] text-white">
            Build{" "}
            <span className="text-blue-400 drop-shadow-[0_0_24px_rgba(59,130,246,0.25)]">
              together.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-gray-400">
            A real-time collaborative coding environment for building better
            software together.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-5">
          {/* Join room */}
          <form onSubmit={handleJoinRoom} className="w-full">
            <div
              className="
                group flex h-[58px] w-full items-center
                rounded-2xl border border-white/[0.09]
                bg-black/35 p-1.5
                shadow-[0_12px_40px_rgba(0,0,0,0.25)]
                backdrop-blur-xl
                transition-all duration-200
                focus-within:border-blue-500/50
                focus-within:bg-black/45
                focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08),0_12px_40px_rgba(0,0,0,0.3)]
              "
            >
              <span className="pl-3 pr-2 font-mono text-xs text-blue-400/70">
                &gt;_
              </span>

              <Input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                autoComplete="off"
                className="
                  h-full min-w-0 flex-1
                  border-0 bg-transparent
                  px-1 py-2
                  text-sm text-white
                  shadow-none
                  outline-none
                  placeholder:text-gray-600
                  focus-visible:ring-0
                  focus-visible:ring-offset-0
                "
              />

              <Button
                type="submit"
                size="icon"
                aria-label="Join room"
                disabled={!roomCode.trim()}
                className="
                  h-11 w-11 shrink-0
                  rounded-xl
                  bg-blue-600 text-white
                  shadow-[0_4px_18px_rgba(37,99,235,0.25)]
                  hover:bg-blue-500
                  hover:shadow-[0_6px_24px_rgba(37,99,235,0.4)]
                  active:scale-95
                  disabled:bg-white/[0.06]
                  disabled:text-gray-600
                  disabled:shadow-none
                "
              >
                <ArrowRight size={18} strokeWidth={2.2} />
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <span className="font-mono text-[9px] font-semibold tracking-[0.25em] text-gray-600">
              OR
            </span>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Create room */}
          <Button
            type="button"
            onClick={handleCreateRoom}
            className="
              group flex h-[58px] w-full
              items-center justify-center gap-2
              rounded-2xl
              border border-blue-400/20
              bg-blue-600
              text-sm font-semibold text-white
              shadow-[0_10px_35px_rgba(37,99,235,0.18)]
              hover:border-blue-300/30
              hover:bg-blue-500
              hover:shadow-[0_12px_42px_rgba(37,99,235,0.32)]
              active:scale-[0.985]
            "
          >
            <Plus
              size={18}
              strokeWidth={2.2}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            <span>Create New Space</span>

            <ArrowRight
              size={15}
              className="ml-1 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </Button>

          {/* Features */}
          <div className="mt-2 grid grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.06] bg-black/20 py-4 backdrop-blur-md">
            <Feature icon={<Radio size={14} />} title="Real-time" />
            <Feature icon={<Users size={14} />} title="Collaborative" />
            <Feature icon={<LockKeyhole size={14} />} title="Secure" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-700">
        <span>v1.0.4-stable</span>
        <span className="text-gray-800">•</span>
        <span>Next.js 16.2.4</span>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-gray-500">
      <div className="text-blue-400/70">{icon}</div>

      <span className="text-[9px] font-medium uppercase tracking-[0.08em]">
        {title}
      </span>
    </div>
  );
}