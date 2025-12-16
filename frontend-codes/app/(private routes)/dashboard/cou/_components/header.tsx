import Link from "next/link"

export function Header() {
  return (
    <header className="bg-[#1a365d] text-white py-3 px-6">
      <div className="container mx-auto flex justify-between items-center text-xs">
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-gray-200 transition-colors duration-200">
            Become a partner
          </Link>
          <Link href="#" className="hover:text-gray-200 transition-colors duration-200">
            Company
          </Link>
          <Link href="#" className="hover:text-gray-200 transition-colors duration-200">
            Contact Us
          </Link>
        </div>
        <div className="hidden md:block">
          <span className="font-medium">+234 888 240 8693</span>
        </div>
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-gray-200 transition-colors duration-200">
            Login
          </Link>
          <Link href="#" className="hover:text-gray-200 transition-colors duration-200">
            EN
          </Link>
        </div>
      </div>
    </header>
  )
}
