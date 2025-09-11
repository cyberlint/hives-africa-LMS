
import { LoginFormData, SignupFormData } from '@/lib/validations'
import { User } from '@/contexts/AuthContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Response types
interface AuthResponse {
  access: string
  refresh: string
  user: User
}

interface SignupResponse extends AuthResponse {}

// Signup function
export const signupUser = async (data: SignupFormData): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        user_type: data.user_type || 'student',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw {
        response: {
          data: errorData
        }
      }
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

// Signin function
export const signinUser = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      
      // Format error for consistent handling
      const formattedError = {
        message: errorData.detail || errorData.non_field_errors?.[0] || 'Login failed',
        field_errors: errorData.field_errors || {},
        status: response.status
      }
      
      throw formattedError
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Signin error:', error)
    throw error
  }
}

// Google Sign In function (placeholder for future implementation)
export const googleSignIn = async (): Promise<AuthResponse> => {
  // This would integrate with Google OAuth
  throw new Error('Google Sign In not implemented yet')
}

// Password reset function (placeholder for future implementation)
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Password reset failed')
    }
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}
