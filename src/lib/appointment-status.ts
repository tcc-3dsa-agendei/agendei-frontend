import type { Appointment, AppointmentStatus } from "@/types/api"
export const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Não compareceu"
}
const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ["confirmed", "cancelled", "no_show"],
  confirmed: ["completed", "cancelled", "no_show"],
  completed: [],
  cancelled: [],
  no_show: []
}
export function allowedStatuses(
  appointment: Pick<Appointment, "status" | "startAt" | "endAt">,
  now = Date.now()
) {
  return transitions[appointment.status].filter(
    (status) =>
      (status !== "completed" || Date.parse(appointment.endAt) <= now) &&
      (status !== "no_show" || Date.parse(appointment.startAt) <= now)
  )
}
