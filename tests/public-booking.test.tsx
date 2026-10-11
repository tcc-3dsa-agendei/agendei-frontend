import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { registerHooks } from "node:module"
import { mock, test } from "node:test"
import { renderToString } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router-dom"

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const source = new URL(`../src/${specifier.slice(2)}`, import.meta.url)
      const target = [source, new URL(`${source.href}.ts`), new URL(`${source.href}.tsx`)].find(existsSync)
      if (target) return nextResolve(target.href, context)
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".css"))
      return {
        format: "module",
        shortCircuit: true,
        source: "export default new Proxy({}, {get: (_, key) => key})"
      }
    return nextLoad(url, context)
  }
})

let calls = 0
let companyResult: { data?: unknown; error?: string; status?: number } = {}
let slotsResult: { data?: unknown; error?: string } = {}
mock.module("../src/hooks/use-api-data.ts", {
  namedExports: {
    useApiData: () => ({ ...(++calls === 1 ? companyResult : slotsResult), loading: false, reload() {} })
  }
})
const { PublicBooking } = await import("../src/pages/PublicBooking.tsx")
function render() {
  calls = 0
  return renderToString(
    <MemoryRouter initialEntries={["/agendar/company"]}>
      <Routes>
        <Route path="/agendar/:companyId" element={<PublicBooking />} />
      </Routes>
    </MemoryRouter>
  )
}
test("a página pública abre sem sessão e mostra serviço de preço zero", () => {
  companyResult = {
    data: {
      company: {
        name: "Empresa Teste",
        timeZone: "America/Sao_Paulo",
        schedules: [{ weekDay: 1, startTime: "09:07", endTime: "18:00" }],
        services: [{ id: "service", name: "Consulta", description: null, durationInMinutes: 30, price: 0 }]
      }
    }
  }
  slotsResult = { data: { slots: [] } }
  const html = render()
  assert.match(html, /Empresa Teste/)
  assert.match(html, /Consulta/)
  assert.match(html, /0,00/)
  assert.match(html, /E-mail/)
  assert.doesNotMatch(html, /Carregando sessão/)
})
test("empresa sem configuração impede seleção impossível", () => {
  companyResult = {
    data: { company: { name: "Sem horários", timeZone: "UTC", schedules: [], services: [] } }
  }
  assert.match(render(), /Agendamento indisponível no momento/)
  assert.doesNotMatch(render(), /Confirmar agendamento/)
})
test("link inexistente informa o erro e oferece nova tentativa", () => {
  companyResult = { status: 404, error: "Registro não encontrado" }
  assert.match(render(), /Empresa não encontrada/)
  assert.match(render(), /Tentar novamente/)
})
