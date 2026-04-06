"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Calendar, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PulseItem } from "./types";

export function SidebarPulse({ initialData }: { initialData: PulseItem[] }) {
  const [items, setItems] = useState<PulseItem[]>(initialData);

  useEffect(() => {
    if (items.length <= 4) return;

    // Updated to 5 minutes (300,000ms)
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = [...prev];
        const first = newItems.shift();
        if (first) newItems.push(first);
        return newItems;
      });
    }, 300000); 

    return () => clearInterval(interval);
  }, [items.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case "REPUTATION": return { icon: Zap, color: "text-orange/70", bg: "bg-orange/5" };
      case "PORTFOLIO": return { icon: ShieldCheck, color: "text-green-500/70", bg: "bg-green-500/5" };
      default: return { icon: Calendar, color: "text-blue-500/70", bg: "bg-blue-500/5" };
    }
  };

  return (
    <div className="space-y-2 relative min-h-[280px]">
      <AnimatePresence mode="popLayout">
        {items.slice(0, 4).map((item) => {
          const config = getIcon(item.type);
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }} // Slow, gentle fade
              className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/30"
            >
              <Avatar className="size-8 grayscale-[0.5] opacity-80">
                <AvatarImage src={item.user.image || undefined} />
                <AvatarFallback className="text-[10px]">{item.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground/80 truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className={`p-0.5 rounded ${config.bg}`}>
                     <config.icon className={`size-2.5 ${config.color}`} />
                   </div>
                   <p className="text-[10px] text-muted-foreground/70 truncate">{item.subtitle}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}