export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-[#e9ecef] py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1a2332] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-[#1a2332]">NextHive</span>
          </div>

          <div className="flex items-center space-x-8">
            <span className="text-[#2c3e50] hover:text-[#ff6b35] cursor-pointer">Explore Courses</span>
            <span className="text-[#2c3e50] hover:text-[#ff6b35] cursor-pointer">Communities</span>
            <span className="text-[#2c3e50] hover:text-[#ff6b35] cursor-pointer">My Learnings</span>
            <div className="w-8 h-8 bg-yellow rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}
