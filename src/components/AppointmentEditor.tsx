import { isValidPhone } from "@brazilian-utils/brazilian-utils"
import { type FormEvent, useState } from "react"
import { z } from "zod"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { appointmentsApi, errorMessage, servicesApi } from "@/lib/api"
import { appointmentChanges } from "@/lib/appointment-edit"
import { businessDate, formatTime } from "@/lib/date-utils"
import styles from "@/pages/Management.module.css"
import type { AppointmentWithService } from "@/types/api"

const loadServices = (signal: AbortSignal) => servicesApi.listAll(signal)
export function AppointmentEditor({
  appointment,
  onSaved,
  onCancel
}: {
  appointment: AppointmentWithService
  onSaved: () => void
  onCancel: () => void
}) {
  const services = useApiData(loadServices)
  const [name, setName] = useState(appointment.customerName)
  const [email, setEmail] = useState(appointment.customerEmail ?? "")
  const [phone, setPhone] = useState(appointment.customerPhone)
  const [notes, setNotes] = useState(appointment.notes ?? "")
  const [serviceId, setServiceId] = useState(appointment.serviceId)
  const [date, setDate] = useState(businessDate(new Date(appointment.startAt)))
  const [time, setTime] = useState(formatTime(appointment.startAt))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const canReschedule = appointment.status === "scheduled" || appointment.status === "confirmed"
  const changed =
    name.trim() !== appointment.customerName ||
    email.trim() !== (appointment.customerEmail ?? "") ||
    phone !== appointment.customerPhone ||
    notes.trim() !== (appointment.notes ?? "") ||
    (canReschedule &&
      (serviceId !== appointment.serviceId ||
        date !== businessDate(new Date(appointment.startAt)) ||
        time !== formatTime(appointment.startAt)))

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !changed) return
    const cleanName = name.trim(),
      cleanEmail = email.trim(),
      cleanNotes = notes.trim()
    if (!cleanName) {
      setError("Informe o nome do cliente.")
      return
    }
    if (cleanEmail !== (appointment.customerEmail ?? "")) {
      if (!z.email().max(254).safeParse(cleanEmail).success) {
        setError("Informe um e-mail válido. O e-mail existente não pode ser apagado.")
        return
      }
    }
    if (phone !== appointment.customerPhone) {
      if (!isValidPhone(phone, { version: 2 })) {
        setError("Informe um telefone brasileiro válido.")
        return
      }
    }
    let body: ReturnType<typeof appointmentChanges>
    try {
      body = appointmentChanges(appointment, { name, email, phone, notes: cleanNotes, serviceId, date, time })
    } catch (cause) {
      setError(errorMessage(cause))
      return
    }
    if (!Object.keys(body).length) return
    setBusy(true)
    setError("")
    try {
      await appointmentsApi.update(appointment.id, body)
      onSaved()
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void save(event)}>
      <h2>Editar reserva de {appointment.customerName}</h2>
      <ApiFeedback loading={services.loading} error={services.error} retry={services.reload} />
      <label className={styles.field}>
        Nome
        <input value={name} maxLength={150} required onChange={(event) => setName(event.target.value)} />
      </label>
      <label className={styles.field}>
        E-mail
        <input
          type="email"
          value={email}
          maxLength={254}
          placeholder="Não informado"
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className={styles.field}>
        Telefone
        <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      <label className={styles.field}>
        Observações
        <textarea value={notes} maxLength={2000} onChange={(event) => setNotes(event.target.value)} />
      </label>
      {canReschedule && (
        <>
          <label className={styles.field}>
            Serviço
            <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
              {!services.data?.some((item) => item.id === appointment.serviceId) && (
                <option value={appointment.serviceId}>{appointment.service.name}</option>
              )}
              {services.data?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.grid}>
            <label className={styles.field}>
              Data
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className={styles.field}>
              Horário
              <input type="time" step={60} value={time} onChange={(event) => setTime(event.target.value)} />
            </label>
          </div>
        </>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <button type="submit" disabled={busy || !changed}>
          {busy ? "Salvando..." : "Salvar alterações"}
        </button>
        <button type="button" className={styles.secondary} disabled={busy} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
