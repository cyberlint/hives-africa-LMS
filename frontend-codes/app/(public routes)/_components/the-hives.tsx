// "use client";

// import { MotionDiv } from "@/components/framer-motion/motion-components"; 
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Hexagon, MapPin, Calendar, Users, ArrowRight, Network, PlusCircle } from "lucide-react";
// import Link from "next/link";
// import { format } from "date-fns";

// export interface HiveEvent {
//   id: string;
//   title: string;
//   shortdescription: string;
//   category: string;
//   startdate: Date;
//   isOnline: boolean;
//   venue: string;
//   host: {
//     name: string;
//     image: string | null;
//     role: string;
//   };
// }

// export default function TheHives({ hives }: { hives: HiveEvent[] }) {
//   const hasHives = hives && hives.length > 0;

//   return (
//     <div className="w-full relative py-16 md:py-24 border-t border-border/50">
      
//       {/* Background Ambience - Warm Amber/Yellow Glow for "Hives" */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

//       <div className="px-6 md:px-12 max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <MotionDiv 
//             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
//             className="space-y-3"
//           >
//             <div className="flex items-center gap-2">
//               <span className="flex items-center justify-center size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 rotate-12">
//                 <Hexagon className="size-5 text-amber-500" fill="currentColor" fillOpacity={0.2} />
//               </span>
//               <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
//                 Active Hives
//               </h2>
//             </div>
//             <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
//               Clusters of learners swarming around real problems. Drop into a peer-led study group, brainstorming session, or local meetup to build alongside the community.
//             </p>
//           </MotionDiv>

//           <MotionDiv initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
//             <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-all border-none">
//               <Link href="/community/events/create" className="flex items-center gap-2">
//                 <PlusCircle className="mr-2 size-4" /> Start a Hive
//               </Link>
//             </Button>
//           </MotionDiv>
//         </div>

//         {/* Dynamic Content Area */}
//         {!hasHives ? (
          
//           /* EMPTY STATE */
//           <MotionDiv
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-[2.5rem] border border-dashed border-border/60 bg-card/10 backdrop-blur-sm"
//           >
//             <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 rotate-12">
//               <Network className="size-10 text-amber-500" strokeWidth={1.5} />
//             </div>
            
//             <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
//               The ecosystem is quiet right now
//             </h3>
            
//             <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
//               No active study groups or peer sessions are scheduled for this week. Be the catalyst—gather the community and start building together.
//             </p>
            
//             <Button asChild variant="outline" className="rounded-full font-bold px-8 h-11 border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
//               <Link href="/dashboard/events/new">
//                 Host a Session
//               </Link>
//             </Button>
//           </MotionDiv>

//         ) : (
          
//           /* THE ACTIVE GRID */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {hives.map((hive, i) => (
//               <MotionDiv
//                 key={hive.id}
//                 initial={{ opacity: 0, y: 30 }} 
//                 whileInView={{ opacity: 1, y: 0 }} 
//                 viewport={{ once: true }} 
//                 transition={{ delay: i * 0.1 }}
//                 className="group flex flex-col p-6 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/80 hover:border-amber-500/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden"
//               >
//                 {/* Honeycomb visual accent */}
//                 <Hexagon className="absolute -top-6 -right-6 size-32 text-amber-500/5 rotate-12 group-hover:text-amber-500/10 transition-colors pointer-events-none" strokeWidth={0.5} />

//                 <div className="flex items-center gap-3 mb-5 relative z-10">
//                   <Avatar className="size-10 border-2 border-background shadow-sm ring-1 ring-border/50">
//                     <AvatarImage src={hive.host.image || undefined} />
//                     <AvatarFallback className="text-xs font-bold text-amber-700 bg-amber-100">{hive.host.name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex flex-col">
//                     <span className="text-xs font-bold text-foreground leading-tight">{hive.host.name}</span>
//                     <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{hive.host.role}</span>
//                   </div>
//                 </div>

//                 <Badge variant="secondary" className="w-fit mb-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 text-[10px] uppercase font-bold tracking-wider relative z-10">
//                   {hive.category.replace(/_/g, " ")}
//                 </Badge>

//                 <h3 className="text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors relative z-10 line-clamp-2">
//                   {hive.title}
//                 </h3>
                
//                 <p className="text-sm text-muted-foreground line-clamp-2 mb-6 relative z-10">
//                   {hive.shortdescription}
//                 </p>

//                 <div className="mt-auto space-y-3 pt-4 border-t border-border/50 relative z-10">
//                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
//                     <Calendar className="size-3.5 text-amber-500" />
//                     <span>{format(new Date(hive.startdate), "MMM d • h:mm a")}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
//                     <MapPin className="size-3.5 text-blue-500" />
//                     <span className="truncate">{hive.isOnline ? "Virtual (NextHive)" : hive.venue.replace(/_/g, " ")}</span>
//                   </div>
                  
