import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const auth = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_CLIENT_URL
})
