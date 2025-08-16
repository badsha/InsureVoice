import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

// Default API request function
export const apiRequest = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const url = queryKey[0] as string
  const response = await axios.get(url)
  return response.data
}