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

    const code = roomCode.trim();

    if (code) {
      router.push(`/room/${code}`);
    }
  };

  const handleCreateRoom = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    router.push(`/room/${newId}`);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat text-[#ededed] selection:bg-blue-500/30"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.76)), url('${bgImageUrl}')`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex min-h-screen w-full flex-col items-center justify-between px-6 py-8">
        {/* Logo */}
        <header className="pt-1">
          <span className="font-mono text-[13px] font-medium tracking-[-0.045em] text-white/80">
            <span className="text-blue-400">&gt;_</span>
            CODEROOM
          </span>
        </header>

        {/* Hero */}
        <section className="flex w-full max-w-[430px] flex-col items-center text-center">
          <div className="mb-8">
            <h1 className="text-[42px] font-semibold leading-none tracking-[-0.055em] text-white">
              Build{" "}
              <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.25)]">
                together.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[320px] text-[14px] leading-5 text-white/60">
              Real-time collaborative coding environment
              <br />
              for building better software together.
            </p>
          </div>

          {/* Join room */}
          <form onSubmit={handleJoinRoom} className="w-full">
            <div
              className="
                mx-auto flex h-[52px] w-full max-w-[380px] items-center
                rounded-xl
                border border-white/20
                bg-black/30
                px-1.5
                backdrop-blur-xl
                transition-all
                focus-within:border-blue-500/60
                focus-within:bg-black/40
              "
            >
              <div className="flex min-w-0 flex-1 items-center">
                <span className="shrink-0 pl-3 pr-5 font-mono text-sm text-white/65">
                  {"</>"}
                </span>

                <Input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Enter room code"
                  autoComplete="off"
                  className="
                    h-full
                    min-w-0
                    flex-1
                    border-0
                    bg-transparent
                    px-0
                    text-[14px]
                    text-white
                    shadow-none
                    placeholder:text-white/40
                    focus-visible:ring-0
                  "
                />
              </div>

              <Button
                type="submit"
                size="icon"
                aria-label="Join room"
                disabled={!roomCode.trim()}
                className="
                  h-10
                  w-10
                  shrink-0
                  rounded-lg
                  bg-blue-600
                  text-white
                  shadow-[0_4px_18px_rgba(37,99,235,0.25)]
                  hover:bg-blue-500
                  hover:shadow-[0_6px_22px_rgba(37,99,235,0.35)]
                  disabled:bg-white/10
                  disabled:text-white/25
                "
              >
                <ArrowRight size={18} strokeWidth={2} />
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="mx-auto my-5 flex w-full max-w-[380px] items-center gap-5">
            <div className="h-px flex-1 bg-white/15" />

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
              OR
            </span>

            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Create room */}
          <Button
            type="button"
            onClick={handleCreateRoom}
            className="
    mx-auto flex h-[52px] w-full max-w-[380px]
    items-center justify-center gap-2
    rounded-xl
    !border-blue-500
    !bg-black/40
    !text-white
    text-[14px] font-medium
    shadow-[0_0_20px_rgba(37,99,235,0.08)]
    hover:!border-blue-400
    hover:!bg-blue-600/20
    hover:!text-white
    active:scale-[0.99]
  "
          >
            <Plus
              size={18}
              strokeWidth={2}
              className="text-blue-400"
            />

            <span className="text-white">
              Create New Space
            </span>

            <ArrowRight
              size={15}
              className="ml-1 text-blue-400"
            />
          </Button>

          {/* Features */}
          <div className="mx-auto mt-7 flex w-full max-w-[380px] items-center justify-center">
            <Feature
              icon={<Radio size={18} />}
              title="Real-time"
              subtitle="Instant sync"
            />

            <div className="h-9 w-px bg-white/15" />

            <Feature
              icon={<Users size={18} />}
              title="Collaborative"
              subtitle="Work together"
            />

            <div className="h-9 w-px bg-white/15" />

            <Feature
              icon={<LockKeyhole size={18} />}
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
    <div className="flex min-w-[115px] flex-col items-center gap-1 px-3">
      <div className="text-blue-400">{icon}</div>

      <span className="text-[12px] font-medium text-white/80">
        {title}
      </span>

      <span className="text-[10px] text-white/40">
        {subtitle}
      </span>
    </div>
  );
}