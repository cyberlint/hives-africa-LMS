"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Hexagon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterLink {
  title: string;
  href: string;
}

// 1. Replaced generic "Schools" with our highly specialized Tech Tracks
const techTracks: FooterLink[] = [
  { title: "Agentic AI Engineering", href: "/tracks/ai" },
  { title: "Data Engineering", href: "/tracks/data" },
  { title: "Cloud Architecture", href: "/tracks/cloud" },
  { title: "Cybersecurity Ops", href: "/tracks/security" },
  { title: "Business Intelligence", href: "/tracks/bi" },
];

// 2. Replaced random "Programs" with the core Engine of the platform
const platformEcosystem: FooterLink[] = [
  { title: "The Arena (Hackathons)", href: "/arena" },
  { title: "The Hives (Study Groups)", href: "/hives" },
  { title: "The Vanguard (Leaderboard)", href: "/vanguard" },
  { title: "Verifiable Portfolios", href: "/portfolio" },
  { title: "Localized Curricula", href: "/vision" },
];

// 3. Upgraded Company links to reflect an elite accelerator, not just an LMS
const nextHiveCompany: FooterLink[] = [
  { title: "Our Manifesto", href: "/manifesto" },
  { title: "Hire NextHive Builders", href: "/hire" },
  { title: "Enterprise Partners", href: "/partners" },
  { title: "Transparency & Trust", href: "/trust" },
  { title: "Careers", href: "/careers" },
];

const legalLinks: FooterLink[] = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Ecosystem", href: "/terms" }, // Tweaked from "Terms of Use"
  { title: "Verification Standards", href: "/standards" },
  { title: "DPA", href: "/dpa" },
];

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-border/50 bg-card overflow-hidden transition-colors duration-300">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-orange/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <Hexagon className="absolute -bottom-24 -right-24 size-96 text-border/30 rotate-12 pointer-events-none -z-10" strokeWidth={0.5} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 xl:gap-24 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="flex flex-col gap-6 w-full lg:w-1/3">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/NextHive Logo.png" // Ensure this image handles dark/light mode, or use an SVG
                alt="NextHive Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain dark:invert" 
              />
            </Link>
            
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-snug">
                The Pan-African <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">
                  Career Accelerator.
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Learn in the language you think in. Build solutions for real African challenges. Prove your competency on the immutable ledger.
              </p>
            </div>

            {/* Newsletter / CTA Join */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Join the Vanguard</p>
              <div className="flex items-center gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background border border-border/50 text-sm rounded-xl px-4 py-2.5 w-full max-w-[200px] focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all"
                />
                <Button className="rounded-xl bg-foreground text-background font-bold px-4 hover:scale-105 transition-transform">
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* LINKS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 w-full lg:w-2/3">
            
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Tech Tracks</h3>
              <ul className="flex flex-col gap-3">
                {techTracks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-orange transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">The Ecosystem</h3>
              <ul className="flex flex-col gap-3">
                {platformEcosystem.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-orange transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">NextHive</h3>
              <ul className="flex flex-col gap-3">
                {nextHiveCompany.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-orange transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/50">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto text-center sm:text-left">
            <p className="text-xs font-medium text-muted-foreground">
              © {new Date().getFullYear()} NextHive Ecosystem. All rights reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons (Replaced static PNGs with crisp Lucide SVGs) */}
          <div className="flex items-center gap-4">
            {[
              { icon: <Twitter className="size-4" />, href: "#" },
              { icon: <Linkedin className="size-4" />, href: "#" },
              { icon: <Github className="size-4" />, href: "#" },
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                className="flex items-center justify-center size-9 rounded-full bg-muted border border-border/50 text-muted-foreground hover:text-orange hover:border-orange/30 hover:bg-orange/10 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;