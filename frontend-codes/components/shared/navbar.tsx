"use client";

import { ChevronDown, Menu, X, ShoppingCart, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../ui/theme-toggle";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { items } = useCart();
  const { data: session } = authClient.useSession(); // Use Better Auth like admin
   const user = session?.user;
  const { theme, setTheme } = useTheme();
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="w-full bg-white dark:bg-[#1d2026] text-sm transition-colors duration-300">
      <div className="mx-auto px-4 md:px-16 py-3 md:py-4 flex justify-between items-center gap-8 w-full">
        <div className="flex items-center gap-12 xl:gap-24 w-[70%]">
          <Link href="/">
            <Image
              src={"/assets/Analytix Hive Logo 3.png"}
              alt="Analytix Logo"
              width={70}
              height={70}
            />
          </Link>
        </div>

        {/* Desktop auth links + cart + hamburger icon */}
        <div className="flex items-center gap-4 md:w-[30%] justify-end">
          {/* Theme Toggle */}
           <ThemeToggle />

          {/* Cart Icon */}
          <button
            onClick={() => router.push("/checkout")}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#2a2f3a] rounded-full transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </span>
            )}
          </button>

          {/* Only show login/signup if user is not authenticated */}
          <ul className="flex justify-end items-center gap-4">
          {user ? (
            <li>
              <button
                onClick={async () => {
                  try {
                    await authClient.signOut();
                    router.push("/");
                  } catch (err) {
                    console.error("Sign out failed", err);
                  }
                }}
                className="bg-yellow text-white text-xs md:text-sm font-medium px-6 py-3 cursor-pointer hover:bg-yellow/90 transition inline-block rounded"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => router.push("/signup")}
                className="bg-yellow text-white text-xs md:text-sm font-medium px-6 py-3 cursor-pointer hover:bg-yellow/90 transition inline-block rounded"
              >
                Start Learning
              </button>
            </li>
          )}
          </ul>           
          <button
            className="lg:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 bg-darkBlue-500/95 dark:bg-[#1d2026]/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out h-screen overflow-hidden flex flex-col justify-start items-start gap-12 py-4 w-72 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 w-full">
          <Link href="/">
            <Image
              src={"/assets/Analytix Hive Logo 3.png"}
              alt="Analytix Logo"
              width={70}
              height={70}
            />
          </Link>
        </div>

        <div className="px-4 w-full">
          <ul className="flex flex-col gap-8 text-sm text-white">
            <li>
              <Link href="/" className="active:text-yellow transition">
                Why Analytix
              </Link>
            </li>

            <li>
              <Link href="/" className="active:text-yellow transition">
                Solutions
              </Link>
            </li>

            <li>
              <Link href="/" className="active:text-yellow transition">
                Pricing
              </Link>
            </li>

            <li className="flex items-center gap-1 cursor-pointer group active:text-yellow transition">
              <span>Resources</span>
              <ChevronDown className="text-[#384957] group-hover:text-yellow w-4 h-4" />
            </li>

            {/* Mobile theme toggle */}
     
          <ThemeToggle />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
