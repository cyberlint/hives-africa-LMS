"use client"
import { useCallback } from 'react';
import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function OtpVerificationForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
const setInputRef = useCallback((index: number, el: HTMLInputElement | null) => {
  inputRefs.current[index] = el;
}, []);
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
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

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the OTP with your backend
    // For now, we'll just navigate to the reset password page
    router.push("/reset-password")
  }

  const handleResendCode = () => {
    // Here you would typically resend the OTP
    // For now, we'll just clear the current OTP
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="text-balance text-sm text-muted-foreground">
          We sent a 6-digit code to your email address. Enter it below to verify your identity.
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
                required
              />
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={otp.some((digit) => !digit)}>
          Verify code
        </Button>
        <div className="text-center text-sm">
          <p className="text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
          <button type="button" onClick={handleResendCode} className="underline underline-offset-4 hover:text-primary">
            Resend code
          </button>
        </div>
      </div>
      <div className="text-center text-sm">
        <a href="/forgot-password" className="underline underline-offset-4">
          Back to forgot password
        </a>
      </div>
    </form>
  )
}
