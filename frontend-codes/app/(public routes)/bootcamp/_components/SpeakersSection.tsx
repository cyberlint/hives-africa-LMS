"use client";

import Image from "next/image";
import { Twitter, Linkedin, BriefcaseBusiness, ShieldAlert } from "lucide-react";

const speakers = [
  {
    name: "John Doe",
    title: "Senior AI Researcher",
    company: "OpenAI",
    description: "John leads foundational machine learning research, focusing on the architecture, safety, and deployment of frontier AI models.",
    image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
    twitter: "#",
    linkedin: "#",
    featured: true,
  },
  {
    name: "Jane Smith",
    title: "Lead Data Scientist",
    company: "Google",
    image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
    twitter: "#",
    linkedin: "#",
  },
  // ... other speakers
];

export default function OperatorsSection() {
  const featured = speakers.find((s) => s.featured);
  const others = speakers.filter((s) => !s.featured);

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER: Anti-Guru Framing */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 shadow-sm mb-5">
            <ShieldAlert className="size-4 text-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Industry Vetted
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Guided by Real Operators. <br className="hidden sm:block"/>
            <span className="text-orange">Not Professional Theorists.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            You will be guided by seniors actively working at the highest levels of the industry.
          </p>
        </div>

        {/* FEATURED SPEAKER: The "Heavy Hitter" */}
        {featured && (
          <div className="mb-16 grid gap-10 lg:grid-cols-2 items-center bg-muted/10 rounded-3xl border border-border/50 p-6 sm:p-10">
            
            {/* IMAGE */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-lg">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover"
              />
              {/* Subtle overlay for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black uppercase tracking-widest text-orange bg-orange/10 px-3 py-1.5 rounded-md">
                  Featured Speaker
                </span>
              </div>

              <div>
                <h3 className="text-3xl md:text-5xl font-black leading-tight">
                  {featured.name}
                </h3>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-2">
                  {featured.title} at <span className="text-orange">{featured.company}</span>
                </p>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground max-w-lg">
                {featured.description}
              </p>

              {/* SOCIALS */}
              <div className="flex items-center gap-4 pt-2">
                <a href={featured.twitter} className="p-3 rounded-full border border-border bg-background hover:border-orange hover:text-orange transition">
                  <Twitter className="size-5" />
                </a>
                <a href={featured.linkedin} className="p-3 rounded-full border border-border bg-background hover:border-orange hover:text-orange transition">
                  <Linkedin className="size-5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* OTHER SPEAKERS (HORIZONTAL STRIP) */}
        <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-6">
            {others.map((speaker, i) => (
              <div key={i} className="group min-w-[260px] max-w-[260px] space-y-4">
                {/* IMAGE */}
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <p className="font-bold text-lg text-foreground">
                    {speaker.name}
                  </p>
                  <p className="text-sm font-medium text-orange">
                    {speaker.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {speaker.title}
                  </p>
                </div>

                {/* SOCIALS */}
                <div className="flex gap-2 pt-1">
                  <a href={speaker.linkedin} className="p-2 rounded-md border border-border hover:bg-orange/10 hover:text-orange hover:border-orange/30 transition">
                    <Linkedin className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// "use client";

// import Image from "next/image";
// import { Twitter, Linkedin } from "lucide-react";

// const speakers = [
//   {
//     name: "John Doe",
//     title: "AI Researcher at OpenAI",
//     description:
//       "Building next-generation machine learning systems and pushing the frontier of applied AI.",
//     image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
//     twitter: "#",
//     linkedin: "#",
//     featured: true,
//   },
//   {
//     name: "Jane Smith",
//     title: "Data Scientist at Google",
//     description:
//       "Designing large-scale data systems that power decision-making for millions.",
//     image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
//     twitter: "#",
//     linkedin: "#",
//   },
//   {
//     name: "Emily Johnson",
//     title: "Professor, MIT",
//     description:
//       "Researching machine intelligence and advancing academic + applied AI systems.",
//     image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
//     twitter: "#",
//     linkedin: "#",
//   },
//   {
//     name: "Michael Brown",
//     title: "AI Ethics Researcher",
//     description:
//       "Exploring the intersection of AI, society, and responsible system design.",
//     image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
//     twitter: "#",
//     linkedin: "#",
//   },
//   {
//     name: "Sarah Lee",
//     title: "ML Engineer at Meta",
//     description:
//       "Building production-grade ML systems used across global products.",
//     image: "https://nexthive-lms.fly.storage.tigris.dev/user-avatars/XXAW3WiPEYa4oq0i1cdkBNWXHFzmaMwr/f25693a7-8961-44e8-8084-da80935c330b-IMG_20251010_110620_852.jpg",
//     twitter: "#",
//     linkedin: "#",
//   },
// ];

// export default function SpeakersSection() {
//   const featured = speakers.find((s) => s.featured);
//   const others = speakers.filter((s) => !s.featured);

//   return (
//     <section className="bg-background py-20 md:py-28">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
//         {/* HEADER */}
//         <div className="mb-14 text-center">
//           <h2 className="text-4xl md:text-5xl font-black tracking-tight">
//             Learn from the <span className="text-orange">Operators</span>
//           </h2>
//           <p className="mt-4 text-muted-foreground text-lg">
//             Not theorists. People doing the work at scale.
//           </p>
//         </div>

//         {/* FEATURED SPEAKER */}
//         {featured && (
//           <div className="mb-16 grid gap-10 lg:grid-cols-2 items-center">
            
//             {/* IMAGE */}
//             <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border">
//               <Image
//                 src={featured.image}
//                 alt={featured.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             {/* CONTENT */}
//             <div className="space-y-6">
//               <p className="text-xs font-black uppercase tracking-widest text-orange">
//                 Featured Speaker
//               </p>

//               <h3 className="text-3xl md:text-4xl font-black leading-tight">
//                 {featured.name}
//               </h3>

//               <p className="text-lg font-semibold text-muted-foreground">
//                 {featured.title}
//               </p>

//               <p className="text-base leading-relaxed text-muted-foreground max-w-lg">
//                 {featured.description}
//               </p>

//               {/* SOCIALS */}
//               <div className="flex items-center gap-4 pt-4">
//                 <a
//                   href={featured.twitter}
//                   className="p-3 rounded-full border border-border hover:border-orange transition"
//                 >
//                   <Twitter className="size-5" />
//                 </a>
//                 <a
//                   href={featured.linkedin}
//                   className="p-3 rounded-full border border-border hover:border-orange transition"
//                 >
//                   <Linkedin className="size-5" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* OTHER SPEAKERS (HORIZONTAL STRIP) */}
//         <div className="overflow-x-auto">
//           <div className="flex gap-6 pb-4">
//             {others.map((speaker, i) => (
//               <div
//                 key={i}
//                 className="group min-w-[260px] max-w-[260px] space-y-4"
//               >
//                 {/* IMAGE */}
//                 <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
//                   <Image
//                     src={speaker.image}
//                     alt={speaker.name}
//                     fill
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </div>

//                 {/* TEXT */}
//                 <div>
//                   <p className="font-bold text-foreground">
//                     {speaker.name}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {speaker.title}
//                   </p>
//                 </div>

//                 {/* SOCIALS */}
//                 <div className="flex gap-3 pt-2">
//                   <a
//                     href={speaker.twitter}
//                     className="p-2 rounded-full border border-border hover:border-orange transition"
//                   >
//                     <Twitter className="size-4" />
//                   </a>
//                   <a
//                     href={speaker.linkedin}
//                     className="p-2 rounded-full border border-border hover:border-orange transition"
//                   >
//                     <Linkedin className="size-4" />
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }