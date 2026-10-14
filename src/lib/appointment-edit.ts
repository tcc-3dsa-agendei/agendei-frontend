import { businessDate, formatTime, toBusinessISO } from "@/lib/date-utils"
import type { AppointmentWithService, UpdateAppointmentInput } from "@/types/api"

export interface AppointmentEditValues {
  name: string
  email: string
  phone: string
  notes: string
  serviceId: string
  date: string
  time: string
}

export function appointmentChanges(appointment: AppointmentWithService, values: AppointmentEditValues) {
  const body: UpdateAppointmentInput = {}
  if (values.name.trim() !== appointment.customerName) body.customerName = values.name.trim()
  if (values.email.trim() !== (appointment.customerEmail ?? "")) body.customerEmail = values.email.trim()
  if (values.phone !== appointment.customerPhone) body.customerPhone = values.phone
  if (values.notes.trim() !== (appointment.notes ?? "")) body.notes = values.notes.trim() || null
  if (appointment.status === "scheduled" || appointment.status === "confirmed") {
    if (values.serviceId !== appointment.serviceId) body.serviceId = values.serviceId
    if (
      values.date !== businessDate(new Date(appointment.startAt)) ||
      values.time !== formatTime(appointment.startAt)
    ) {
      body.startAt = toBusinessISO(values.date, values.time)
    }
  }
  return body
}
