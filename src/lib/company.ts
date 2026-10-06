import { z } from "zod"

const companySchema = z.object({
  razao_social: z.string(),
  nome_fantasia: z.string().nullish(),
  logradouro: z.string().nullish(),
  numero: z.string().nullish(),
  bairro: z.string().nullish(),
  cep: z.string().nullish(),
  municipio: z.string().nullish(),
  uf: z.string().nullish(),
  cnae_principal: z.string().nullish(),
  cnaes: z.array(z.object({ descricao: z.string(), is_principal: z.boolean().optional() })).optional()
})
export async function getCompany(cnpj: string, signal: AbortSignal) {
  const normalized = cnpj.replace(/\D/g, "")
  if (!/^\d{14}$/.test(normalized)) throw new Error("O CNPJ cadastrado é inválido para consulta.")
  try {
    const response = await fetch(`https://api.opencnpj.org/${normalized}`, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
      credentials: "omit"
    })
    if (!response.ok)
      throw new Error(
        response.status === 404
          ? "Dados cadastrais não encontrados para este CNPJ."
          : "A consulta de dados cadastrais está temporariamente indisponível."
      )
    const result = companySchema.safeParse(await response.json())
    if (!result.success) throw new Error("A consulta retornou dados da empresa em formato inesperado.")
    return result.data
  } catch (error) {
    if (signal.aborted) throw error
    if (error instanceof TypeError || (error instanceof DOMException && error.name === "TimeoutError")) {
      throw new Error("Não foi possível consultar os dados cadastrais da empresa.")
    }
    throw error
  }
}