//                   <Button asChild variant="secondary" className="w-full mt-2 rounded-xl bg-muted/50 hover:bg-amber-500 hover:text-white transition-colors font-bold text-xs h-10 shadow-none">
//                     <Link href={`/events/${hive.id}`}>
//                       Join Hive <ArrowRight className="ml-1.5 size-3" />
//                     </Link>
//                   </Button>
//                 </div>
//               </MotionDiv>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { MotionDiv } from "@/components/framer-motion/motion-components"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hexagon, Users, ArrowRight, Network, PlusCircle, Trophy, Lock, Globe } from "lucide-react";
import Link from "next/link";

// Updated to match your Prisma schema for Hives
export interface RankedHive {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  reputation: number;
  isPrivate: boolean;
  memberCount: number;
  // A slice of members to render the overlapping avatars (social proof)
  members: {
    user: {
      name: string;
      image: string | null;
    }
  }[];
}

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

export default function TheHives({ hives }: { hives: RankedHive[] }) {
  const hasHives = hives && hives.length > 0;

  return (
    <div className="w-full relative py-16 md:py-24 border-t border-border/50">
      
      {/* Background Ambience - Warm Amber/Yellow Glow for "Hives" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 rotate-12">
                <Hexagon className="size-5 text-amber-500" fill="currentColor" fillOpacity={0.2} />
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                Active Hives
              </h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Clusters of learners swarming around real problems. Join an elite squad, pool your equity, conquer Arena challenges, and climb the global leaderboard.
            </p>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-all border-none">
              <Link href="/community/hives" className="flex items-center gap-2">
                <PlusCircle className="mr-2 size-4" /> Form a Hive
              </Link>
            </Button>
          </MotionDiv>
        </div>

        {/* Dynamic Content Area */}
        {!hasHives ? (
          
          /* EMPTY STATE */
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-[2.5rem] border border-dashed border-border/60 bg-card/10 backdrop-blur-sm"
          >
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 rotate-12">
              <Network className="size-10 text-amber-500" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
              The ecosystem is quiet right now
            </h3>
            
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
              No squads have established their dominion yet. Be the catalyst—gather the community, form the first Hive, and set the standard.
            </p>
            
            <Button asChild variant="outline" className="rounded-full font-bold px-8 h-11 border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
              <Link href="/community/hives/create">
                Claim the Genesis Hive
              </Link>
            </Button>
          </MotionDiv>

        ) : (
          
          /* THE ACTIVE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hives.map((hive, i) => (
              <MotionDiv
                key={hive.id}
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col p-6 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/80 hover:border-amber-500/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                {/* Honeycomb visual accent */}
                <Hexagon className="absolute -top-6 -right-6 size-32 text-amber-500/5 rotate-12 group-hover:text-amber-500/10 transition-colors pointer-events-none" strokeWidth={0.5} />
                
                {/* Visual Rank Accent */}
                <div className="absolute top-4 right-6 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-3xl font-black italic text-amber-500/20">
                    #{i + 1}
                  </span>
                </div>

                {/* Team Avatars & Privacy */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="flex -space-x-2">
                    {hive.members.slice(0, 3).map((member, idx) => (
                      <Avatar key={idx} className="size-8 border-2 border-background shadow-sm ring-1 ring-border/50 transition-transform hover:-translate-y-1 hover:z-10">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback className="text-[10px] font-bold text-amber-700 bg-amber-100">
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {hive.memberCount > 3 && (
                      <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground z-0 ring-1 ring-border/50">
                        +{hive.memberCount - 3}
                      </div>
                    )}
                  </div>

                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 text-[9px] uppercase font-bold tracking-wider">
                    {hive.isPrivate ? <Lock className="size-3 mr-1 inline-block" /> : <Globe className="size-3 mr-1 inline-block" />}
                    {hive.isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors relative z-10 line-clamp-1">
                  {hive.name}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 relative z-10 h-10">
                  {hive.description || "An elite faction operating within the ecosystem."}
                </p>

                <div className="mt-auto space-y-3 pt-4 border-t border-border/50 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Trophy className="size-3.5 text-yellow-500" />
                      <span className="font-bold text-foreground">{new Intl.NumberFormat().format(hive.reputation)}</span>
                      <span className="text-[10px] uppercase tracking-wider">Rep</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users className="size-3.5 text-blue-500" />
                      <span>{hive.memberCount} Members</span>
                    </div>
                  </div>
                  
                  <Button asChild variant="secondary" className="w-full mt-2 rounded-xl bg-muted/50 hover:bg-amber-500 hover:text-white transition-colors font-bold text-xs h-10 shadow-none group/btn">
                    <Link href={`/community/hives/${hive.slug}`}>
                      Inspect Hive <ArrowRight className="ml-1.5 size-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}