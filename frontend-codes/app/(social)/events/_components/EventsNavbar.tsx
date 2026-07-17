"use client";

import { Menu, PlusCircle } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function EventsNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-8">

                {/* Logo */}

                <Link href="/events" className="flex items-center gap-3 shrink-0">
                    <Image
                        src="/assets/NextHive Logo.png"
                        alt="NextHive"
                        width={42}
                        height={42}
                        className="h-10 w-auto"
                    />

                    <div className="sm:block h-7 w-px bg-border" />

                    <div className="sm:block leading-tight">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            NextHive
                        </p>

                        <p className="text-lg font-semibold">
                            Events
                        </p>
                    </div>
                </Link>

                {/* Navigation */}

                <nav className="ml-10 hidden items-center gap-7 lg:flex">
                    <Link
                        href="/events"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Discover
                    </Link>

                    <Link
                        href="/events/categories"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Categories
                    </Link>

                    <Link
                        href="/events/calendar"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Calendar
                    </Link>

                    <Link
                        href="/events/my-events"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        My Events
                    </Link>
                </nav>

                {/* Actions */}

                <div className="ml-auto flex items-center gap-2">

                    <ThemeToggle />

                    {/* Desktop CTA */}
                    <Button
                        asChild
                        className="hidden sm:inline-flex"
                    >
                        <Link href="/events/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Host an Event
                        </Link>
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                            >
                                <Menu className="h-7 w-7" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-80">

                            <div className="mt-8 flex flex-col gap-2">

                                <Link href="/events" className="rounded-lg px-4 py-3 hover:bg-muted">
                                    Discover
                                </Link>

                                <Link href="/events/categories" className="rounded-lg px-4 py-3 hover:bg-muted">
                                    Categories
                                </Link>

                                <Link href="/events/calendar" className="rounded-lg px-4 py-3 hover:bg-muted">
                                    Calendar
                                </Link>

                                <Link href="/events/my-events" className="rounded-lg px-4 py-3 hover:bg-muted">
                                    My Events
                                </Link>

                                <div className="my-4 border-t" />

                                <Button asChild className="w-full">
                                    <Link href="/events/create">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Host an Event
                                    </Link>
                                </Button>

                            </div>

                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </header>
    );
}