import Link from "next/link"

const footerSections = [
  {
    title: "NextHive Schools",
    links: [
      "School of Artificial Intelligence",
      "School of Data Science",
      "School of Programming",
      "School of Cloud Computing",
      "School of Cyber Security",
      "School of Digital Marketing",
    ],
  },
  {
    title: "Featured Programs",
    links: ["Business Analytics", "SQL", "Cloud Architect", "Robotics", "Self Driving Cars", "AWS"],
  },
  {
    title: "Company",
    links: ["About us", "Why Hive?", "Blog", "Jobs at the Hive", "Partner with NextHive", "Resources"],
  },
]

const legalLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Security",
  "Privacy FAQs",
  "DPA",
  "Sitemap",
  "Cookie Preferences",
]

export function Footer() {
  return (
    <footer className="bg-[#1a365d] text-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-white text-[#1a365d] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg">analytix</span>
                <span className="text-sm ml-1">hive</span>
              </div>
            </div>
            <p className="mb-4 text-gray-300">Transforming Learning in Africa</p>
            <div className="mt-4">
              <p className="text-sm mb-2">Follow us</p>
              <div className="flex space-x-4">
                {[
                  {
                    name: "Facebook",
                    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                  },
                  {
                    name: "Twitter",
                    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                  },
                  {
                    name: "Instagram",
                    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01",
                  },
                ].map((social) => (
                  <Link key={social.name} href="#" className="hover:text-gray-300 transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d={social.path} />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-gray-300 transition-colors duration-200 text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm">
          <div className="flex flex-wrap justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">Copyright Hive Africa 2025.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link) => (
                <Link key={link} href="#" className="hover:text-gray-300 transition-colors duration-200">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
