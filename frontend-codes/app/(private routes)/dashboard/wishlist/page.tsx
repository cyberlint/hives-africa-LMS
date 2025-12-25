"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, ShoppingCart, Star, Clock, Users, Share2, Filter, MoreVertical, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Course } from "@/types"
import ShareWishlistModal from "@/components/modals/share-wishlist-modal"
import Image from "next/image"
import { useDashboard } from "../studentContext"
import { constructUrl } from "@/lib/construct-url"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"
import Link from "next/link"

interface WishlistProps {
  courses: Course[]
  onCourseSelect: (course: Course) => void
}

const Wishlist = () => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isShareWishlistModalOpen, setIsShareWishlistModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { enrolledCourses } = useDashboard()
  const [wishlistCourses, setWishlistCourses] = useState<Course[]>([]) // Local state for wishlist
  const courses = wishlistCourses; // Use local state instead of context
  const { addItem } = useCart()
  
  // Get enrolled course IDs for comparison
  const enrolledCourseIds = enrolledCourses.map((course) => course.id)

  const toggleCourseSelection = (courseId: string) => {
    // Don't allow selecting enrolled courses
    if (enrolledCourseIds.includes(courseId)) {
      toast.error("You're already enrolled in this course")
      return
    }
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  useEffect(() => {
    const fetchWishlist = async () => {
        try {
            const response = await fetch("/api/user/wishlist");
            if(response.ok) {
                const data = await response.json();
                // We need to update the dashboard context ideally, but for now let's use local state or assume context syncs
                // However, the component relies on `courses` from useDashboard(). 
                // We should probably filter `courses` from context based on wishlist state if we can't update context easily
                // OR better, we just use the data from API to display. 
                // But the component iterates `courses`. 
                // Let's see if we can set the courses in a local state that overrides the context one if needed, 
                // OR we just assume `courses` in context IS the wishlist? 
                // The prompt says "wishlist is supposed to show items added to wishlist but it's showing all the course".
                // This implies `courses` from `useDashboard` currently returns ALL courses.
                
                // Let's introduce a local state for wishlist courses and use that instead of `courses` from context
               setWishlistCourses(data.courses);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
            toast.error("Failed to load wishlist");
        }
    }
    fetchWishlist();
  }, []);

  const addToCart = (course: Course) => {
    // Check if user is already enrolled
    if (enrolledCourseIds.includes(course.id)) {
      toast.error("You're already enrolled in this course")
      return
    }

    // Check if already in cart
    addItem({
      id: course.id,
      title: course.title,
      slug: course.id,
      thumbnail: course.thumbnail,
      unitPrice: course.price,
      isFree: course.price === 0,
      instructor: course.instructor.name,
    })
    toast.success(`${course.title} added to cart`)
  }

  const removeFromWishlist = (courseId: string) => {
    // TODO: Implement wishlist removal from API
    console.log("Removed from wishlist:", courseId)
    toast.success("Removed from wishlist")
  }

  const addAllToCart = () => {
    const selectedCoursesToAdd = courses.filter(
      (course) => selectedCourses.includes(course.id) && !enrolledCourseIds.includes(course.id)
    )

    if (selectedCoursesToAdd.length === 0) {
      toast.error("All selected courses are either already enrolled or cannot be added")
      return
    }

    selectedCoursesToAdd.forEach((course) => addToCart(course))
    setSelectedCourses([])
  }

  const handleCourseClick = (course: Course) => {
    // Navigate to course detail
  }

  const handleShareWishlist = () => {
    setIsShareWishlistModalOpen(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-600">{courses.length} courses saved</p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2">
            {selectedCourses.length > 0 && (
              <Button onClick={addAllToCart} className="bg-[#fdb606] hover:bg-[#f39c12]">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add {selectedCourses.length} to Cart
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" onClick={handleShareWishlist}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden w-full">
            <div className="flex gap-2 mb-2">
              {selectedCourses.length > 0 && (
                <Button onClick={addAllToCart} className="flex-1 bg-[#fdb606] hover:bg-[#f39c12]">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add {selectedCourses.length} to Cart
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareWishlist}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Wishlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Browse courses and add them to your wishlist to keep track of what you want to learn.
            </p>
            <Button className="bg-[#fdb606] hover:bg-[#f39c12]">Browse Courses</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id)
            
            return (
            <Card key={course.id} className={`hover:shadow-lg transition-shadow ${isEnrolled ? "opacity-60" : ""}`}>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={course?.thumbnail ? constructUrl(course?.thumbnail) : "/ai.png"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-32 sm:h-48 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  />
                  {isEnrolled && (
                    <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center">
                      <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-800">Enrolled</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => toggleCourseSelection(course.id)}
                      disabled={isEnrolled}
                      className="w-4 h-4 text-[#fdb606] bg-white border-gray-300 rounded focus:ring-[#fdb606] disabled:opacity-50"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                      onClick={() => removeFromWishlist(course.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  {course.price < 100 && !isEnrolled && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-red-500 text-xs">50% OFF</Badge>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 space-y-3">
                  <h3
                    className="font-semibold text-sm sm:text-lg line-clamp-2 cursor-pointer hover:text-[#fdb606] transition-colors"
                    onClick={() => handleCourseClick(course)}
                  >
                    {course.title}
                  </h3>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                      <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                      <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm text-gray-600">{course.instructor.name}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{Math.floor(course.duration / 60)}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>1.2k</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg sm:text-2xl font-bold text-[#fdb606]">${course.price}</span>
                      {course.price < 100 && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ${(course.price * 2).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {isEnrolled ? (
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-sm disabled"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Enrolled
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-[#fdb606] hover:bg-[#f39c12] text-sm"
                        onClick={() => addToCart(course)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCourseClick(course)}
                      className="text-xs sm:text-sm"
                        asChild
                      >
                        <Link href={`/dashboard/learning/${course.id}`}>Preview</Link>
                      </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Price tracking: Last updated 2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}

      {/* Price Alert Banner */}
      {courses.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">Price Drop Alert!</h3>
                <p className="text-xs sm:text-sm text-green-700">
                  2 courses in your wishlist are now on sale. Save up to 50%!
                </p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                View Deals
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Wishlist Modal */}
      <ShareWishlistModal
        isOpen={isShareWishlistModalOpen}
        onClose={() => setIsShareWishlistModalOpen(false)}
        courses={courses}
      />
    </div>
  )
}

export default Wishlist