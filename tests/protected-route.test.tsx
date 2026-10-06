import assert from "node:assert/strict"
import { mock, test } from "node:test"
import { renderToString } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router-dom"

let session: {
  data: {
    user: {
      id: string
    }
  } | null
  isPending: boolean
  error: Error | null
} = {
  data: null,
  isPending: true,
  error: null
}
mock.module("../src/lib/auth.ts", {
  namedExports: {
    auth: { useSession: () => ({ ...session, refetch: () => Promise.resolve() }) }
  }
})
mock.module("../src/lib/api.ts", { namedExports: { SESSION_EXPIRED_EVENT: "agendei:session-expired" } })
const { ProtectedRoute } = await import("../src/components/ProtectedRoute.tsx")
let privateRenders = 0
function PrivatePage() {
  privateRenders++
  return <p>Conteúdo privado</p>
}
function render() {
  privateRenders = 0
  return renderToString(
    <MemoryRouter initialEntries={["/agenda"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/agenda" element={<PrivatePage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}
test("não monta a página privada enquanto verifica sessão", () => {
  session = { data: null, isPending: true, error: null }
  assert.ok(render().includes("Carregando sessão"))
  assert.equal(privateRenders, 0)
})
test("não monta a página privada sem autenticação", () => {
  session = { data: null, isPending: false, error: null }
  assert.ok(!render().includes("Conteúdo privado"))
  assert.equal(privateRenders, 0)
})
test("oferece nova tentativa quando a sessão falha", () => {
  session = { data: null, isPending: false, error: new Error("Network error") }
  assert.ok(render().includes("Tentar novamente"))
  assert.equal(privateRenders, 0)
})
test("monta a página após autenticação", () => {
  session = { data: { user: { id: "user-id" } }, isPending: false, error: null }
  assert.ok(render().includes("Conteúdo privado"))
  assert.equal(privateRenders, 1)
})
