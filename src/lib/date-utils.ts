import type { Appointment, Schedule } from "@/types/api"

export const TIME_ZONE = "America/Sao_Paulo"
export const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
]
const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
})
const dateParts = (date: Date) =>
  Object.fromEntries(
    partsFormatter
      .formatToParts(date)
      .map(({ type, value }) => [type, type === "year" ? value.padStart(4, "0") : value])
  )
export function businessDate(date = new Date()) {
  const p = dateParts(date)
  return `${p.year}-${p.month}-${p.day}`
}
export function addDays(date: string, days: number) {
  const result = new Date(`${date}T12:00:00Z`)
  result.setUTCDate(result.getUTCDate() + days)
  return result.toISOString().slice(0, 10)
}
export const weekDayForDate = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay()
// Resolve the IANA zone rather than relying on the browser's local zone or a fixed offset.
export function toBusinessISO(date: string, time = "00:00") {
  const wallTime = Date.parse(`${date}T${time}:00Z`)
  if (!Number.isFinite(wallTime)) throw new Error("Data ou horário inválido.")
  let instant = wallTime
  for (let attempt = 0; attempt < 3; attempt++) {
    const p = dateParts(new Date(instant))
    const represented = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`)
    instant += wallTime - represented
  }
  const p = dateParts(new Date(instant))
  if (`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}` !== `${date}T${time}`) {
    throw new Error("Horário inexistente no fuso de São Paulo.")
  }
  const offset = (wallTime - instant) / 60000
  const absolute = Math.abs(offset)
  return `${date}T${time}:00${offset >= 0 ? "+" : "-"}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`
}
export const dayRange = (date: string) => ({ from: toBusinessISO(date), to: toBusinessISO(addDays(date, 1)) })
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, dateStyle: "short" }).format(new Date(value))
export const formatTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, timeStyle: "short" }).format(new Date(value))
export const formatPrice = (price: number | null) =>
  price === null
    ? "Preço não informado"
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
export function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}
export function availableSlots(
  date: string,
  schedule: Pick<Schedule, "weekDay" | "startTime" | "endTime"> | undefined,
  duration: number,
  appointments: Pick<Appointment, "startAt" | "endAt" | "status">[],
  now = Date.now()
) {
  if (
    !schedule ||
    schedule.weekDay !== weekDayForDate(date) ||
    !Number.isInteger(duration) ||
    duration < 5 ||
    duration > 1440
  )
    return []
  const slots: string[] = []
  const closing = parseTimeToMinutes(schedule.endTime)
  for (
    let minute = parseTimeToMinutes(schedule.startTime);
    minute + duration <= closing;
    minute += duration
  ) {
    const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`
    const start = Date.parse(toBusinessISO(date, time))
    const end = start + duration * 60000
    if (start <= now) continue
    // The backend reserves the interval of every non-cancelled appointment.
    if (
      appointments.some(
        (a) => a.status !== "cancelled" && Date.parse(a.startAt) < end && Date.parse(a.endAt) > start
      )
    )
      continue
    slots.push(time)
  }
  return slots
}
