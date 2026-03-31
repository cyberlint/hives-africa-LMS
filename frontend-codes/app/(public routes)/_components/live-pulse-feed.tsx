"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PulseItem = {
  id: string;
  type: "REPUTATION" | "EVENT" | "PORTFOLIO";
  user: { name: string; image?: string | null };
  title: string;
  subtitle: string;
  timestamp: string;
};

export function LivePulseFeed({ initialData }: { initialData: PulseItem[] }) {
  const [items, setItems] = useState<PulseItem[]>(initialData);

  // Cycle the feed every 4 seconds to make it feel "live"
  useEffect(() => {
    if (items.length <= 4) return; // Only cycle if we have enough items
    
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = [...prev];
        const first = newItems.shift();
        if (first) newItems.push(first);
        return newItems;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  const getIconConfig = (type: string) => {
    switch (type) {
      case "REPUTATION":
        return { icon: Zap, color: "text-orange", bg: "bg-orange/10 border-orange/20" };
      case "EVENT":
        return { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
      case "PORTFOLIO":
        return { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20" };
      default:
        return { icon: Zap, color: "text-muted-foreground", bg: "bg-muted border-border" };
    }
  };

  return (
    <div className="relative h-[450px] sm:h-[550px] w-full max-w-md mx-auto lg:ml-auto rounded-[2.5rem] border border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl shadow-orange/5 overflow-hidden flex flex-col">
      
      {/* HEADER: The "Live" Indicator */}
      <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </div>
          <h3 className="font-bold tracking-tight text-foreground">Live Network Pulse</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global</span>
      </div>

      {/* THE FEED (With Top/Bottom CSS Fade Mask) */}
      <div 
        className="flex-1 relative p-6 overflow-hidden"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}
      >
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.slice(0, 5).map((item, index) => {
              const { icon: Icon, color, bg } = getIconConfig(item.type);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.95 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-orange/30 transition-colors group"
                >
                  <Avatar className="size-10 border border-border/50 shrink-0">
                    <AvatarImage src={item.user.image || undefined} />
                    <AvatarFallback className="text-xs bg-muted">{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-orange transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`flex items-center justify-center size-5 rounded-md border ${bg}`}>
                        <Icon className={`size-3 ${color}`} />
                      </span>
                      <span className="truncate">{item.subtitle}</span>
                      <span className="ml-auto text-[10px] font-medium opacity-50 shrink-0">{item.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-border/50 bg-background/50 relative z-10">
        <button className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-orange transition-colors py-2">
          Join the Ecosystem <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}