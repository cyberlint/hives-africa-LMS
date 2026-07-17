// Main Navigation Shell

"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "../ui/theme-toggle";

import { navigation } from "./navigation.config";
import DesktopNavItem from "./DesktopNavItem";
import MobileNavItem from "./MobileNavItem";
import MegaMenu from "./MegaMenu";
import { megaMenuConfig } from "./mega-menu.config";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeMenu, setActiveMenu] =
    useState<keyof typeof megaMenuConfig | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (!mounted) return null;

  return (
    <>
      <div
        className="relative"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <nav
          className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm py-3"
            : "bg-background border-transparent py-4 md:py-5"
            }`}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Left */}
            <div className="flex items-center gap-10 xl:gap-16">

              <Link
                href="/"
                className="flex-shrink-0 transition-transform hover:scale-105"
              >
                <Image
                  src="/assets/NextHive Logo.png"
                  alt="NextHive Logo"
                  width={100}
                  height={32}
                  className="h-8 w-auto object-contain dark:invert"
                />
              </Link>

              {/* Desktop Navigation */}
              <ul className="hidden lg:flex items-center gap-8">
                {navigation.map((item) => (
                  <li
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => {
                      if (item.type === "mega") {
                        setActiveMenu(item.key);
                      }
                    }}
                  >
                    <DesktopNavItem
                      item={item}
                      isActive={
                        item.type === "mega" &&
                        activeMenu === item.key
                      }
                    />
                  </li>
                ))}
              </ul>

            </div>
            {/* Right */}
            <div className="flex items-center justify-end gap-3 sm:gap-5">

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Desktop Authentication */}
              <div className="hidden sm:flex items-center gap-3">

                {user ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="
                    rounded-full
                    bg-yellow
                    px-6
                    py-2.5
                    text-sm
                    font-bold
                    text-background
                    shadow-md
                    transition-transform
                    hover:scale-105
                  "
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/signin")}
                      className="
                      px-2
                      text-sm
                      font-bold
                      text-foreground
                      transition-colors
                      hover:text-orange
                    "
                    >
                      Sign In
                    </button>

                    <button
                      onClick={() => router.push("/signup")}
                      className="
                      rounded-full
                      bg-orange
                      px-6
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      shadow-md
                      shadow-orange/20
                      transition-transform
                      hover:scale-105
                    "
                    >
                      Get Started
                    </button>
                  </>
                )}

              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="
                rounded-full
                p-2
                text-foreground
                transition-colors
                hover:bg-muted
                lg:hidden
              "
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>

            </div>

          </div>
        </nav>
        {activeMenu && (
          <div
            className="absolute left-0 right-0 top-full z-50"
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <MegaMenu section={megaMenuConfig[activeMenu]} />
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* Mobile Menu Overlay */}
      {/* ========================= */}

      <div
        aria-hidden="true"
        className={`
          fixed
          inset-0
          z-50
          bg-background/80
          backdrop-blur-sm
          transition-opacity
          duration-300
          lg:hidden

          ${isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
          }
        `}
      />

      {/* ========================= */}
      {/* Mobile Drawer */}
      {/* ========================= */}

      <div
        ref={menuRef}
        className={`
          fixed
          top-0
          left-0
          z-50
          flex
          h-screen
          w-[80%]
          max-w-sm
          flex-col
          border-r
          border-border/50
          bg-card
          shadow-2xl
          transition-transform
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:hidden

          ${isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* Mobile Header */}

        <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">

          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/assets/NextHive Logo.png"
              alt="NextHive Logo"
              width={90}
              height={30}
              className="h-7 w-auto object-contain dark:invert"
            />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="
              rounded-full
              bg-muted
              p-2
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* Mobile Navigation */}

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <ul className="flex flex-col">

            {navigation.map((item) => (
              <MobileNavItem
                key={item.title}
                item={item}
                onNavigate={() => {
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}

          </ul>

        </div>
        {/* ========================= */}
        {/* Mobile Footer */}
        {/* ========================= */}

        <div className="space-y-2 border-t border-border/50 bg-muted/30 p-15">

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground">
              Theme
            </span>

            <ThemeToggle />
          </div>

          <div className="flex flex-col gap-8">

            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/dashboard");
                }}
                className="
                  w-full
                  rounded-xl
                  bg-yellow
                  py-3.5
                  text-base
                  font-bold
                  text-background
                  transition-opacity
                  hover:opacity-90
                "
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/signin");
                  }}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-border/50
                    bg-muted
                    py-3.5
                    text-base
                    font-bold
                    text-foreground
                    transition-colors
                    hover:bg-muted/80
                  "
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/signup");
                  }}
                  className="
                    w-full
                    rounded-xl
                    bg-orange
                    py-3.5
                    text-base
                    font-bold
                    text-white
                    shadow-lg
                    shadow-orange/20
                    transition-transform
                    hover:scale-[1.02]
                  "
                >
                  Get Started
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </>
  );
};

export default Navbar;        