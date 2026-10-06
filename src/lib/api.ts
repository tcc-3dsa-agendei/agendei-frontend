import { env } from "@/env"
import type {
  Appointment,
  AppointmentQuery,
  AppointmentStatus,
  AppointmentWithService,
  CreateAppointmentInput,
  CreateScheduleInput,
  CreateServiceInput,
  PageQuery,
  PaginatedAppointmentsResponse,
  PaginatedServicesResponse,
  Schedule,
  Service,
  UpdateAppointmentInput,
  UpdateScheduleInput,
  UpdateServiceInput
} from "@/types/api"

export const SESSION_EXPIRED_EVENT = "agendei:session-expired"
export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}
const errorMessages: Record<number, string> = {
  401: "Sua sessão expirou. Entre novamente.",
  404: "Registro não encontrado.",
  409: "Esta operação conflita com um registro existente.",
  422: "Verifique os dados informados.",
  500: "Não foi possível concluir a operação. Tente novamente."
}
export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Não foi possível concluir a operação."

type ApiInit = Omit<RequestInit, "body"> & { body?: unknown }
export async function apiFetch<T>(path: string, { body, ...init }: ApiInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (body !== undefined) headers.set("Content-Type", "application/json")
  let response: Response
  try {
    response = await fetch(`${env.VITE_BACKEND_URL.replace(/\/$/, "")}${path}`, {
      ...init,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body)
    })
  } catch (error) {
    if (init.signal?.aborted) throw error
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.")
  }
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    throw new ApiError(
      response.status,
      typeof result?.message === "string"
        ? result.message
        : (errorMessages[response.status] ?? "Falha na requisição.")
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
function queryString(query: PageQuery | AppointmentQuery = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value))
  }
  return params.size ? `?${params}` : ""
}
export const schedulesApi = {
  list: (signal?: AbortSignal) => apiFetch<{ schedules: Schedule[] }>("/schedules", { signal }),
  get: (id: string) => apiFetch<{ schedule: Schedule }>(`/schedules/${id}`),
  create: (body: CreateScheduleInput) =>
    apiFetch<{ schedule: Schedule }>("/schedules", { method: "POST", body }),
  update: (id: string, body: UpdateScheduleInput) =>
    apiFetch<{ schedule: Schedule }>(`/schedules/${id}`, { method: "PUT", body }),
  delete: (id: string) => apiFetch<void>(`/schedules/${id}`, { method: "DELETE" })
}
export const servicesApi = {
  list: (query: PageQuery = {}, signal?: AbortSignal) =>
    apiFetch<PaginatedServicesResponse>(`/services${queryString(query)}`, { signal }),
  get: (id: string) => apiFetch<{ service: Service }>(`/services/${id}`),
  create: (body: CreateServiceInput) => apiFetch<{ service: Service }>("/services", { method: "POST", body }),
  update: (id: string, body: UpdateServiceInput) =>
    apiFetch<{ service: Service }>(`/services/${id}`, { method: "PUT", body }),
  delete: (id: string) => apiFetch<void>(`/services/${id}`, { method: "DELETE" }),
  async listAll(signal?: AbortSignal): Promise<Service[]> {
    const items: Service[] = []
    for (let page = 1; ; page++) {
      const result = await servicesApi.list({ page, pageSize: 100 }, signal)
      items.push(...result.services)
      if (!result.pagination.hasNext) return items
    }
  }
}
export const appointmentsApi = {
  list: (query: AppointmentQuery = {}, signal?: AbortSignal) =>
    apiFetch<PaginatedAppointmentsResponse>(`/appointments${queryString(query)}`, { signal }),
  create: (body: CreateAppointmentInput) =>
    apiFetch<{ appointment: Appointment }>("/appointments", { method: "POST", body }),
  update: (id: string, body: UpdateAppointmentInput) =>
    apiFetch<{ appointment: Appointment }>(`/appointments/${id}`, { method: "PUT", body }),
  updateStatus: (id: string, status: AppointmentStatus) =>
    apiFetch<{ appointment: Appointment }>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: { status }
    }),
  delete: (id: string) => apiFetch<void>(`/appointments/${id}`, { method: "DELETE" }),
  async listAll(
    query: Omit<AppointmentQuery, "page" | "pageSize"> = {},
    signal?: AbortSignal
  ): Promise<AppointmentWithService[]> {
    const items: AppointmentWithService[] = []
    for (let page = 1; ; page++) {
      const result = await appointmentsApi.list({ ...query, page, pageSize: 100 }, signal)
      items.push(...result.appointments)
      if (!result.pagination.hasNext) return items
    }
  }
}
