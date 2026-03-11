"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "sonner"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  BookOpen,
  CreditCard,
  Settings,
  User,
  Send,
  AlertCircle,
  FileText,
  Video,
  Download,
  ExternalLink,
  Loader
} from "lucide-react"
import { cn } from "@/lib/utils"

// ... (Keep your existing interfaces and `faqs` array here)
interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

interface ContactForm {
  name: string
  email: string
  subject: string
  category: string
  message: string
  priority: string
}

interface FormErrors {
  [key: string]: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I enroll in a course?",
    answer: "To enroll in a course, browse our course catalog, click on the course you're interested in, and click the 'Enroll Now' button. You'll be guided through the payment process if it's a paid course, or you can start learning immediately if it's free.",
    category: "courses",
    tags: ["enrollment", "courses", "getting started"],
  },
  {
    id: "2",
    question: "Can I download course videos for offline viewing?",
    answer: "Yes! Premium subscribers can download course videos for offline viewing. Look for the download icon next to each video lesson. Downloaded content is available for 30 days and will be automatically renewed when you're online.",
    category: "courses",
    tags: ["download", "offline", "videos", "premium"],
  },
  {
    id: "3",
    question: "How do I get a refund for a course?",
    answer: "We offer a 30-day money-back guarantee for all paid courses. To request a refund, go to your Purchase History, find the course, and click 'Request Refund'. Refunds are processed within 5-7 business days.",
    category: "billing",
    tags: ["refund", "money-back", "billing"],
  },
  {
    id: "4",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. You can manage your payment methods in the Billing section of your account settings.",
    category: "billing",
    tags: ["payment", "credit card", "paypal", "billing"],
  },
  {
    id: "5",
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. You can also change your password anytime in your Account Settings under the Security tab.",
    category: "account",
    tags: ["password", "reset", "security", "login"],
  },
  {
    id: "6",
    question: "Can I share my account with others?",
    answer: "Each account is for individual use only. Sharing accounts violates our Terms of Service. However, we offer team and enterprise plans for organizations that need multiple user access.",
    category: "account",
    tags: ["sharing", "team", "enterprise", "terms"],
  },
  {
    id: "7",
    question: "How do I track my learning progress?",
    answer: "Your learning progress is automatically tracked and displayed on your dashboard. You can view detailed analytics in the Progress section, including time spent, completion rates, and achievements earned.",
    category: "learning",
    tags: ["progress", "analytics", "tracking", "dashboard"],
  },
  {
    id: "8",
    question: "What browsers are supported?",
    answer: "Our platform works best on the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated and enabling JavaScript.",
    category: "technical",
    tags: ["browser", "compatibility", "technical", "requirements"],
  },
  {
    id: "9",
    question: "How do I contact an instructor?",
    answer: "You can contact instructors through the course discussion forums or by using the 'Message Instructor' feature available in each course. Instructors typically respond within 24-48 hours.",
    category: "learning",
    tags: ["instructor", "contact", "discussion", "support"],
  },
  {
    id: "10",
    question: "Can I get a certificate for completed courses?",
    answer: "Yes! You'll receive a certificate of completion for each course you finish. Certificates are available in your account dashboard and can be downloaded as PDF files or shared on LinkedIn.",
    category: "certificates",
    tags: ["certificate", "completion", "pdf", "linkedin"],
  },
]

