import { Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a2332] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#1a2332] rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">NextHive</span>
            </div>
            <p className="text-[#8e9aaf] mb-6">Transforming Learning in Africa</p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-[#8e9aaf] hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-[#8e9aaf] hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-[#8e9aaf] hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold mb-4">NextHive Schools</h4>
            <ul className="space-y-2 text-[#8e9aaf]">
              <li>School of Artificial Intelligence</li>
              <li>School of Data Science</li>
              <li>School of Programming</li>
              <li>School of Cloud Computing</li>
              <li>School of Cyber Security</li>
              <li>School of Digital Marketing</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold mb-4">Featured Programs</h4>
            <ul className="space-y-2 text-[#8e9aaf]">
              <li>Business Analytics</li>
              <li>SQL</li>
              <li>Cloud Architect</li>
              <li>Robotics</li>
              <li>Self Driving Cars</li>
              <li>AWS</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-[#8e9aaf]">
              <li>About us</li>
              <li>Why Hive?</li>
              <li>Blog</li>
              <li>Jobs at the Hive</li>
              <li>Partner with NextHive</li>
              <li>Resources</li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#2c3e50] pt-6 flex items-center justify-between text-sm text-[#8e9aaf]">
          <p>Copyright Hives Africa 2025.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of use</span>
            <span>Security</span>
            <span>Privacy FAQs</span>
            <span>DPA</span>
            <span>Sitemap</span>
            <span>Cookies Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
