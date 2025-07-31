export default function AboutCourse() {
  return (
    <section id="about" className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#0F1D2F] mb-6">About Course</h2>

            <div className="max-w-4xl">
              <p className="text-[#0F1D2F] text-lg leading-relaxed mb-6">
                This (Hons) Business and Management BSc course from University of Essex Online will help you adapt to
                the ever-changing world of business. We&apos;ll examine a range of real-world business examples and use them
                to develop the broad skillset that a good manager should be able to draw from.
              </p>

              <a href="#" className="text-[#00BFA6] underline hover:no-underline">
                Visit University Website →
              </a>
            </div>
          </div>

          {/* Course Info Card - Right side */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-32">
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-[#0F1D2F]">₦5,000</span>
                  <span className="text-lg text-[#6B7280] line-through">₦10,000</span>
                  <span className="bg-[#00BFA6] text-white text-xs px-2 py-1 rounded">50% off</span>
                </div>
              </div>

              {/* This Course Includes */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#0F1D2F] mb-4">This Course Includes :</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-[#00BFA6] rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                    <span className="text-[#0F1D2F]">24 hour on-demand videos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-[#00BFA6] rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <span className="text-[#0F1D2F]">3 study materials</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-[#00BFA6] rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">∞</span>
                    </div>
                    <span className="text-[#0F1D2F]">Full lifetime access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-[#00BFA6] rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🏆</span>
                    </div>
                    <span className="text-[#0F1D2F]">Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#247BA0] text-white py-3 rounded-lg font-medium hover:bg-[#00A693] transition-colors mb-4">
                Enroll Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
