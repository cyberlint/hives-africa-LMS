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
    <div className=" top-20 bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 whitespace-nowrap border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[#00BFA6] text-[#00BFA6] font-semibold"
                  : "border-transparent text-[#6B7280] hover:text-[#0F1D2F]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
