export default function Footer() {
  return (
    <footer className="bg-[#0F1D2F] text-white">
      <div className="container py-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#00BFA6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">analytix</span>
            </div>
            <p className="text-white/80 mb-4 max-w-sm">Transforming Learning in Africa</p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Analytix Hive Schools */}
          <div>
            <h3 className="font-semibold mb-4">Analytix Hive Schools</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white">
                  School of Artificial Intelligence
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  School of Data Science
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  School of Engineering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  School of Good Governance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  School of Cyber Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  School of Digital Marketing
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Programs */}
          <div>
            <h3 className="font-semibold mb-4">Featured Programs</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white">
                  Business Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  SQL
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Cloud Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Python Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Just Writing Data
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Why Hive?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Partner with Analytix Hive
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  DPA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Cookies Preferences
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center text-white/60 text-sm">
            <p>Copyright Analytix Hive 2024</p>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
              <a href="#" className="hover:text-white">
                Security
              </a>
              <a href="#" className="hover:text-white">
                Privacy FAQs
              </a>
              <a href="#" className="hover:text-white">
                DPA
              </a>
              <a href="#" className="hover:text-white">
                Sitemap
              </a>
              <a href="#" className="hover:text-white">
                Cookies Preferences
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
