"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { data: session, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error("Login Failed", {
          description: error.message || "Invalid credentials",
        })
        return
      }

      toast.success("Welcome back!", {
        description: "Successfully logged in",
      })

      if ((session?.user as any)?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/signin",
      })
    } catch (error: any) {
      toast.error("Sign in failed", {
        description: error.message || "Could not sign in with Google",
      })
    }
  }

  const handleGithubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/signin",
      })
    } catch (error: any) {
      toast.error("Sign in failed", {
        description: error.message || "Could not sign in with GitHub",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="chidera@example.com"
            disabled={isLoading}
            className={cn(
              "h-11 rounded-lg border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-[#FDB606] focus-visible:border-[#FDB606] transition-all duration-200",
              errors.email && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
            )}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              disabled={isLoading}
              className={cn(
                "h-11 rounded-lg border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-[#FDB606] focus-visible:border-[#FDB606] transition-all duration-200",
                errors.password && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500")}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#FDB606] hover:bg-[#fd9a06] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login now"}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {/* Google */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="group relative w-full h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md
               hover:bg-white/10 transition-all duration-200
               flex items-center justify-center gap-3"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.73 1.22 9.24 3.61l6.9-6.9C35.91 2.36 30.4 0 24 0 14.64 0 6.48 5.4 2.44 13.28l8.05 6.25C12.5 13.12 17.76 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.5c0-1.63-.15-3.2-.42-4.7H24v9h12.4c-.54 2.9-2.17 5.36-4.63 7.03l7.16 5.57C43.9 36.9 46.1 31.2 46.1 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.49 28.53A14.5 14.5 0 019.5 24c0-1.58.27-3.1.75-4.53l-8.05-6.25A23.98 23.98 0 000 24c0 3.88.93 7.53 2.56 10.78l7.93-6.25z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.91-2.13 15.88-5.8l-7.16-5.57c-2 1.34-4.56 2.13-8.72 2.13-6.24 0-11.5-3.62-13.51-8.78l-7.93 6.25C6.48 42.6 14.64 48 24 48z"
              />
            </svg>

            <span className="text-sm font-medium tracking-tight">
              Google
            </span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGithubSignIn}
            className="group relative w-full h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md
               hover:bg-white/10 transition-all duration-200
               flex items-center justify-center gap-3"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.02c-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.17-3.07-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.17a10.93 10.93 0 015.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.77.11 3.06.73.8 1.17 1.82 1.17 3.07 0 4.41-2.69 5.37-5.25 5.65.41.35.77 1.04.77 2.1v3.11c0 .3.2.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>

            <span className="text-sm font-medium tracking-tight">
              GitHub
            </span>
          </button>
        </div>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sign up
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
