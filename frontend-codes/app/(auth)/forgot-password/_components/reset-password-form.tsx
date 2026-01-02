"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    console.log("Attempting to send reset password email for:", data.email);
    try {
      const { data: responseData, error } = await (authClient as any).requestPasswordReset({
          email: data.email,
          redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Error sending reset password email:", error);
        toast.error("Failed to send reset email", {
          description: error.message || "Could not send password reset email",
        })
        return
      }

      console.log("Reset password email sent successfully:", responseData);
      toast.success("Reset email sent!", {
        description: "Check your email for password reset instructions",
      })

      // Redirect to a confirmation page or back to login
      // router.push(`/signin?reset=sent&email=${encodeURIComponent(data.email)}`)
    } catch (error: any) {
       console.error("Unexpected error in forgot password flow:", error);
      toast.error("Failed to send reset email", {
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)} 
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="divine@hive.com"
            disabled={isLoading}
            className={cn(errors.email && "border-red-500")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#FDB606] hover:bg-[#fd9a06] text-white" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset instructions"}
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
