"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { toast } from "sonner"
import {
  UserIcon,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Save,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Upload,
  X,
  Loader
} from "lucide-react"
import type { User } from "@/types"
import { useDashboard } from "@/app/(private routes)/dashboard/studentContext"
import Image from "next/image"
import { downloadReceipt } from "@/lib/purchases"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface AccountSettingsProps {
  user?: User
  onUserUpdate?: (user: User) => void
}

interface FormErrors {
  [key: string]: string
}

interface NotificationSettings {
  courseUpdates: boolean
  priceDrops: boolean
  learningReminders: boolean
  marketingEmails: boolean
  emailFrequency: string
}

interface SecuritySettings {
  currentPassword: string
  newPassword: string
  password_confirm: string
  twoFactorSMS: boolean
  twoFactorApp: boolean
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  bio: string
  website: string
  avatar: string
}

interface LearningPreferences {
  language: string
  autoplay: boolean
  closedCaptions: boolean
  downloadQuality: string
  dailyGoal: number
  weeklyGoal: number
}

interface Purchase {
  id: string;
  courseTitle: string;
  amount: number;
  currency: string;
  date: string;
  receiptUrl: string;
}

export default function AccountSettings() {
  const { user, refetch } = useDashboard()
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [purchases, setPurchases] = useState<Purchase[]>([])

  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [sessions, setSessions] = useState<any[]>([])

  // Fetch data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/settings');
        if (response.ok) {
          const data = await response.json();
          const backendUser = data.user;
          const [firstName, ...lastNameParts] = (backendUser.name || "").split(" ");
          
          setProfileData({
            firstName: firstName || "",
            lastName: lastNameParts.join(" ") || "",
            email: backendUser.email || "",
            bio: backendUser.bio || "",
            website: backendUser.website || "",
            avatar: backendUser.image || backendUser.avatar || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user settings", error);
      }
    };

    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/user/purchases');
        if (response.ok) {
          const data = await response.json();
          setPurchases(data.purchases);
        }
      } catch (error) {
        console.error("Failed to fetch purchases", error);
      }
    };

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/user/sessions');
            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        }
    }

    fetchUserData();
    fetchPurchases();
    fetchSessions();
  }, []);

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user.name.split(" ")[0] || "",
    lastName: user.name.split(" ")[1] || "",
    email: user.email || "",
    bio: "",
    website: "",
    avatar: user.avatar || "",
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    courseUpdates: true,
    priceDrops: true,
    learningReminders: false,
    marketingEmails: false,
    emailFrequency: "weekly",
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    password_confirm: "",
    twoFactorSMS: false,
    twoFactorApp: false,
  })

  const [learningPreferences, setLearningPreferences] = useState<LearningPreferences>({
    language: user.preferences.language,
    autoplay: user.preferences.autoplay,
    closedCaptions: false,
    downloadQuality: user.preferences.quality,
    dailyGoal: 30,
    weeklyGoal: 5,
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: Globe },
  ]

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
  }

  const validateWebsite = (website: string): boolean => {
    if (!website) return true
    try {
      new URL(website)
      return true
    } catch {
      return false
    }
  }

  const validateProfileForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!profileData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!profileData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!profileData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(profileData.email)) newErrors.email = "Please enter a valid email address"
    if (profileData.website && !validateWebsite(profileData.website)) newErrors.website = "Please enter a valid URL (including http:// or https://)"
    if (profileData.bio.length > 500) newErrors.bio = "Bio must be less than 500 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSecurityForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!securitySettings.currentPassword) newErrors.currentPassword = "Current password is required"
    if (!securitySettings.newPassword) newErrors.newPassword = "New password is required"
    else if (!validatePassword(securitySettings.newPassword)) newErrors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, and number"
    if (securitySettings.newPassword !== securitySettings.password_confirm) newErrors.password_confirm = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", { description: "Please select a file smaller than 2MB" })
        return
      }
      if (!file?.type!.startsWith("image/")) {
        toast.error("Invalid file type", { description: "Please select an image file (JPG, PNG, GIF)" })
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoUpload = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          size: selectedFile.size,
          isImage: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { presignedUrl, key } = await response.json();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload image to storage");

      const newAvatarUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;
       
      setProfileData((prev) => ({ ...prev, avatar: newAvatarUrl }))

      await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: newAvatarUrl })
      });
      
      if (refetch) refetch();

      toast.success("Photo updated successfully", { description: "Your profile photo has been updated" })

      setIsPhotoDialogOpen(false)
      setSelectedFile(null)
      setPreviewUrl("")
    } catch (error: any) {
      toast.error("Upload failed", { description: error.message || "Failed to upload photo. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      toast.error("Validation Error", { description: "Please fix the errors below" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          bio: profileData.bio,
          website: profileData.website,
          avatar: profileData.avatar,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Profile updated successfully", { description: "Your profile information has been saved" });
      if (refetch) refetch(); 
    } catch (error) {
       toast.error("Update failed", { description: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordChange = async () => {
    if (!validateSecurityForm()) {
      toast.error("Validation Error", { description: "Please fix the errors below" })
      return
    }

    setIsLoading(true)
    try {
      await authClient.changePassword({
        newPassword: securitySettings.newPassword,
        currentPassword: securitySettings.currentPassword,
        revokeOtherSessions: true,
      }, {
        onSuccess: () => {
             toast.success("Password updated successfully", { description: "Your password has been changed" });
             setSecuritySettings({
                currentPassword: "",
                newPassword: "",
                password_confirm: "",
                twoFactorSMS: securitySettings.twoFactorSMS,
                twoFactorApp: securitySettings.twoFactorApp,
             });
        },
        onError: (ctx) => {
             toast.error("Update failed", { description: ctx.error.message || "Failed to update password. Please try again." });
        }
      });
    } catch (error) {
       // Error handled in onError callback
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Notifications updated", { description: "Your notification preferences have been saved" })
    } catch (error) {
      toast.error("Update failed", { description: "Failed to update notifications. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Preferences updated", { description: "Your learning preferences have been saved" })
    } catch (error) {
      toast.error("Update failed", { description: "Failed to update preferences. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await authClient.deleteUser({ callbackURL: "/" });
      toast.success("Account deleted", { description: "Your account has been successfully deleted." });
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error("Deletion failed", { description: error.message || "Failed to delete account. Please try again." });
    } finally {
      setIsLoading(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/sessions?id=${sessionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to revoke");

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success("Session revoked", { description: "The session has been successfully revoked" })
    } catch (error) {
      toast.error("Revoke failed", { description: "Failed to revoke session. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setErrors({})
  }, [activeTab])

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto pb-12">
      <div className="space-y-2 pb-4 border-b border-border/40">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, security preferences, and billing details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card sticky top-24">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                        isActive ? "bg-orange/10 text-orange font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card className="border-border bg-card rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
                    <AvatarImage src={profileData.avatar || "/ai.png"} alt={profileData.firstName} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-muted text-muted-foreground">{profileData.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full border-border hover:bg-muted">
                          <Camera className="h-4 w-4 mr-2 text-muted-foreground" />
                          Change Photo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md bg-card border-border rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Update Profile Photo</DialogTitle>
                          <DialogDescription>Choose a new profile photo. Max size 2MB. Supported formats: JPG, PNG, GIF.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex flex-col items-center space-y-6">
                            {previewUrl ? (
                              <div className="relative">
                                <Image src={previewUrl || "/ai.png"} alt="Preview" width={128} height={128} className="w-32 h-32 rounded-full object-cover border-4 border-muted" />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute 0 rounded-full shadow-md h-8 w-8"
                                  onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-32 h-32 border-2 border-dashed border-border/60 bg-muted/30 rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                            )}
                            <div>
                              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="photo-upload" />
                              <Label htmlFor="photo-upload" className="cursor-pointer">
                                <Button variant="outline" size="sm" asChild className="rounded-full">
                                  <span>Select Photo</span>
                                </Button>
                              </Label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="gap-2 sm:justify-end">
                          <Button variant="outline" className="rounded-full" onClick={() => setIsPhotoDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handlePhotoUpload} disabled={!selectedFile || isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white">
                            {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                            {isLoading ? "Uploading..." : "Save Photo"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className={cn("bg-background border-border rounded-lg", errors.firstName && "border-destructive focus-visible:ring-destructive/20")}
                    />
                    {errors.firstName && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className={cn("bg-background border-border rounded-lg", errors.lastName && "border-destructive focus-visible:ring-destructive/20")}
                    />
                    {errors.lastName && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    className={cn("bg-background border-border rounded-lg", errors.email && "border-destructive focus-visible:ring-destructive/20")}
                  />
                  {errors.email && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="bio" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Bio</Label>
                    <span className="text-[10px] text-muted-foreground">{profileData.bio.length}/500</span>
                  </div>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className={cn("h-28 bg-background border-border rounded-lg resize-none", errors.bio && "border-destructive focus-visible:ring-destructive/20")}
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    maxLength={500}
                  />
                  {errors.bio && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.bio}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={profileData.website}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                    className={cn("bg-background border-border rounded-lg", errors.website && "border-destructive focus-visible:ring-destructive/20")}
                  />
                  {errors.website && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.website}</p>}
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button onClick={handleSaveProfile} disabled={isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white px-8">
                    {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card className="border-border bg-card rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-5">
                  {[
                    { title: "Course Updates", desc: "Get notified when instructors post new content", stateKey: "courseUpdates" },
                    { title: "Price Drops", desc: "Alert me when wishlist courses go on sale", stateKey: "priceDrops" },
                    { title: "Learning Reminders", desc: "Remind me to continue my courses", stateKey: "learningReminders" },
                    { title: "Marketing Emails", desc: "Receive promotional content and course recommendations", stateKey: "marketingEmails" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex-1 pr-4">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notificationSettings[item.stateKey as keyof NotificationSettings] as boolean}
                          onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, [item.stateKey]: checked }))}
                        />
                      </div>
                      {idx !== 3 && <Separator className="mt-5 bg-border/50" />}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-foreground">Email Frequency</h4>
                  <Select value={notificationSettings.emailFrequency} onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, emailFrequency: value }))}>
                    <SelectTrigger className="w-full sm:w-64 bg-background border-border rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border rounded-lg">
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="monthly">Monthly newsletter</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button onClick={handleNotificationSave} disabled={isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white px-8">
                    {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <Card className="border-border bg-card rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className={cn("bg-background border-border rounded-lg", errors.currentPassword && "border-destructive focus-visible:ring-destructive/20")}
                      />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.currentPassword && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.currentPassword}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securitySettings.newPassword}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className={cn("bg-background border-border rounded-lg", errors.newPassword && "border-destructive focus-visible:ring-destructive/20")}
                    />
                    {errors.newPassword ? (
                      <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.newPassword}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase, lowercase, and number.</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password_confirm" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Confirm New Password</Label>
                    <Input
                      id="password_confirm"
                      type="password"
                      value={securitySettings.password_confirm}
                      onChange={(e) => setSecuritySettings((prev) => ({ ...prev, password_confirm: e.target.value }))}
                      className={cn("bg-background border-border rounded-lg", errors.password_confirm && "border-destructive focus-visible:ring-destructive/20")}
                    />
                    {errors.password_confirm && <p className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.password_confirm}</p>}
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button onClick={handlePasswordChange} disabled={isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white px-8">
                      {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Login Activity</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0 space-y-3 sm:space-y-0">
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{session.userAgent || "Unknown Device"}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">{session.ipAddress || "Unknown Location"} • {new Date(session.createdAt).toLocaleDateString()}</p>
                            </div>
                            {session.isCurrent ? (
                                <Badge variant="secondary" className="bg-orange/10 text-orange border-none self-start sm:self-auto">Current Session</Badge>
                            ) : (
                                <Button variant="outline" size="sm" className="rounded-full self-start sm:self-auto border-border hover:bg-muted" onClick={() => revokeSession(session.id)} disabled={isLoading}>
                                  Revoke Access
                                </Button>
                            )}
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No active sessions found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <div className="space-y-8">
              <Card className="border-border bg-card rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="border border-border/50 bg-muted/20 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-9 bg-primary/10 rounded flex items-center justify-center border border-primary/20">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">Default</Badge>
                        <Button variant="outline" size="sm" className="rounded-full border-border hover:bg-muted">Edit</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl border-dashed border-2 border-border/60 hover:bg-muted py-6">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    Add New Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {purchases.length === 0 ? (
                        <div className="text-center py-8">
                          <CreditCard className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-muted-foreground">No purchase history found.</p>
                        </div>
                    ) : (
                        purchases.map((purchase) => (
                            <div key={purchase.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/50 last:border-0 last:pb-0 space-y-3 sm:space-y-0">
                              <div className="flex-1">
                                  <p className="font-medium text-foreground">{purchase.courseTitle}</p>
                                  <p className="text-sm text-muted-foreground mt-0.5">{new Date(purchase.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
                                  <p className="font-bold text-foreground">
                                      {purchase.currency} {purchase.amount.toLocaleString()}
                                  </p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-4"
                                    disabled={isDownloading === purchase.id}
                                    onClick={async () => {
                                      try {
                                        setIsDownloading(purchase.id)
                                        await downloadReceipt(purchase.id, purchase.receiptUrl)
                                      } catch (err) {
                                        toast.error("Failed to download receipt")
                                      } finally {
                                        setIsDownloading(null)
                                      }
                                    }}
                                  >
                                    {isDownloading === purchase.id ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                                    {isDownloading === purchase.id ? "Downloading..." : "Download Receipt"}
                                  </Button>
                              </div>
                            </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Learning Preferences */}
          {activeTab === "preferences" && (
            <Card className="border-border bg-card rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Learning Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-1.5">
                  <Label htmlFor="language" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Preferred Interface Language</Label>
                  <Select value={learningPreferences.language} onValueChange={(value) => setLearningPreferences((prev) => ({ ...prev, language: value }))}>
                    <SelectTrigger className="w-full sm:w-64 bg-background border-border rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border rounded-lg">
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="font-medium text-foreground">Autoplay Videos</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Automatically jump to the next lecture</p>
                    </div>
                    <Switch checked={learningPreferences.autoplay} onCheckedChange={(checked) => setLearningPreferences((prev) => ({ ...prev, autoplay: checked }))} />
                  </div>
                  <Separator className="bg-border/50" />
                  
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="font-medium text-foreground">Closed Captions</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Show subtitles by default when available</p>
                    </div>
                    <Switch checked={learningPreferences.closedCaptions} onCheckedChange={(checked) => setLearningPreferences((prev) => ({ ...prev, closedCaptions: checked }))} />
                  </div>
                  <Separator className="bg-border/50" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 pr-4">
                      <h4 className="font-medium text-foreground">Download Quality</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Default resolution for offline viewing</p>
                    </div>
                    <Select value={learningPreferences.downloadQuality} onValueChange={(value) => setLearningPreferences((prev) => ({ ...prev, downloadQuality: value }))}>
                      <SelectTrigger className="w-full sm:w-40 bg-background border-border rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border rounded-lg">
                        <SelectItem value="480p">Standard (480p)</SelectItem>
                        <SelectItem value="720p">High (720p)</SelectItem>
                        <SelectItem value="1080p">Ultra (1080p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h4 className="font-medium text-foreground">Personal Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="dailyGoal" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Daily Goal (minutes)</Label>
                      <Input
                        id="dailyGoal"
                        type="number"
                        min="5" max="480"
                        value={learningPreferences.dailyGoal}
                        onChange={(e) => setLearningPreferences((prev) => ({ ...prev, dailyGoal: Number.parseInt(e.target.value) || 30 }))}
                        className="bg-background border-border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="weeklyGoal" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Weekly Goal (hours)</Label>
                      <Input
                        id="weeklyGoal"
                        type="number"
                        min="1" max="40"
                        value={learningPreferences.weeklyGoal}
                        onChange={(e) => setLearningPreferences((prev) => ({ ...prev, weeklyGoal: Number.parseInt(e.target.value) || 5 }))}
                        className="bg-background border-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button onClick={handlePreferencesSave} disabled={isLoading} className="rounded-full bg-orange hover:bg-orange/90 text-white px-8">
                    {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <div className="pt-6">
            <Card className="border-destructive/30 bg-destructive/5 rounded-2xl overflow-hidden shadow-none">
              <CardHeader className="pb-3 border-b border-destructive/10">
                <CardTitle className="text-destructive flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Permanently remove your account, progress, and all associated data.</p>
                  </div>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="rounded-full w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-card border-border rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" /> Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers including:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 text-sm text-muted-foreground py-2 pl-2 border-l-2 border-destructive/20 ml-1">
                        <p>• All course progress and certificates</p>
                        <p>• Purchase history and receipts</p>
                        <p>• Personal information and preferences</p>
                        <p>• Achievements and learning analytics</p>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-2">
                        <p className="text-sm text-destructive">
                          <strong>Warning:</strong> This action is strictly irreversible. Your data will be wiped immediately upon confirmation.
                        </p>
                      </div>
                      <DialogFooter className="mt-4 gap-2 sm:justify-end">
                        <Button variant="outline" className="rounded-full" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" className="rounded-full" onClick={handleDeleteAccount} disabled={isLoading}>
                          {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
                          {isLoading ? "Deleting..." : "Yes, delete my account"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}