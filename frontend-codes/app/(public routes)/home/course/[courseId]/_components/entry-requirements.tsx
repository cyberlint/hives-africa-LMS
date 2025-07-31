"use client"

export default function EntryRequirements() {
  return (
    <section id="requirements" className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#0F1D2F] mb-8">Entry Requirements</h2>

            {/* Academic Requirement */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#0F1D2F] mb-4">Academic Requirement</h3>
              <p className="text-[#6B7280] text-sm mb-6">
                We are not aware of any specific CIMA, GMAT or GPA grading score requirements for this programme.
              </p>

              {/* English Requirement */}
              <h4 className="text-lg font-medium text-[#0F1D2F] mb-4">English Requirement</h4>
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">I</span>
                      </div>
                      <div>
                        <div className="font-medium text-[#0F1D2F]">IELTS</div>
                        <div className="text-2xl font-bold text-[#0F1D2F]">6</div>
                      </div>
                    </div>
                    <button className="text-[#00BFA6] border border-[#00BFA6] px-3 py-1 rounded text-xs hover:bg-[#00BFA6] hover:text-white transition-colors">
                      Schedule an IELTS test
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-[#6B7280] font-medium">OR</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">T</span>
                    </div>
                    <div>
                      <div className="font-medium text-[#0F1D2F]">TOEFL iBT</div>
                      <div className="text-2xl font-bold text-[#0F1D2F]">75</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Requirements */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F1D2F] mb-4">Other Requirement</h3>
              <div className="mb-4">
                <h4 className="font-medium text-[#0F1D2F] mb-2">General Requirements</h4>
                <p className="text-[#6B7280] text-sm mb-4">
                  In order to satisfy the academic entry route requirements for our BA (Hons) Business and Management,
                  you must have the following qualifications as a minimum:
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#00BFA6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F]">Two A-levels or equivalent</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#00BFA6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F]">GCSE Math and English at grade C or above, or equivalent</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#00BFA6] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F]">Three years relevant work experience</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Empty space to maintain layout */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </section>
  )
}
