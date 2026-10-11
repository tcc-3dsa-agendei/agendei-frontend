import assert from "node:assert/strict"
import { test } from "node:test"
import { appointmentChanges } from "../src/lib/appointment-edit.ts"
import type { AppointmentWithService } from "../src/types/api.ts"

const appointment: AppointmentWithService = {
  id: "reservation",
  userId: "company",
  serviceId: "service",
  customerName: "Maria",
  customerEmail: null,
  customerPhone: "11987654321",
  notes: null,
  startAt: "2030-01-07T13:00:00.000Z",
  endAt: "2030-01-07T13:30:00.000Z",
  status: "scheduled",
  createdAt: "2030-01-01T00:00:00.000Z",
  updatedAt: "2030-01-01T00:00:00.000Z",
  service: { id: "service", name: "Consulta", description: null, durationInMinutes: 30, price: 0 }
}
const values = {
  name: "Maria",
  email: "",
  phone: "11987654321",
  notes: "",
  serviceId: "service",
  date: "2030-01-07",
  time: "10:00"
}
test("edição sem alterações não envia campos antigos", () => {
  assert.deepEqual(appointmentChanges(appointment, values), {})
  assert.deepEqual(appointmentChanges(appointment, { ...values, name: "Maria Silva" }), {
    customerName: "Maria Silva"
  })
})
test("e-mail ausente fica omitido; novo e-mail e remoção de observações são explícitos", () => {
  assert.deepEqual(appointmentChanges(appointment, { ...values, email: "novo@example.com" }), {
    customerEmail: "novo@example.com"
  })
  assert.deepEqual(appointmentChanges({ ...appointment, notes: "Antes" }, values), { notes: null })
})
test("reagendamento administrativo conserva precisão de minutos", () => {
  assert.deepEqual(appointmentChanges(appointment, { ...values, time: "10:07" }), {
    startAt: "2030-01-07T10:07:00-03:00"
  })
  assert.deepEqual(
    appointmentChanges({ ...appointment, status: "completed" }, { ...values, time: "10:07" }),
    {}
  )
})
