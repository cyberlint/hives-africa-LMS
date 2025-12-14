import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <div className="w-full bg-darkBlue-500 dark:bg-[#0f1419] text-white text-xs sm:text-sm transition-colors duration-300">
      <div className="mx-auto px-4 md:px-16 py-4 flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
        <div className="flex items-center gap-1 cursor-pointer group hover:text-yellow dark:hover:text-yellow transition">
          <span>Become a partner</span>
          <ChevronDown className="text-[#384957] group-hover:text-yellow w-4 h-4" />
        </div>

        <div className="flex items-center gap-1 cursor-pointer group hover:text-yellow dark:hover:text-yellow transition">
          <span>Company</span>
          <ChevronDown className="text-[#384957] group-hover:text-yellow w-4 h-4" />
        </div>

        <Link href="/home" className="hover:text-yellow dark:hover:text-yellow transition">
          Contact Us
        </Link>

        <span className="bg-[#384957] dark:bg-[#2a2f3a] px-2 py-1 rounded-full text-xs">
          +1 888 240 6923
        </span>

        <Link href="/signin" className="hover:text-yellow dark:hover:text-yellow transition">
          Login
        </Link>

        <div className="flex items-center gap-1 cursor-pointer group hover:text-yellow dark:hover:text-yellow transition">
          <span>EN</span>
          <ChevronDown className="text-[#384957] group-hover:text-yellow w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
