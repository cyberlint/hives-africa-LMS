import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Users } from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full bg-darkBlue-500 dark:bg-[#0f1419] text-white text-xs sm:text-sm transition-colors duration-300">
      <div className="mx-auto px-4 md:px-16 py-2 flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
        
      <Link href="/events">
        <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium">
          <Users size={18} /> {/* Icon */}
          <span>Events</span>  {/* Optional: text label */}
        </Button>
      </Link>

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
