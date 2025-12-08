"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordConfirmForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) {
      toast.error("Invalid reset link", {
        description: "Please request a new password reset",
      })
      router.push("/forgot-password")
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: data.password,
          token,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error("Password reset failed", {
          description: error.message || "Could not reset password",
        })
        return
      }

      toast.success("Password reset successful!", {
        description: "You can now login with your new password",
      })

      router.push("/signin")
    } catch (error: any) {
      toast.error("Password reset failed", {
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "weak", color: "text-red-500" }
    if (password.length < 8) return { strength: "fair", color: "text-yellow-500" }
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return { strength: "strong", color: "text-green-500" }
    }
    return { strength: "good", color: "text-blue-500" }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)} 
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your new password below. Make sure it&apos;s strong and secure.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              disabled={isLoading}
              className={cn("pr-10", errors.password && "border-red-500")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              disabled={isLoading}
              className={cn("pr-10", errors.confirmPassword && "border-red-500")}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#FDB606] hover:bg-[#fd9a06] text-white" 
          disabled={isLoading}
        >
          {isLoading ? "Resetting password..." : "Reset password"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/signin" className="underline underline-offset-4">
          Back to login
        </Link>
      </div>
    </form>
  )
}
