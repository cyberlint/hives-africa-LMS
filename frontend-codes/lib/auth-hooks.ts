"use client"

import { useEffect, useState } from "react"
import { authClient } from "./auth-client"

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    ipAddress?: string
    userAgent?: string
  }
  user: User
}

/**
 * Hook to get the current session
 * Returns the session data or null if not authenticated
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession()
        setSession(data as Session | null)
      } catch (error) {
        console.error("Failed to fetch session:", error)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { session, isLoading, user: session?.user }
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { session, isLoading, user } = useSession()
  
  return {
    isAuthenticated: !!session,
    isLoading,
    user,
    session,
  }
}

/**
 * Hook for sign out functionality
 */
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false)

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authClient.signOut()
      window.location.href = "/signin"
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { signOut, isLoading }
}
