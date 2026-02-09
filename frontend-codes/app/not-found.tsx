"use client";

import Link from "next/link";
import Image from "next/image";
import { MotionDiv, MotionH1, MotionP, MotionButton } from "@/components/framer-motion/motion-components";
import { Home, BookOpen } from "lucide-react";
import Topbar from "@/components/shared/topbar";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-darkBlue-300 transition-colors duration-300">
      <Topbar />
      <Navbar />
      
      <div className="grow flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Illustration Container */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full aspect-square max-w-md mx-auto"
          >
            <Image
              src="/assets/not-found.svg"
              alt="Page Not Found"
              fill
              className="object-contain"
              priority
            />
          </MotionDiv>

          {/* Content */}
          <div className="space-y-4">
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Oops! Page Not Found
            </MotionH1>
            
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto"
            >
              {"It seems you've wandered into uncharted territory. Don't worry, even the best explorers get lost sometimes. Let's get you back on track!"}
            </MotionP>
          </div>

          {/* Action Buttons */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 bg-yellow hover:bg-yellow/90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-yellow/20"
              >
                <Home className="w-5 h-5" />
                Return Home
              </MotionButton>
            </Link>

            <Link href="/dashboard">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all border border-gray-200 dark:border-gray-700"
              >
                <BookOpen className="w-5 h-5" />
                Back to Learning
              </MotionButton>
            </Link>
          </MotionDiv>

          {/* Support Link */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Need help? <Link href="/contact" className="text-yellow hover:underline">Contact Support</Link>
            </p>
          </MotionDiv>
        </div>
      </div>

      <Footer />
    </main>
  );
}
