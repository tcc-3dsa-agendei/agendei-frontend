export interface Schedule {
  id: string
  userId: string
  weekDay: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}
export type CreateScheduleInput = Pick<Schedule, "weekDay" | "startTime" | "endTime">
export type UpdateScheduleInput = Partial<CreateScheduleInput>

export interface Service {
  id: string
  userId: string
  name: string
  description: string | null
  durationInMinutes: number
  price: number | null
  createdAt: string
  updatedAt: string
}
export type CreateServiceInput = Pick<Service, "name" | "durationInMinutes"> & {
  description?: string | null
  price?: number | null
}
export type UpdateServiceInput = Partial<CreateServiceInput>
export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
export interface Appointment {
  id: string
  userId: string
  serviceId: string
  customerName: string
  customerPhone: string
  startAt: string
  endAt: string
  status: AppointmentStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}
export interface AppointmentWithService extends Appointment {
  service: Pick<Service, "id" | "name" | "description" | "durationInMinutes" | "price">
}
export type CreateAppointmentInput = Pick<
  Appointment,
  "serviceId" | "customerName" | "customerPhone" | "startAt"
> & {
  notes?: string | null
}
export type UpdateAppointmentInput = Partial<CreateAppointmentInput>
export interface Pagination {
  page: number
  pageSize: number
  hasNext: boolean
}
export interface PageQuery {
  page?: number
  pageSize?: number
}
export interface AppointmentQuery extends PageQuery {
  from?: string
  to?: string
}
export interface PaginatedServicesResponse {
  services: Service[]
  pagination: Pagination
}
export interface PaginatedAppointmentsResponse {
  appointments: AppointmentWithService[]
  pagination: Pagination
}
export interface ApiErrorResponse {
  message: string
}
