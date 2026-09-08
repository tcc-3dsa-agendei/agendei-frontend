import z from "zod"

const envSchema = z.object({
  VITE_BETTER_AUTH_CLIENT_URL: z.url()
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error(`Erro ao validar as variáveis de ambiente: ${z.formatError(parsed.error)}`)
  throw new Error("Variáveis de ambiente inválidas")
}

export const env = parsed.data
