import assert from "node:assert/strict"
import { describe, test } from "node:test"
import { allowedStatuses } from "../src/lib/appointment-status.ts"
import {
  addDays,
  availableSlots,
  businessDate,
  dayRange,
  formatTime,
  toBusinessISO
} from "../src/lib/date-utils.ts"

const date = "2026-10-06"
const schedule = { weekDay: 2, startTime: "09:00", endTime: "11:00" }
const now = Date.parse("2026-10-06T08:00:00-03:00")
describe("datas e disponibilidade", () => {
  test("converte horário de São Paulo com precisão de minutos", () => {
    assert.equal(toBusinessISO(date, "14:30"), "2026-10-06T14:30:00-03:00")
    assert.equal(formatTime("2026-10-06T17:30:00Z"), "14:30")
    assert.equal(businessDate(new Date("2026-10-06T01:00:00Z")), "2026-10-05")
  })
  test("limite final é exclusivo, inclusive em viradas de mês/ano", () => {
    assert.deepEqual(dayRange("2026-12-31"), {
      from: "2026-12-31T00:00:00-03:00",
      to: "2027-01-01T00:00:00-03:00"
    })
    assert.equal(addDays("2028-02-28", 1), "2028-02-29")
    assert.equal(addDays("2028-02-29", 1), "2028-03-01")
  })
  test("duração cabe no expediente e permite terminar no fechamento", () => {
    assert.deepEqual(availableSlots(date, schedule, 40, [], now), ["09:00", "09:40", "10:20"])
    assert.deepEqual(availableSlots(date, schedule, 121, [], now), [])
  })
  test("não oferece dias sem expediente ou durações inválidas", () => {
    assert.deepEqual(availableSlots(date, undefined, 30, [], now), [])
    assert.deepEqual(availableSlots("2026-10-07", schedule, 30, [], now), [])
    assert.deepEqual(availableSlots(date, schedule, 0, [], now), [])
  })
  test("remove intervalos sobrepostos, mantendo adjacentes", () => {
    const reservation = {
      startAt: toBusinessISO(date, "09:30"),
      endAt: toBusinessISO(date, "10:00"),
      status: "confirmed" as const
    }
    assert.deepEqual(availableSlots(date, schedule, 30, [reservation], now), ["09:00", "10:00", "10:30"])
    assert.deepEqual(availableSlots(date, schedule, 60, [reservation], now), ["10:00"])
  })
  test("apenas cancelamentos liberam o intervalo no contrato atual", () => {
    const reservation = {
      startAt: toBusinessISO(date, "09:00"),
      endAt: toBusinessISO(date, "10:00"),
      status: "cancelled" as const
    }
    assert.deepEqual(availableSlots(date, schedule, 60, [reservation], now), ["09:00", "10:00"])
    assert.deepEqual(availableSlots(date, schedule, 60, [{ ...reservation, status: "no_show" }], now), [
      "10:00"
    ])
  })
  test("nunca oferece início passado ou igual ao instante atual", () => {
    assert.deepEqual(availableSlots(date, schedule, 30, [], Date.parse(toBusinessISO(date, "09:30"))), [
      "10:00",
      "10:30"
    ])
  })
  test("aplica as transições e restrições temporais de status", () => {
    const appointment = {
      status: "scheduled" as const,
      startAt: toBusinessISO(date, "09:00"),
      endAt: toBusinessISO(date, "10:00")
    }
    assert.deepEqual(allowedStatuses(appointment, now), ["confirmed", "cancelled"])
    assert.deepEqual(allowedStatuses({ ...appointment, status: "confirmed" }, now), ["cancelled"])
    assert.deepEqual(
      allowedStatuses({ ...appointment, status: "confirmed" }, Date.parse(appointment.endAt)),
      ["completed", "cancelled", "no_show"]
    )
    for (const status of ["completed", "cancelled", "no_show"] as const)
      assert.deepEqual(allowedStatuses({ ...appointment, status }, now), [])
  })
})
