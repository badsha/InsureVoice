import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'policyholder' | 'insurance_company' | 'idra_admin' | 'super_admin'
  isActive: boolean
  profile?: {
    phone?: string
    address?: string
    nidNumber?: string
    department?: string
    designation?: string
    companyId?: string
  }
  company?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    licenseNumber?: string
  }
}

export function useAuth() {
  const token = localStorage.getItem('authToken')
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User | null> => {
      if (!token) return null
      
      // For demo purposes, we'll decode the token to get user ID
      const userId = token.replace('demo_token_', '')
      const response = await axios.get(`/api/users/${userId}`)
      return response.data
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!token,
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token && !error,
    error,
  }
}

export async function login(email: string, password: string) {
  const response = await axios.post('/api/auth/login', 
    { email, password }
  )
  
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }
  
  return response.data
}

export async function logout() {
  localStorage.removeItem('authToken')
  // Force a page reload to clear all state
  window.location.href = '/'
}

export async function demoLogin(userEmail: string) {
  const response = await axios.post('/api/auth/login', 
    { email: userEmail, password: 'demo123' }
  )
  
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }
  
  return response.data
}