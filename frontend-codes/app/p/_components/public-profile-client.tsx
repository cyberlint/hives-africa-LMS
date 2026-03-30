"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  CheckCircle2,
  MapPin,
  Link as LinkIcon,
  FileText,
  ShieldCheck,
  Calendar,
  ExternalLink,
  X
} from "lucide-react";
import { RadarChartClient } from "./radar-chart-client";

export function PublicProfileClient({ profile }: { profile: any }) {
  const [selected, setSelected] = useState<any>(null);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-14 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

          <div className="flex items-center gap-5">
            <Avatar className="size-20 border shadow">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-3xl font-semibold">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">{profile.identity}</p>

              <div className="flex items-center gap-2 text-xs text-green-600">
                <ShieldCheck className="size-3" /> Verified Professional Record
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" className="flex items-center gap-1">
                <LinkIcon className="size-3" /> Website
              </a>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {profile.bio}
          </p>
        )}
      </section>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-10">

        {/* LEFT: HYBRID GRID */}
        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">

          {profile.portfolio.map((item: any) => (
            <div
              key={item.id}
              className="group border rounded-2xl p-5 space-y-4 bg-card hover:shadow-md transition cursor-pointer"
              onClick={() => setSelected(item)}
            >

              {/* TOP META (DRIBBBLE-LIKE SCANNABILITY) */}
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px]">
                  {item.type}
                </Badge>

                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  {item.reviewers.length}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="font-semibold leading-snug group-hover:text-orange transition">
                {item.title}
              </h3>

              {/* SUMMARY PREVIEW */}
              <p className="text-xs text-muted-foreground line-clamp-3">
                {item.summary}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex -space-x-2">
                  {item.reviewers.map((r: any, i: number) => (
                    <Avatar key={i} className="size-6 border">
                      <AvatarImage src={r.image} />
                      <AvatarFallback>{r.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                <span className="text-[11px] text-muted-foreground">
                  View case
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT: CONTEXT PANEL */}
        <div className="lg:col-span-4 space-y-6">

          {/* TRUST CARD */}
          <div className="border rounded-2xl p-6 space-y-3">
            <Trophy className="text-orange" />
            <div className="text-2xl font-semibold">{profile.reputation}</div>
            <p className="text-xs text-muted-foreground">{profile.tier}</p>

            <div className="pt-4 border-t text-xs space-y-1">
              <p className="flex items-center gap-1">
                <Calendar className="size-3" /> {profile.lastVerified}
              </p>
              <p className="flex items-center gap-1">
                <ShieldCheck className="size-3" /> {profile.totalReviewers} reviewers
              </p>
            </div>
          </div>

          {/* SKILLS */}
          <div className="border rounded-2xl p-5">
            <h4 className="text-xs font-semibold mb-3">Competency</h4>
            <div className="h-[200px]">
              <RadarChartClient data={profile.ksbData} />
            </div>
          </div>

        </div>
      </div>

      {/* CASE STUDY MODAL (UNCHANGED CORE) */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl max-w-2xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between">
              <h3 className="font-semibold">{selected.title}</h3>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selected.summary}
            </p>

            {selected.evidenceFiles.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold mb-2">Artifacts</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.evidenceFiles.map((file: string, i: number) => (
                    <a
                      key={i}
                      href={file}
                      target="_blank"
                      className="text-xs px-3 py-1 border rounded-md flex items-center gap-1"
                    >
                      <FileText className="size-3" /> Open
                      <ExternalLink className="size-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold mb-2">Reviews</h4>
              {selected.reviewers.map((r: any, i: number) => (
                <div key={i} className="text-sm border p-3 rounded-lg mb-2">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-muted-foreground italic">"{r.comment}"</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-semibold mb-2">Timeline</h4>
              {selected.timeline.map((t: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{t.step}</span>
                  <span className="text-muted-foreground">{t.date}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}