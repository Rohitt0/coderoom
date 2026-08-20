"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Plus,
  Radio,
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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-[#ededed] selection:bg-blue-500/30"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.76)), url('${bgImageUrl}')`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex min-h-screen flex-col items-center justify-between px-6 py-8">
        {/* Logo */}
        <header className="pt-1">
          <span className="font-mono text-sm font-medium tracking-[-0.04em] text-white/75">
            <span className="text-blue-400">&gt;_</span>
            CODEROOM
          </span>
        </header>

        {/* Hero */}
        <section className="w-full max-w-[390px] text-center">
          <div className="mb-7">
            <h1 className="text-[40px] font-semibold leading-none tracking-[-0.055em] text-white">
              Build{" "}
              <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.25)]">
                together.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[300px] text-[13px] leading-5 text-white/55">
              Real-time collaborative coding environment
              <br />
              for building better software together.
            </p>
          </div>

          {/* Join */}
          <form onSubmit={handleJoinRoom}>
            <div
              className="
    mx-auto flex h-[50px] w-full max-w-[350px] items-center gap-3
    rounded-xl
    border border-white/15
    bg-black/30
    px-1.5
    backdrop-blur-xl
    transition-all
    focus-within:border-blue-500/50
    focus-within:bg-black/40
  "
            >
              <span className="pl-3 font-mono text-sm text-white/60">
                {" </>"}
              </span>

              <Input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                autoComplete="off"
                className="
                  h-full
                  border-0
                  bg-transparent
                  px-1
                  text-[13px]
                  text-white
                  shadow-none
                  placeholder:text-white/35
                  focus-visible:ring-0
                "
              />

              <Button
                type="submit"
                size="icon"
                disabled={!roomCode.trim()}
                aria-label="Join room"
                className="
                  h-10
                  w-10
                  shrink-0
                  rounded-lg
                  bg-blue-600
                  text-white
                  shadow-[0_4px_18px_rgba(37,99,235,0.25)]
                  hover:bg-blue-500
                  disabled:bg-white/10
                  disabled:text-white/25
                "
              >
                <ArrowRight size={17} strokeWidth={2} />
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="mx-auto my-5 flex max-w-[350px] items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="font-mono text-[9px] tracking-[0.2em] text-white/35">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Create */}
          <Button
            type="button"
            onClick={handleCreateRoom}
            className="
              mx-auto flex h-[50px] w-full max-w-[350px]
              items-center justify-center gap-2
              rounded-xl
              border border-blue-400/20
              bg-blue-600
              text-[13px] font-medium
              text-white
              shadow-[0_8px_28px_rgba(37,99,235,0.18)]
              hover:bg-blue-500
              hover:shadow-[0_10px_32px_rgba(37,99,235,0.28)]
              active:scale-[0.99]
            "
          >
            <Plus size={17} strokeWidth={2} />
            <span>Create New Space</span>
            <ArrowRight size={14} className="ml-1 opacity-50" />
          </Button>

          {/* Features */}
          <div className="mx-auto mt-8 flex max-w-[350px] items-center justify-center">
            <Feature
              icon={<Radio size={17} />}
              title="Real-time"
              subtitle="Instant sync"
            />

            <div className="h-8 w-px bg-white/10" />

            <Feature
              icon={<Users size={17} />}
              title="Collaborative"
              subtitle="Work together"
            />

            <div className="h-8 w-px bg-white/10" />

            <Feature
              icon={<LockKeyhole size={17} />}
              title="Secure"
              subtitle="Private by default"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-1 font-mono text-[9px] tracking-[0.12em] text-white/30">
          v1.0.4-STABLE // NEXT.JS 16.2.4
        </footer>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-[105px] flex-col items-center gap-1 px-2">
      <div className="text-blue-400">{icon}</div>

      <span className="text-[11px] font-medium text-white/75">
        {title}
      </span>

      <span className="text-[9px] text-white/35">
        {subtitle}
      </span>
    </div>
  );
}