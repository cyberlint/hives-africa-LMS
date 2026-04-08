"use client";

import { ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "../ui/theme-toggle";

// Rebranded Navigation Links
const navLinks = [
  { title: "Tech Tracks", href: "/course" },
  { title: "The Arena", href: "/activities" },
  { title: "The Hives", href: "/community/hives" },
  { title: "Community", href: "/community/" },
  { title: "Events", href: "/community/events" },
  { title: "Manifesto", href: "/vision" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  
  const { items } = useCart();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    
    // Add scroll listener for glassmorphic effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handles closing mobile menu when outside the menu is clicked
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
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
      <nav 
        className={`w-full sticky top-0 z-40 transition-all duration-300 border-b ${
          scrolled 
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm py-3" 
            : "bg-background border-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
          
          {/* LEFT: Logo & Desktop Links */}
          <div className="flex items-center gap-10 xl:gap-16">
            <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform">
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
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 sm:gap-5 justify-end">
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => router.push("/checkout")}
              className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Pending Purchases"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-yellow text-background text-sm font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-md"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/signin")}
                    className="text-sm font-bold text-foreground hover:text-orange transition-colors px-2"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-orange text-white text-sm font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-md shadow-orange/20"
                  >
                    Start Building
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="lg:hidden p-2 text-foreground rounded-full hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 bg-card border-r border-border/50 h-screen w-[80%] max-w-sm flex flex-col shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border/50">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
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
            className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          <ul className="flex flex-col gap-6 text-lg font-bold text-foreground">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full hover:text-orange transition-colors"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Footer / Auth */}
        <div className="p-6 border-t border-border/50 space-y-6 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/dashboard");
                }}
                className="w-full bg-yellow text-background text-base font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
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
                  className="w-full bg-muted text-foreground border border-border/50 text-base font-bold py-3.5 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/signup");
                  }}
                  className="w-full bg-orange text-white text-base font-bold py-3.5 rounded-xl shadow-lg shadow-orange/20"
                >
                  Start Building
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