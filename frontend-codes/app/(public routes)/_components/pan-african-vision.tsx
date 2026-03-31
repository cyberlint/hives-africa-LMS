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
      transition={{ duration: 0.8 }}
      className="py-16 md:py-24 relative overflow-hidden bg-background border-t border-border/50"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/5 via-background to-background pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT: The Manifesto */}
          <div className="w-full lg:w-1/2 space-y-10 relative z-10">
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20 px-4 py-1.5 font-bold tracking-widest uppercase text-[10px] shadow-sm">
                <Globe2 className="size-3.5 mr-1.5 inline-block" /> Built For Us
              </Badge>
              
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-foreground tracking-tight leading-[1.1] text-balance">
                Master deep tech in the language{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-600">
                  you think in.
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg text-balance">
                The cognitive load of learning complex tech is heavy enough. You shouldn't have to translate your thoughts twice. NextHive is the first ecosystem built to let you solve local problems with native context.
              </p>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="space-y-4 pt-2"
            >
              {[
                {
                  icon: <MessageCircle className="size-5 text-orange" />,
                  title: "Mother-Tongue Hives",
                  desc: "Join peer-led study groups taught entirely in Swahili, Yoruba, Pidgin, and more."
                },
                {
                  icon: <Code2 className="size-5 text-blue-500" />,
                  title: "Culturally Relevant Capstones",
                  desc: "Stop building generic weather apps. Build solutions for African agriculture, fintech, and logistics."
                },
                {
                  icon: <Network className="size-5 text-purple-500" />,
                  title: "Local Tech Drivers",
                  desc: "Earn reputation points by translating complex technical concepts into your local language for peers."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group flex items-start gap-5 p-5 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-300">
                  <div className="p-3 rounded-2xl bg-muted border border-border/50 shrink-0 group-hover:scale-110 group-hover:bg-background transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-foreground text-base tracking-tight">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </MotionDiv>
          </div>

          {/* RIGHT: Floating Language Nodes */}
          <div className="w-full lg:w-1/2 relative min-h-[450px] lg:min-h-[650px] flex items-center justify-center">
            
            {/* Center Anchor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 md:size-56 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <MotionDiv 
              initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-card border-[4px] border-background shadow-2xl ring-1 ring-border"
            >
              <div className="absolute inset-0 rounded-full ring-4 ring-green-500/20 animate-pulse" />
              <Sparkles className="size-10 text-green-500 mb-2" />
              <span className="font-black text-xl text-foreground tracking-tight">NextHive</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ecosystem</span>
            </MotionDiv>

            {/* Orbiting Language Pills */}
            <div className="absolute inset-0 z-20">
              {languages.map((lang, index) => {
                // Pinpoint center positioning so the SVG lines connect perfectly to the middle of the nodes
                const positions = [
                  "top-[10%] left-[20%]",
                  "top-[15%] left-[85%]",
                  "top-[45%] left-[5%]",
                  "top-[50%] left-[95%]",
                  "top-[80%] left-[25%]",
                  "top-[85%] left-[75%]",
                  "top-[90%] left-[50%]",
                ];

                return (
                  <MotionDiv
                    key={lang.name}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: lang.delay, type: "spring", bounce: 0.4, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className={`absolute ${positions[index]} -translate-x-1/2 -translate-y-1/2 group cursor-pointer`}
                  >
                    <div className="flex flex-col items-center gap-1 p-3 md:p-4 rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-green-500/20 hover:border-green-500/40 transition-all duration-300">
                      <span className="text-xs md:text-sm font-black text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors whitespace-nowrap">
                        "{lang.greeting}"
                      </span>
                      <Badge variant="secondary" className="bg-muted/80 text-muted-foreground text-[9px] uppercase font-bold border-none px-2 py-0.5">
                        {lang.name}
                      </Badge>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>

            {/* Connecting lines SVG background */}
            {/* Added vectorEffect="non-scaling-stroke" so lines never distort when screen size changes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M50 50 L20 10 M50 50 L85 15 M50 50 L5 45 M50 50 L95 50 M50 50 L25 80 M50 50 L75 85 M50 50 L50 90" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-foreground"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

          </div>
        </div>
      </div>
    </MotionSection>
  );
}