const categories = [
  { id: "all", label: "All Categories", icon: HelpCircle },
  { id: "courses", label: "Courses & Learning", icon: BookOpen },
  { id: "billing", label: "Billing & Payments", icon: CreditCard },
  { id: "account", label: "Account & Settings", icon: User },
  { id: "technical", label: "Technical Support", icon: Settings },
  { id: "certificates", label: "Certificates", icon: FileText },
]

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "medium",
  })

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateContactForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!contactForm.name.trim()) newErrors.name = "Name is required"
    if (!contactForm.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(contactForm.email)) newErrors.email = "Valid email is required"
    if (!contactForm.subject.trim()) newErrors.subject = "Subject is required"
    if (!contactForm.category) newErrors.category = "Please select a category"
    if (!contactForm.message.trim()) newErrors.message = "Message is required"
    else if (contactForm.message.length < 10) newErrors.message = "Message must be at least 10 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContactSubmit = async () => {
    if (!validateContactForm()) {
      toast.error("Validation Error", { description: "Please fix the highlighted fields." })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API
      toast.success("Message sent successfully!", { description: "We'll get back to you within 24 hours." })
      setContactForm({ name: "", email: "", subject: "", category: "", message: "", priority: "medium" })
      setIsContactModalOpen(false)
    } catch (error) {
      toast.error("Failed to send message", { description: "Please try again later." })
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.icon : HelpCircle
  }

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">How can we help you?</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Search our knowledge base or get in touch with our support team.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-orange" />
          <Input
            type="text"
            placeholder="Search for articles, billing, certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-base rounded-2xl bg-card border-border shadow-sm focus:border-orange focus:ring-orange/20"
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer group hover:border-orange/50 hover:shadow-md transition-all border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="bg-orange/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6 text-orange" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Contact Support</h3>
                <p className="text-sm text-muted-foreground">Open a ticket</p>
              </CardContent>
            </Card>
          </DialogTrigger>
        </Dialog>

        {[
          { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", title: "Video Tutorials", desc: "Watch how-to guides" },
          { icon: Download, color: "text-green-500", bg: "bg-green-500/10", title: "User Guide", desc: "Download PDF manual" },
          { icon: ExternalLink, color: "text-purple-500", bg: "bg-purple-500/10", title: "Community Forum", desc: "Ask the community" },
        ].map((card, i) => (
          <Card key={i} className="cursor-pointer group hover:border-foreground/30 hover:shadow-md transition-all border-border bg-card">
            <CardContent className="p-6 text-center">
              <div className={cn(card.bg, "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform")}>
                <card.icon className={cn(card.color, "h-6 w-6")} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
              <CardTitle className="text-lg">Topics</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = category.id === "all" ? faqs.length : faqs.filter((faq) => faq.category === category.id).length
                  const isActive = selectedCategory === category.id

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                        isActive ? "bg-orange/10 text-orange font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{category.label}</span>
                      </div>
                      <Badge variant="secondary" className={cn("text-[10px]", isActive ? "bg-orange text-white" : "bg-background border-border text-muted-foreground")}>
                        {count}
                      </Badge>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Contact Info Widget */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Direct Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">hello@hives.africa</p>
                  <p className="text-xs text-muted-foreground">Response in 24 hrs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">+234 9016 0379 91</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Mon-Fri, 9AM-6PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs List */}
        <div className="lg:col-span-3">
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border/50 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle>Frequently Asked Questions</CardTitle>
                <Badge variant="outline" className="bg-background border-border text-muted-foreground font-normal">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? "Result" : "Results"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => {
                    const Icon = getCategoryIcon(faq.category)
                    return (
                      <AccordionItem key={faq.id} value={faq.id} className="border-border px-6">
                        <AccordionTrigger className="text-left hover:no-underline py-5 group">
                          <div className="flex items-start space-x-4 flex-1">
                            <Icon className="h-5 w-5 text-muted-foreground group-hover:text-orange transition-colors mt-0.5 shrink-0" />
                            <span className="font-medium text-foreground text-base leading-snug">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-9 pr-4 pb-6">
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed text-[15px]">{faq.answer}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-muted text-muted-foreground font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <div className="text-center py-16 px-4">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No answers found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{"We couldn't find any FAQs matching your search criteria."}</p>
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all") }} className="rounded-full">
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-xl bg-card border-border rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Contact Support</DialogTitle>
            <DialogDescription>Submit a ticket and our team will get back to you shortly.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className={cn("bg-background border-border rounded-lg", errors.name && "border-destructive focus-visible:ring-destructive/20")}
                />
                {errors.name && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className={cn("bg-background border-border rounded-lg", errors.email && "border-destructive focus-visible:ring-destructive/20")}
                />
                {errors.email && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className={cn("bg-background border-border rounded-lg", errors.subject && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.subject && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.subject}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Category</Label>
                <Select value={contactForm.category} onValueChange={(value) => setContactForm({ ...contactForm, category: value })}>
                  <SelectTrigger className={cn("bg-background border-border rounded-lg", errors.category && "border-destructive focus-visible:ring-destructive/20")}>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="courses">Courses & Learning</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account & Settings</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.category}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Priority</Label>
                <Select value={contactForm.priority} onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}>
                  <SelectTrigger className="bg-background border-border rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="message" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Message</Label>
                <span className="text-[10px] text-muted-foreground">{contactForm.message.length}/1000</span>
              </div>
              <Textarea
                id="message"
                placeholder="How can we help you today?"
                className={cn("h-32 bg-background border-border rounded-lg resize-none", errors.message && "border-destructive focus-visible:ring-destructive/20")}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                maxLength={1000}
              />
              {errors.message && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.message}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6 sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsContactModalOpen(false)} className="rounded-full w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleContactSubmit} disabled={isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white w-full sm:w-auto">
              {isLoading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {isLoading ? "Sending..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}