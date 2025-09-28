"use client"

const tabs = [
  { id: "about", label: "About Us" },
  { id: "curriculum", label: "Course Curriculum" },
  { id: "requirements", label: "Entry Requirement" },
  { id: "fees", label: "Course Fees" },
  { id: "reviews", label: "Reviews" },
]

interface TabsNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    // sticky top-20
    <div className=" bg-white border-b  border-gray-200 z-40 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 sm:py-4 px-2 whitespace-nowrap border-b-2 font-medium text-xs sm:text-sm transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-yellow text-yellow font-semibold"
                    : "border-transparent text-[#6B7280] hover:text-[#0F1D2F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
