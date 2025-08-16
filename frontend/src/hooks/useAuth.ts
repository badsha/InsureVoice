import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  profile_image_url: string
  profile: {
    role: 'policyholder' | 'insurance_company' | 'idra_admin' | 'super_admin'
    company?: any
    national_id?: string
    address?: string
    designation?: string
    employee_id?: string
  }
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User> => {
      const response = await axios.get('/api/auth/user/', {
        withCredentials: true,
      })
      return response.data
    },
    retry: false,
    refetchOnWindowFocus: false,
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  }
}

export async function login(email: string, password: string) {
  const response = await axios.post('/api/auth/login/', 
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export async function logout() {
  const response = await axios.post('/api/auth/logout/', {}, {
    withCredentials: true,
  })
  return response.data
}

export async function demoLogin(userEmail: string) {
  // Find demo user by email and login
  const users = [
    { email: 'alice@example.com', role: 'Policyholder' },
    { email: 'bob@dhakainsurance.com', role: 'Insurance Company' },
    { email: 'carol@bginsurance.com', role: 'Insurance Company' },
    { email: 'david@idra.gov.bd', role: 'IDRA Administrator' },
    { email: 'emma@example.com', role: 'Policyholder' },
  ]
  
  const response = await axios.post('/api/auth/login/', 
    { email: userEmail, password: 'demo123' },
    { withCredentials: true }
  )
  return response.data
}