import assert from "node:assert/strict"
import { afterEach, mock, test } from "node:test"
import { getCompany } from "../src/lib/company.ts"

const originalFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = originalFetch
})
test("consulta CNPJ sem máscara e sem cookies da sessão", async () => {
  let receivedUrl = "",
    credentials: RequestCredentials | undefined
  globalThis.fetch = mock.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    receivedUrl = String(url)
    credentials = init?.credentials
    return Response.json({ razao_social: "Empresa de teste", cnae_principal: "6201501" })
  }) as unknown as typeof fetch
  const company = await getCompany("11.222.333/0001-81", new AbortController().signal)
  assert.equal(receivedUrl, "https://api.opencnpj.org/11222333000181")
  assert.equal(credentials, "omit")
  assert.equal(company.razao_social, "Empresa de teste")
  assert.equal(company.cnaes, undefined)
})
test("trata empresa inexistente e resposta malformada", async () => {
  globalThis.fetch = mock.fn(async () => new Response(null, { status: 404 })) as unknown as typeof fetch
  await assert.rejects(getCompany("11222333000181", new AbortController().signal), /não encontrados/)
  globalThis.fetch = mock.fn(async () => Response.json({ error: "unexpected" })) as unknown as typeof fetch
  await assert.rejects(getCompany("11222333000181", new AbortController().signal), /formato inesperado/)
})
