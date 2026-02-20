"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Amara Okoro",
    role: "Learning Coordinator",
    company: "Lagos Academy",
    industry: "Education",
    avatar: "/avatars/amara.jpg",
    rating: 5,
    content: "The Hives Africa LMS has transformed how we deliver vocational training. The platform's ease of use is remarkable and the support team is world-class.",
  },
  {
    name: "Kofi Mensah",
    role: "Startup Founder",
    company: "TechHub Accra",
    industry: "Technology",
    avatar: "/avatars/kofi.jpg",
    rating: 5,
    content: "Scaling our training programs across borders became possible only with this LMS. Highly recommend for any African business looking to grow fast.",
  },
  {
    name: "Sarah Mbeki",
    role: "HR Director",
    company: "Nairobi Logistics",
    industry: "Logistics",
    avatar: "/avatars/sarah.jpg",
    rating: 4,
    content: "Our employee onboarding time decreased by 50% after implementing this platform. The reporting features are top-notch and intuitive.",
  },
  {
    name: "Jean-Pierre Bakari",
    role: "Dean of Students",
    company: "Kigali Institute",
    industry: "Higher Ed",
    avatar: "/avatars/jean.jpg",
    rating: 5,
    content: "Innovative, robust, and localized. Finally, an LMS that truly understands the African educational landscape and its unique challenges.",
  },
  {
    name: "Fatima Yusuf",
    role: "Training Manager",
    company: "Abuja Finance",
    industry: "Banking",
    avatar: "/avatars/fatima.jpg",
    rating: 5,
    content: "The compliance training modules are so easy to set up. Our staff actually enjoys the learning process now, which is a huge win for us.",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="py-24 bg-white dark:bg-darkBlue-300 relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 mb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow/10 dark:bg-yellow/20 text-yellow text-xs font-semibold mb-6"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>JOIN 10,000+ ORGANIZATIONS</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-darkBlue-300 dark:text-white"
        >
          What Our <span className="text-yellow">Community</span> Says
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[#4A5568] dark:text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Discover why leading organizations across Africa trust Hives Africa to power their learning ecosystems.
        </motion.p>
      </div>

      <div className="relative group">
        {/* Carousel Container */}
        <div className="flex animate-scroll space-x-6 hover:pause w-max items-stretch pb-8">
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-[400px] bg-white dark:bg-[#2a2f3a] border-border/60 dark:border-white/10 hover:border-yellow transition-all duration-300 flex flex-col shadow-sm hover:shadow-md"
            >
              <CardContent className="p-8 flex-1 flex flex-col relative">
                {/* Header: Quote & Rating */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-primary/10 dark:text-white/10">
                    <Quote className="w-8 h-8 fill-current" />
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow fill-current"
                            : "text-muted-foreground/30 dark:text-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 mb-8">
                  <p className="text-darkBlue-300 dark:text-gray-200 leading-relaxed text-base font-medium">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-auto pt-6 border-t border-border/40 dark:border-white/10">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-border/60 dark:border-white/10 shadow-sm">
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.jpg"}
                        alt={testimonial.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 dark:bg-white/5 text-primary dark:text-white text-xs font-bold">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-darkBlue-300 dark:text-white text-sm leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[#6E7485] dark:text-gray-400 mt-1">
                        {testimonial.role} @ {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subtle Fade Effects */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white dark:from-darkBlue-300 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white dark:from-darkBlue-300 to-transparent pointer-events-none z-20" />
      </div>

      {/* Trust Badge at bottom */}
      <div className="container mx-auto px-4 mt-16 flex flex-col items-center">
        <div className="flex -space-x-3 mb-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-darkBlue-300 bg-muted dark:bg-[#2a2f3a] flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover opacity-80" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-darkBlue-300 bg-yellow text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
            +20
          </div>
        </div>
        <p className="text-sm text-[#6E7485] dark:text-gray-400 font-medium">
          Joined by <span className="text-darkBlue-300 dark:text-white font-bold">100+</span> individuals this month
        </p>
      </div>
    </section>
  );
}
