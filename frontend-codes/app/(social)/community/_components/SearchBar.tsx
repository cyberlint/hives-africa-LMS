"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/community/search?q=${encodeURIComponent(q)}`);

  }

  return (
    <form onSubmit={handleSearch} method="GET" action="/community/search" className="relative w-full max-w-md">
      <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search builders, hives, or events..."
                className="pl-9 h-10 bg-muted/40 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-orange/30"
              />
        </div>
    </form>
  )
}