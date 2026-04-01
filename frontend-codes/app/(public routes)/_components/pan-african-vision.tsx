"use client";

import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";
import { Badge } from "@/components/ui/badge";
import { Globe2, MessageCircle, Code2, Sparkles, Network } from "lucide-react";

export default function PanAfricanVision() {
  const languages = [
    { name: "Swahili", greeting: "Habari", delay: 0.1 },
    { name: "Yoruba", greeting: "Bawo ni", delay: 0.3 },
    { name: "Hausa", greeting: "Sannu", delay: 0.2 },
    { name: "Igbo", greeting: "Nnọọ", delay: 0.4 },
    { name: "Amharic", greeting: "Selam", delay: 0.5 },
    { name: "Zulu", greeting: "Sawubona", delay: 0.25 },
    { name: "Pidgin", greeting: "How far", delay: 0.15 },
  ];

  return (
    <MotionSection
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-20 md:py-28 relative overflow-hidden bg-background border-t border-border/40"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] via-transparent to-orange/[0.04] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1.5 text-[10px] tracking-widest font-bold uppercase">
                <Globe2 className="size-3.5 mr-1.5" />
                Built for Africans
              </Badge>

              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                Master deep tech in the language{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  you think in
                </span>
              </h2>

              <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
                {"Learning complex tech is already hard. You shouldn't have to translate your thinking too. NextHive helps you build real solutions using your natural context and language."}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  icon: <MessageCircle className="size-5 text-orange" />,
                  title: "Mother-Tongue Hives",
                  desc: "Study groups in Yoruba, Swahili, Pidgin and more.",
                },
                {
                  icon: <Code2 className="size-5 text-blue-500" />,
                  title: "Real African Projects",
                  desc: "Solve problems in fintech, agriculture, logistics.",
                },
                {
                  icon: <Network className="size-5 text-purple-500" />,
                  title: "Earn by Teaching",
                  desc: "Translate knowledge and earn reputation points.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-green-500/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-muted border border-border/40">
                    {feature.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center justify-center min-h-[500px]">

            {/* Center */}
            <div
              id="center-node"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center px-6 py-5 rounded-full bg-card border border-border shadow-xl"
            >
              <Sparkles className="size-8 text-green-500 mb-1" />
              <span className="font-bold text-lg text-foreground">NextHive</span>
              <span className="text-[10px] uppercase text-muted-foreground tracking-widest">
                Ecosystem
              </span>
            </div>

            {/* Nodes */}
            {languages.map((lang, index) => {
              const positions = [
                { x: "25%", y: "10%" },
                { x: "85%", y: "15%" },
                { x: "5%", y: "45%" },
                { x: "95%", y: "50%" },
                { x: "25%", y: "85%" },
                { x: "75%", y: "90%" },
                { x: "50%", y: "95%" },
              ];

              return (
                <div
                  key={lang.name}
                  id={`node-${index}`}
                  style={{
                    position: "absolute",
                    left: positions[index].x,
                    top: positions[index].y,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="z-20"
                >
                  <div className="px-3 py-2 rounded-xl bg-card border border-border shadow-sm">
                    <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                      &quot;{lang.greeting}&quot;
                    </p>
                    <span className="text-[9px] text-muted-foreground uppercase">
                      {lang.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {languages.map((_, index) => (
                <line
                  key={index}
                  x1="50%"
                  y1="50%"
                  x2={
                    ["25%", "85%", "5%", "95%", "25%", "75%", "50%"][index]
                  }
                  y2={
                    ["10%", "15%", "45%", "50%", "85%", "90%", "95%"][index]
                  }
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-foreground/20"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}