"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function OtpVerificationForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (!email) {
      toast.error("Email not found", {
        description: "Please sign up again",
      })
      router.push("/signup")
    }
  }, [email, router])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const setInputRef = useCallback((index: number, el: HTMLInputElement | null) => {
    inputRefs.current[index] = el
  }, [])

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Email not found")
      return
    }

    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: otpCode,
      })

      if (error) {
        toast.error("Verification failed", {
          description: error.message || "Invalid or expired code",
        })
        return
      }

      toast.success("Email verified!", {
        description: "Your account has been verified successfully",
      })
      
      router.push("/signin")
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found")
      return
    }

    setIsResending(true)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      })

      if (error) {
        toast.error("Failed to resend code", {
          description: error.message,
        })
        return
      }

      toast.success("Code resent!", {
        description: "Check your email for the new verification code",
      })
      
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error: any) {
      toast.error("Failed to resend code", {
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="text-balance text-sm text-muted-foreground">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your email.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => setInputRef(index, el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isLoading}
                required
              />
            ))}
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#FDB606] hover:bg-[#fd9a06] text-white" 
          disabled={otp.some((digit) => !digit) || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify code"}
        </Button>
        <div className="text-center text-sm">
          <p className="text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
          <button 
            type="button" 
            onClick={handleResendCode} 
            className="underline underline-offset-4 hover:text-primary"
            disabled={isResending || isLoading}
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        </div>
      </div>
      <div className="text-center text-sm">
        <Link href="/signup" className="underline underline-offset-4">
          Back to sign up
        </Link>
      </div>
    </form>
  )
}
