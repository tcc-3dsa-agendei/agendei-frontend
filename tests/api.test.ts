import assert from "node:assert/strict"
import { afterEach, describe, mock, test } from "node:test"

mock.module("../src/env.ts", { namedExports: { env: { VITE_BACKEND_URL: "http://localhost:3333/" } } })
const { ApiError, apiFetch, appointmentsApi, bookingLinkApi, publicBookingApi, schedulesApi, servicesApi } =
  await import("../src/lib/api.ts")
const originalFetch = globalThis.fetch
const calls: {
  url: string
  init?: RequestInit
}[] = []
function respond(responses: Response[]) {
  globalThis.fetch = mock.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init })
    const response = responses.shift()
    if (!response) throw new Error("Requisição inesperada")
    return response
  }) as unknown as typeof fetch
}
afterEach(() => {
  globalThis.fetch = originalFetch
  calls.length = 0
})
describe("contratos HTTP", () => {
  test("consulta o link com sessão e os dados públicos sem cookies", async () => {
    respond([
      Response.json({ url: "https://example.com/agendar/company" }),
      Response.json({
        company: { name: "Empresa", timeZone: "America/Sao_Paulo", schedules: [], services: [] }
      }),
      Response.json({ slots: [{ startAt: "2030-01-07T12:07:00.000Z", endAt: "2030-01-07T12:37:00.000Z" }] })
    ])
    assert.equal((await bookingLinkApi.get()).url, "https://example.com/agendar/company")
    assert.equal(calls[0].init?.credentials, "include")
    assert.equal((await publicBookingApi.company("company")).company.name, "Empresa")
    assert.equal(calls[1].init?.credentials, "omit")
    assert.equal(
      (await publicBookingApi.availability("company", "service", "2030-01-07")).slots[0].startAt,
      "2030-01-07T12:07:00.000Z"
    )
    assert.equal(new URL(calls[2].url).searchParams.get("serviceId"), "service")
    assert.equal(new URL(calls[2].url).searchParams.get("date"), "2030-01-07")
    assert.equal(calls[2].init?.credentials, "omit")
  })
  test("cria apenas pela rota pública com o instante original e corpo estrito", async () => {
    respond([Response.json({ appointment: { id: "reservation", status: "scheduled" } }, { status: 201 })])
    const input = {
      serviceId: "service",
      startAt: "2030-01-07T12:07:00.000Z",
      customerName: "Maria",
      customerEmail: "maria@example.com",
      customerPhone: "11987654321",
      notes: null
    }
    assert.equal((await publicBookingApi.create("company", input)).appointment.id, "reservation")
    assert.equal(calls[0].url, "http://localhost:3333/public/companies/company/appointments")
    assert.equal(calls[0].init?.credentials, "omit")
    assert.equal(calls[0].init?.method, "POST")
    assert.deepEqual(JSON.parse(String(calls[0].init?.body)), input)
  })
  test("edita e exclui reservas pela API administrativa", async () => {
    respond([Response.json({ appointment: { id: "reservation" } }), new Response(null, { status: 204 })])
    await appointmentsApi.update("reservation", { customerEmail: "novo@example.com" })
    assert.equal(calls[0].init?.method, "PUT")
    assert.equal(calls[0].init?.body, '{"customerEmail":"novo@example.com"}')
    assert.equal(await appointmentsApi.delete("reservation"), undefined)
    assert.equal(calls[1].init?.method, "DELETE")
  })
  test("envia cookies, JSON e apenas campos do contrato na criação", async () => {
    respond([Response.json({ schedule: { id: "server-id" } }, { status: 201 })])
    const body = { weekDay: 2, startTime: "09:00", endTime: "18:00" }
    assert.deepEqual(await schedulesApi.create(body), { schedule: { id: "server-id" } })
    assert.equal(calls[0].url, "http://localhost:3333/schedules")
    assert.equal(calls[0].init?.credentials, "include")
    assert.equal(new Headers(calls[0].init?.headers).get("Content-Type"), "application/json")
    assert.equal(calls[0].init?.body, JSON.stringify(body))
  })
  test("aceita exclusões 204 sem tentar decodificar JSON", async () => {
    respond([new Response(null, { status: 204 })])
    assert.equal(await servicesApi.delete("service-id"), undefined)
    assert.equal(calls[0].init?.method, "DELETE")
  })
  test("preserva null em PUT e usa PATCH para status", async () => {
    respond([Response.json({ service: {} }), Response.json({ appointment: {} })])
    await servicesApi.update("service-id", { price: null, description: null })
    await appointmentsApi.updateStatus("appointment-id", "confirmed")
    assert.equal(calls[0].init?.method, "PUT")
    assert.equal(calls[0].init?.body, '{"price":null,"description":null}')
    assert.ok(calls[1].url.endsWith("/appointments/appointment-id/status"))
    assert.equal(calls[1].init?.method, "PATCH")
    assert.equal(calls[1].init?.body, '{"status":"confirmed"}')
  })
  test("codifica offsets positivos e parâmetros opcionais", async () => {
    respond([Response.json({ appointments: [], pagination: { hasNext: false } })])
    await appointmentsApi.list({ from: "2026-10-06T00:00:00+03:00", page: 2, pageSize: 20 })
    assert.ok(calls[0].url.includes("%2B03%3A00"))
    assert.equal(new URL(calls[0].url).searchParams.has("to"), false)
  })
  test("percorre todas as páginas de reservas para disponibilidade e filtros", async () => {
    respond([
      Response.json({ appointments: [{ id: "first" }], pagination: { hasNext: true } }),
      Response.json({ appointments: [{ id: "second" }], pagination: { hasNext: false } })
    ])
    assert.deepEqual(await appointmentsApi.listAll({ from: "2026-10-06T00:00:00-03:00" }), [
      { id: "first" },
      { id: "second" }
    ])
    assert.equal(new URL(calls[1].url).searchParams.get("page"), "2")
    assert.equal(new URL(calls[1].url).searchParams.get("from"), "2026-10-06T00:00:00-03:00")
  })
  test("lista serviços além da primeira página", async () => {
    respond([
      Response.json({ services: [{ id: "a" }], pagination: { hasNext: true } }),
      Response.json({ services: [{ id: "b" }], pagination: { hasNext: false } })
    ])
    assert.equal((await servicesApi.listAll()).length, 2)
    assert.equal(new URL(calls[1].url).searchParams.get("page"), "2")
  })
  for (const status of [401, 404, 409, 422, 500]) {
    test(`preserva mensagem e status HTTP ${status}`, async () => {
      respond([Response.json({ message: "Mensagem da API" }, { status })])
      try {
        await apiFetch("/services")
        throw new Error("Deveria falhar")
      } catch (error) {
        assert.ok(error instanceof ApiError)
        assert.equal((error as InstanceType<typeof ApiError>).status, status)
        assert.equal((error as Error).message, "Mensagem da API")
      }
    })
  }
  test("traduz falha de rede e resposta de erro sem JSON", async () => {
    respond([new Response("Bad gateway", { status: 502 })])
    await assert.rejects(apiFetch("/services"), /Falha na requisição/)
    globalThis.fetch = mock.fn(async () => {
      throw new TypeError("Failed to fetch")
    }) as unknown as typeof fetch
    await assert.rejects(apiFetch("/services"), /Não foi possível conectar/)
  })
  test("propaga abort sem convertê-lo em erro de rede", async () => {
    const controller = new AbortController()
    controller.abort()
    globalThis.fetch = mock.fn(async () => {
      throw controller.signal.reason
    }) as unknown as typeof fetch
    await assert.rejects(apiFetch("/services", { signal: controller.signal }), /aborted/)
  })
})
