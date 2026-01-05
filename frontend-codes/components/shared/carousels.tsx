"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Users, Bot, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AgentCard = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  quote: string;
  speaker: string;
  avatarInitials: string;
};

const agentCards: AgentCard[] = [
  {
    id: 1,
    title: "Prospecting Agent",
    description: "Research, personalize, and execute sales outreach at scale — instantly. Boost your pipeline by 30%.",
    icon: TrendingUp,
    quote: "I'm here to help put your prospecting efforts on autopilot.",
    speaker: "Prospecting Agent",
    avatarInitials: "PA",
  },
  {
    id: 2,
    title: "Data Agent",
    description: "Get instant answers to custom questions about your customers and market data in seconds.",
    icon: Bot,
    quote: "Does this company sell HubSpot? I want this to be a yes or no answer.",
    speaker: "Smart Property Creator",
    avatarInitials: "SC",
  },
  {
    id: 3,
    title: "Dolor Sit Amet Agent",
    description: "Resolve 65% of your customer inquiries automatically, 24/7. Improve CSAT score instantly.",
    icon: Users,
    quote: "Hello! I'm HubBot, an AI customer service agent. How can I help you today?",
    speaker: "HubBot",
    avatarInitials: "HB",
  },
  {
    id: 4,
    title: "Lorem Ipsum Agent",
    description: "Resolve 65% of your customer inquiries automatically, 24/7. Improve CSAT score instantly.",
    icon: Users,
    quote: "Hello! I'm HubBot, an AI customer service agent. How can I help you today?",
    speaker: "HubBot",
    avatarInitials: "HB",
  },
];

export default function FinalAgentCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalCards = agentCards.length;

  const updateIndex = useCallback(
    (newIndex: number) => {
      const wrappedIndex = (newIndex + totalCards) % totalCards;
      setActiveIndex(wrappedIndex);
    },
    [totalCards]
  );

  const next = useCallback(() => updateIndex(activeIndex + 1), [activeIndex, updateIndex]);
  const prev = useCallback(() => updateIndex(activeIndex - 1), [activeIndex, updateIndex]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  // Desktop variants
  const variantsDesktop = {
    center: { x: "0%", scale: 1.1, opacity: 1, zIndex: 20, boxShadow: "0px 30px 60px rgba(255,100,50,0.3)" },
    left: { x: "-55%", scale: 0.9, opacity: 0.8, zIndex: 10, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
    right: { x: "55%", scale: 0.9, opacity: 0.8, zIndex: 10, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
    "far-left": { x: "-90%", scale: 0.8, opacity: 0.2, zIndex: 5 },
    "far-right": { x: "90%", scale: 0.8, opacity: 0.2, zIndex: 5 },
    hidden: { opacity: 0, scale: 0.7, zIndex: 0 },
  };

  const getDesktopPosition = (index: number) => {
    const diff = (index - activeIndex + totalCards) % totalCards;
    if (diff === 0) return "center";
    if (diff === 1 || diff === -2) return "right";
    if (diff === totalCards - 1 || diff === -1) return "left";
    if (diff === 2 || diff === -1) return "far-right";
    if (diff === totalCards - 2 || diff === -2) return "far-left";
    return "hidden";
  };

  return (
    <section
      className="relative w-full min-h-[600px] flex flex-col justify-center items-center overflow-hidden py-24 bg-gradient-to-r from-pink-100/70 via-rose-100/70 to-orange-100/70"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Desktop Carousel */}
      <div className="hidden md:flex relative w-full max-w-6xl h-[450px] justify-center items-center overflow-visible">
        {agentCards.map((item, index) => {
          const position = getDesktopPosition(index);
          const isCenter = position === "center";
          return (
            <motion.div
              key={item.id}
              variants={variantsDesktop}
              initial={false}
              animate={position}
              transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 18 }}
              className={cn(
                "absolute w-[360px] h-[400px] rounded-2xl bg-white flex flex-col cursor-pointer p-6",
                "hover:z-30"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <CardContent item={item} isCenter={isCenter} />
            </motion.div>
          );
        })}

        {/* Desktop Arrows */}
        <button
          onClick={prev}
          className="absolute left-6 md:left-24 z-30 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 hover:bg-white text-gray-800 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={next}
          className="absolute right-6 md:right-24 z-30 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 hover:bg-white text-gray-800 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative w-full max-w-[95%] h-[450px] flex items-center overflow-hidden">
        <motion.div
          className="flex items-center gap-4 h-full"
          animate={{ x: `calc(-${activeIndex * (320 + 16)}px)` }} // 320px width + 16px gap
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {agentCards.map((item, index) => {
            const isCenter = index === activeIndex;
            return (
              <motion.div
                key={item.id}
                className={cn(
                  "flex-shrink-0 w-[320px] h-[400px] rounded-2xl bg-white flex flex-col p-6 cursor-pointer",
                  isCenter ? "scale-105 shadow-lg z-10" : "scale-95 opacity-80"
                )}
                onClick={() => setActiveIndex(index)}
              >
                <CardContent item={item} isCenter={isCenter} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Play/Pause + Pagination */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-white/50 hover:bg-white transition-colors shadow-md"
          title={isPaused ? "Play Autoscroll" : "Pause Autoscroll"}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current text-gray-700" /> : <Pause className="w-5 h-5 fill-current text-gray-700" />}
        </button>

        <div className="flex gap-2">
          {agentCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === activeIndex ? "w-8 bg-orange-600" : "w-2 bg-gray-300 hover:bg-orange-300"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardContent({ item, isCenter }: { item: AgentCard; isCenter: boolean }) {
  return (
    <>
      <div
        className={cn(
          "relative h-[180px] w-full rounded-xl overflow-hidden mb-6 p-4 flex flex-col justify-center items-center",
          item.title === "Prospecting Agent" && "bg-gradient-to-br from-pink-50 to-rose-100",
          item.title === "Data Agent" && "bg-gradient-to-br from-orange-50 to-yellow-100",
          item.title === "Customer Agent" && "bg-gradient-to-br from-rose-50 to-red-100"
        )}
      >
        <div className="w-full bg-white rounded-lg p-3 shadow-md max-w-[95%] text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
              {item.avatarInitials}
            </div>
            <span className="font-semibold text-xs text-gray-800">{item.speaker}</span>
          </div>
          <p className="italic leading-snug">{item.quote}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{item.description}</p>

      <motion.button
        animate={{ opacity: isCenter ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "mt-auto text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors self-start",
          !isCenter && "pointer-events-none"
        )}
      >
        {isCenter ? "Learn More" : ""}
      </motion.button>
    </>
  );
}