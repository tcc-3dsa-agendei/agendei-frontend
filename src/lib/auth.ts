import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const auth = createAuthClient({
  baseURL: env.VITE_BACKEND_URL,
  fetchOptions: { credentials: "include" },
  plugins: [
    inferAdditionalFields({
      user: {
        cnpj: {
          type: "string"
        }
      }
    })
  ]
})
