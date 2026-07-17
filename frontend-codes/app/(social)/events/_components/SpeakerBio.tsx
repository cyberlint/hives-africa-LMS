"use client";

import { useState } from "react";

interface Props {
  bio: string;
}

export default function SpeakerBio({ bio }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3">
      <p
        className={`text-sm leading-6 text-muted-foreground transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {bio}
      </p>

      {bio.length > 180 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}