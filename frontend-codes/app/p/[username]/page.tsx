import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  Award
} from "lucide-react"
import Link from "next/link"
import { RadarChartClient } from "./_components/radar-chart-client"

// MOCK DATA
const publicProfile = {
  name: "Kenneth",
  username: "kenneth",
  identity: "Data Engineer & BI Specialist",
  bio: "Building automated data pipelines and clear business intelligence dashboards. Obsessed with SQL optimization and clear storytelling.",
  location: "Lagos, Nigeria",
  website: "https://kenneth.dev",
  tier: "Silver Builder",
  reputation: 850,
  verifiedKSBs: 12,
  ksbData: [
    { dimension: "Knowledge", score: 85, fullMark: 100 },
    { dimension: "Skill", score: 70, fullMark: 100 },
    { dimension: "Behavior", score: 90, fullMark: 100 }
  ],
  portfolio: [
    {
      id: "1",
      title: "End-to-End Inventory Valuation Dashboard",
      type: "Capstone Project",
      description:
        "Built a fully automated Power BI dashboard extracting real-time inventory aging data from Sage 300 via SQL. Reduced reporting latency by 90%.",
      tags: ["Data Modeling", "SQL", "Power BI"],
      link: "#"
    },
    {
      id: "2",
      title: "Code Review: Python API Integration",
      type: "Peer Review",
      description:
        "Provided structured architectural feedback on a peer's REST API, identifying 2 critical security flaws in their authentication middleware.",
      tags: ["Technical Comm.", "Code Auditing", "Python"],
      link: "#"
    },
    {
      id: "3",
      title: "Lagos Traffic Data Cleaning Pipeline",
      type: "Task Challenge",
      description:
        "Wrote a robust Python script to ingest, clean, and normalize 50,000+ rows of messy civic data.",
      tags: ["Python", "Pandas", "Data Cleaning"],
      link: "#"
    }
  ]
}

export default async function PublicPortfolioPage({
  params
}: {
  params: { username: string }
}) {
  return (
    <div className="min-h-screen bg-background selection:bg-orange/20">

      {/* NAV */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            NextHive
          </Link>

          <Button variant="outline" className="rounded-full text-xs">
            Build yours
          </Button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* HERO */}
        <section className="space-y-6 mb-12">

          <div className="flex items-start gap-4">
            <Avatar className="size-16 border border-border/50">
              <AvatarImage src="/ai.png" />
              <AvatarFallback>
                {publicProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {publicProfile.name}
              </h1>

              <p className="text-sm text-muted-foreground font-medium">
                {publicProfile.identity}
              </p>

              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 className="size-4" />
                Verified Public Record
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            {publicProfile.bio}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {publicProfile.location}
            </span>

            <a href={publicProfile.website} className="flex items-center gap-1 hover:text-foreground">
              <LinkIcon className="size-4" />
              Website
            </a>

            <a href="#" className="flex items-center gap-1 hover:text-foreground">
              <Github className="size-4" />
              GitHub
            </a>

            <a href="#" className="flex items-center gap-1 hover:text-foreground">
              <Linkedin className="size-4" />
              LinkedIn
            </a>
          </div>
        </section>

        {/* LAYOUT */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-12">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Verified Work
              </h2>

              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Verified
              </span>
            </div>

            {/* PORTFOLIO */}
            <div className="divide-y divide-border/40 border border-border/50 rounded-2xl">

              {publicProfile.portfolio.map((item) => (
                <div key={item.id} className="p-5 space-y-4">

                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>

                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={item.link}
                    className="inline-flex items-center text-sm font-medium text-foreground hover:text-orange"
                  >
                    View Artifact
                    <ExternalLink className="ml-1 size-3" />
                  </a>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">

            {/* CTA */}
            <Button className="w-full rounded-full bg-yellow">
              Connect with {publicProfile.name}
            </Button>

            {/* REPUTATION */}
            <div className="p-5 border border-border/50 rounded-2xl space-y-4 text-center">
              <Trophy className="mx-auto size-6 text-orange" />

              <div className="text-2xl font-semibold">
                {publicProfile.reputation}
                <span className="text-sm text-muted-foreground ml-1">
                  pts
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {publicProfile.tier}
              </p>

              <div className="text-sm flex items-center justify-center gap-1">
                <Award className="size-4 text-orange" />
                {publicProfile.verifiedKSBs} competencies
              </div>
            </div>

            {/* SKILL MATRIX */}
            <div className="p-5 border border-border/50 rounded-2xl">
              <h4 className="text-sm font-semibold mb-4">
                Skill Matrix
              </h4>

              <div className="h-[220px]">
                <RadarChartClient data={publicProfile.ksbData} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}