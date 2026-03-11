"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Download,
  Receipt,
  CreditCard,
  Calendar,
  DollarSign,
  RefreshCw,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  BookOpen
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  type Purchase,
  filterPurchases,
  sortPurchases,
  calculatePurchaseStats,
  downloadReceipt,
  formatDate,
} from "@/lib/purchases"
import { constructUrl } from "@/lib/construct-url"

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/purchases")

        if (!response.ok) {
          throw new Error("Failed to fetch purchases")
        }

        const data = await response.json()
        setPurchases(data.data || [])
      } catch (err) {
        console.error("Error fetching purchases:", err)
        setError(err instanceof Error ? err.message : "Failed to load purchases")
        setPurchases([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const filteredPurchases = filterPurchases(purchases, searchQuery, filterStatus)
  const sortedPurchases = sortPurchases(filteredPurchases, sortBy)
  const stats = calculatePurchaseStats(purchases)

  const handleDownloadReceipt = async (paymentId: string, receiptUrl?: string) => {
    try {
      setIsDownloading(paymentId)
      await downloadReceipt(paymentId, receiptUrl)
      toast.success("Receipt opened", {
        description: "Your receipt has been opened in a new tab."
      })
    } catch (error) {
      console.error("Failed to download receipt:", error)
      toast.error("Failed to download receipt", {
        description: "Please try again later or contact support."
      })
    } finally {
      setIsDownloading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending": return <Clock className="h-4 w-4 text-orange" />
      case "refunded": return <RefreshCw className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Theme-safe translucent badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-600 dark:text-green-400 border-none"
      case "pending": return "bg-orange/10 text-orange border-none"
      case "refunded": return "bg-red-500/10 text-red-600 dark:text-red-400 border-none"
      default: return "bg-muted text-muted-foreground border-none"
    }
  }

  return (
    <div className="space-y-8 max-w-360 mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-border/40">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Purchase History</h1>
          <p className="text-muted-foreground">Manage your receipts, transactions, and billing details.</p>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
          {purchases.length} Total Transactions
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5 rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" strokeWidth={2} />
              <div>
                <p className="font-medium text-destructive">Failed to load purchases</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Serene Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-6">
            <Loader className="h-6 w-6 animate-spin text-orange" strokeWidth={2} />
            <p className="text-muted-foreground text-sm tracking-wide">Retrieving your transaction history...</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Spent", value: `₦${stats.totalSpent.toFixed(2)}`, subtitle: "Across all purchases", icon: DollarSign, color: "text-blue-500" },
              { title: "Total Saved", value: `₦${stats.totalSaved.toFixed(2)}`, subtitle: "From discounts", icon: Star, color: "text-green-500" },
              { title: "Completed", value: purchases.filter((p) => p.status === "completed").length, subtitle: "Successful purchases", icon: CheckCircle, color: "text-orange" },
              { title: "This Month", value: "2", subtitle: "Recent purchases", icon: Calendar, color: "text-purple-500" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground/70 hidden sm:block mt-0.5">{stat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search purchases by course or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-orange focus:ring-orange/20 rounded-xl"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 bg-background border-border rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40 bg-background border-border rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Purchase List */}
          {sortedPurchases.length > 0 ? (
            <div className="space-y-4">
              {sortedPurchases.map((purchase) => (
                <Card key={purchase.id} className="hover:shadow-md transition-shadow bg-card border-border rounded-2xl overflow-hidden">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                      
                      {/* Thumbnail */}
                      <div className="hidden sm:block relative h-24 w-36 shrink-0 rounded-xl overflow-hidden bg-muted">
                        <Image
                          src={purchase.courseThumbnail ? constructUrl(purchase.courseThumbnail) : "/ai.png"}
                          alt={purchase.courseTitle}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight">
                              {purchase.courseTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                              <div className="flex items-center gap-1.5">
                                <Avatar className="h-5 w-5 border border-border">
                                  <AvatarImage src={purchase.instructorAvatar || "/ai.png"} />
                                  <AvatarFallback className="text-[9px]">{purchase.instructor.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{purchase.instructor}</span>
                              </div>
                              {purchase.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                                  <span>{purchase.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {getStatusIcon(purchase.status)}
                            <Badge className={getStatusColor(purchase.status)}>
                              {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Data Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-4 border-t border-border/50">
                          <div>
                            <p className="text-muted-foreground/70 mb-1">Date</p>
                            <p className="font-medium text-foreground">{formatDate(purchase.purchaseDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground/70 mb-1">Amount</p>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-foreground">₦{purchase.amount}</p>
                              {purchase.discount > 0 && (
                                <span className="text-xs text-muted-foreground line-through">₦{purchase.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground/70 mb-1">Payment</p>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium text-foreground">{purchase.paymentMethod}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground/70 mb-1">Category</p>
                            <Badge variant="outline" className="text-xs font-normal border-border bg-muted/50 text-muted-foreground">
                              {purchase.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions & Savings */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                          <div className="w-full sm:w-auto">
                            {purchase.discount > 0 && (
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg py-1.5 px-3 inline-flex items-center">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                  Saved ₦{(purchase.originalPrice - purchase.amount).toFixed(2)} ({purchase.discount}% off)
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-full border-border hover:bg-muted" onClick={() => setSelectedPurchase(purchase)}>
                                  <Receipt className="h-4 w-4 mr-2" />
                                  View Receipt
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md bg-card border-border rounded-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground">Purchase Receipt</DialogTitle>
                                  <DialogDescription>Transaction details for {purchase.courseTitle}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 my-2">
                                  <div className="border border-border/50 bg-muted/30 rounded-xl p-5 space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Course</span>
                                      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{purchase.courseTitle}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Instructor</span>
                                      <span className="text-sm text-foreground">{purchase.instructor}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Date</span>
                                      <span className="text-sm text-foreground">{formatDate(purchase.purchaseDate)}</span>
                                    </div>
                                    <Separator className="bg-border/50" />
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Original Price</span>
                                      <span className="text-sm text-foreground">₦{purchase.originalPrice}</span>
                                    </div>
                                    {purchase.discount > 0 && (
                                      <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                        <span className="text-sm font-medium">Discount ({purchase.discount}%)</span>
                                        <span className="text-sm font-medium">-₦{(purchase.originalPrice - purchase.amount).toFixed(2)}</span>
                                      </div>
                                    )}
                                    <Separator className="bg-border/50" />
                                    <div className="flex justify-between items-center">
                                      <span className="text-base font-bold text-foreground">Total Paid</span>
                                      <span className="text-xl font-bold text-orange">₦{purchase.amount}</span>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    className="w-full bg-orange hover:bg-orange/90 text-white rounded-full"
                                    disabled={isDownloading === selectedPurchase?.id}
                                    onClick={() => selectedPurchase && handleDownloadReceipt(selectedPurchase.id, selectedPurchase.receiptUrl)}
                                  >
                                    {isDownloading === selectedPurchase?.id ? (
                                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4 mr-2" />
                                    )}
                                    {isDownloading === selectedPurchase?.id ? "Downloading..." : "Download PDF"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="rounded-full hover:bg-muted text-muted-foreground"
                              disabled={isDownloading === purchase.id}
                              onClick={() => purchase && handleDownloadReceipt(purchase.id, purchase.receiptUrl)}
                            >
                              {isDownloading === purchase.id ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-border bg-card/50 px-6 py-20 text-center flex flex-col items-center">
              <Receipt className="mx-auto mb-6 h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
              <h3 className="mb-2 font-medium text-lg text-foreground">No purchases found</h3>
              <p className="mb-8 text-sm text-muted-foreground max-w-md">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria to find specific transactions."
                  : "You haven't made any purchases yet. Start exploring our catalog to begin learning."}
              </p>
              {(!searchQuery && filterStatus === "all") ? (
                <Button asChild className="rounded-full bg-orange hover:bg-orange/90 text-white px-8">
                  <Link href="/dashboard/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Catalog
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setFilterStatus("all"); }} className="rounded-full border-border hover:bg-muted px-8">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}