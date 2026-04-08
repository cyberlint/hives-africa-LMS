"use client";

import { MotionDiv } from "@/components/framer-motion/motion-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Coins,
  Target,
  Zap,
  MessageSquare,
  Share2,
  Flame,
  CheckCircle2,
  Network,
} from "lucide-react";
import Link from "next/link";

export default function TheSignalGraph() {
  return (
    <section className="w-full relative py-20 md:py-28 border-t border-border/50 bg-background overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />

      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT ================= */}
          <div className="space-y-8">

            {/* Header */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Activity className="size-5 text-blue-500" />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  The Signal Graph
                </h2>
              </div>

              <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
                A network where visibility is earned through execution—not noise.
                Contributions, proof, and outcomes determine what rises.
              </p>
            </MotionDiv>

            {/* Features */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 transition">
                <div className="size-9 flex items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                  <ShieldCheck className="size-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Proof over presence</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified work—not activity—drives visibility.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 transition">
                <div className="size-9 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Coins className="size-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Help as a system</h3>
                  <p className="text-sm text-muted-foreground">
                    Attach value to problems and reward real solutions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 transition">
                <div className="size-9 flex items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Target className="size-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Signals that matter</h3>
                  <p className="text-sm text-muted-foreground">
                    Replace passive likes with meaningful validation.
                  </p>
                </div>
              </div>
            </MotionDiv>

            {/* CTA */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                asChild
                className="h-12 px-6 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Enter the Network
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </MotionDiv>
          </div>

          {/* ================= RIGHT (LIVE FEED) ================= */}
          <div className="relative w-full max-w-lg mx-auto lg:ml-auto">

            <div className="space-y-6">

              {/* ===== SHOWCASE POST ===== */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-5 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="size-10">
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">Amani Mosi</p>
                    <p className="text-xs text-muted-foreground">
                      Apr 5 • Showcase
                    </p>
                  </div>

                  <Badge className="text-[10px] bg-yellow-500/10 text-yellow-600 border-none">
                    Showcase
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed mb-4">
                  Built an automated credit scoring engine using transaction-level data.
                  Reduced latency to sub-100ms across 10k+ requests.
                </p>

                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 mb-4">
                  <div className="size-8 flex items-center justify-center rounded-lg bg-amber-500/20">
                    <CheckCircle2 className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Verified Proof</p>
                    <p className="text-xs text-muted-foreground">
                      Algorithmically validated output
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-purple-500 font-medium">
                      <Zap className="size-4" /> 12 Sparks
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="size-4" /> 3
                    </span>
                  </div>

                  <span className="text-muted-foreground flex items-center gap-1">
                    <Share2 className="size-4" /> Share
                  </span>
                </div>
              </MotionDiv>

              {/* ===== BOUNTY POST ===== */}
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group p-5 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="size-10">
                    <AvatarFallback>UD</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">Uchechukwu Dayo</p>
                    <p className="text-xs text-muted-foreground">
                      Now • Bounty
                    </p>
                  </div>

                  <Badge className="text-[10px] bg-amber-500 text-white border-none">
                    Bounty
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed mb-4">
                  Getting a tensor shape mismatch in a 3D CNN pipeline.
                  Looking for help with PyTorch + spatial downsampling.
                </p>

                <div className="flex items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-4">
                  <div>
                    <p className="text-xs font-semibold">Reward Escrow</p>
                    <p className="text-xs text-muted-foreground">
                      Locked for best solution
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Flame className="size-4" /> 150
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    4 responses incoming
                  </span>

                  <span className="flex items-center gap-1 text-blue-500">
                    <Network className="size-4" /> Active
                  </span>
                </div>
              </MotionDiv>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}