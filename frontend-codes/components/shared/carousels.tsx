"use client";

import { Star, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MotionDiv } from "@/components/framer-motion/motion-components";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Chidi Okafor",
    role: "Backend Builder",
    focus: "Data Engineering",
    avatar: "/avatars/chidi.jpg", 
    rating: 5,
    content: "I'm tired of collecting generic paper certificates that employers ignore. I joined NextHive specifically to build a cryptographically verified portfolio.",
  },
  {
    name: "Amina Yusuf",
    role: "Cloud Enthusiast",
    focus: "Cloud Architecture",
    avatar: "/avatars/amina.jpg",
    rating: 5,
    content: "Learning complex tech in a vacuum is hard. The idea of joining a 'Hive' and discussing AWS deployments in Hausa and Pidgin is an absolute game-changer.",
  },
  {
    name: "Kwame Mensah",
    role: "Self-Taught Dev",
    focus: "Agentic AI",
    avatar: "/avatars/kwame.jpg",
    rating: 5,
    content: "Self-study is incredibly lonely. I'm here for The Arena. I want to test my skills in high-stakes hackathons and earn my spot on the Vanguard leaderboard.",
  },
  {
    name: "Zola Mbeki",
    role: "Career Transitioner",
    focus: "Cybersecurity Ops",
    avatar: "/avatars/zola.jpg",
    rating: 5,
    content: "The tech tracks are exactly what I needed. No fluff, no 40-hour video lectures on outdated theory—just the core stack required to get hired in Africa today.",
  },
  {
    name: "Oluwaseun Adeyemi",
    role: "Frontend Developer",
    focus: "Full Stack",
    avatar: "/avatars/olu.jpg",
    rating: 5,
    content: "Finally, a platform that feels like it was built for our context. Building capstones focused on African fintech and logistics rather than generic weather apps is brilliant.",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-orange/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Badge variant="outline" className="bg-orange/10 text-orange border-orange/20 px-4 py-1.5 font-bold tracking-widest uppercase text-[10px] shadow-sm">
            <Sparkles className="size-3.5 mr-1.5 inline-block" /> The Early Cohort
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground text-balance">
            Why Builders are <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">Joining NextHive</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-balance mt-2">
            We are building a new standard for tech education in Africa. Hear from the founding members who are ditching traditional courses for verifiable skills.
          </p>
        </MotionDiv>
      </div>

      <div className="relative group max-w-[100vw] overflow-hidden">
        
        {/* Carousel Container */}
        {/* 🚨 FIX: Forced animation duration to 120s for a slow, readable crawl. 
            Added hover & active pause states for Desktop & Mobile. */}
        <div 
          className="flex animate-scroll w-max items-stretch pb-8 gap-6 px-6 hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer"
          style={{ animationDuration: "120s" }} 
        >
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[320px] md:w-[400px] bg-card/80 backdrop-blur-md border border-border/50 rounded-[2rem] hover:border-orange/40 hover:bg-card transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl relative overflow-hidden group/card"
            >
              <div className="absolute -top-12 -right-12 size-24 bg-orange/0 group-hover/card:bg-orange/10 blur-2xl rounded-full transition-colors duration-500 pointer-events-none" />

              <div className="p-8 flex-1 flex flex-col relative z-10">
                {/* Header: Quote & Rating */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-orange/80">
                    <Quote className="size-5 fill-current" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < testimonial.rating
                            ? "text-orange fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 mb-8">
                  <p className="text-foreground/90 leading-relaxed text-base md:text-lg font-medium text-pretty">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 border-2 border-background shadow-md">
                      <AvatarImage
                        src={testimonial.avatar || undefined}
                        alt={testimonial.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground font-black">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-foreground text-sm leading-tight group-hover/card:text-orange transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {testimonial.role} • <span className="text-foreground/70">{testimonial.focus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CSS Gradient Masks for smooth entry/exit of cards */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-48 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-48 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>

      {/* Trust Badge at bottom */}
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 mt-12 flex flex-col items-center"
      >
        <div className="flex -space-x-3 mb-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="size-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Builder" className="w-full h-full object-cover opacity-80" />
            </div>
          ))}
          <div className="size-10 rounded-full border-2 border-background bg-orange text-white flex items-center justify-center text-xs font-black shadow-sm">
            +50
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-medium text-center">
          Joined by <span className="text-foreground font-bold">100+ Founding Builders</span> this month
        </p>
      </MotionDiv>
    </section>
  );
}