import { type FormEvent, useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { ApiFeedback } from "@/components/ApiFeedback"
import { AppointmentTable } from "@/components/AppointmentTable"
import { useApiData } from "@/hooks/use-api-data"
import { useInterfaceFocus } from "@/hooks/use-interface-focus"
import { MainLayout } from "@/layout/MainLayout"
import { appointmentsApi, errorMessage, schedulesApi } from "@/lib/api"
import { businessDate, dayRange, weekDays } from "@/lib/date-utils"
import type { Schedule as ScheduleModel } from "@/types/api"
import styles from "./Management.module.css"

const loadSchedules = (signal: AbortSignal) => schedulesApi.list(signal)
export function Schedule() {
  const [date, setDate] = useState(businessDate())
  const schedules = useApiData(loadSchedules)
  const appointments = useApiData(
    useCallback((signal: AbortSignal) => appointmentsApi.listAll(dayRange(date), signal), [date])
  )
  const [editing, setEditing] = useState<ScheduleModel | null>(null)
  const editor = useInterfaceFocus<HTMLFormElement>(editing, "input")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [invalidTime, setInvalidTime] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) return
    const form = new FormData(event.currentTarget)
    const startTime = String(form.get("startTime")),
      endTime = String(form.get("endTime"))
    if (endTime <= startTime) {
      setError("O horário final deve ser posterior ao inicial.")
      setInvalidTime(true)
      event.currentTarget.querySelector<HTMLInputElement>('[name="endTime"]')?.focus()
      return
    }
    setBusy(true)
    setError("")
    setInvalidTime(false)
    setMessage("")
    try {
      await schedulesApi.update(editing.id, { startTime, endTime })
      setEditing(null)
      setMessage("Expediente salvo.")
      schedules.reload()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  async function remove(schedule: ScheduleModel) {
    if (!window.confirm(`Remover o expediente de ${weekDays[schedule.weekDay]}?`)) return
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await schedulesApi.delete(schedule.id)
      setMessage("Expediente excluído.")
      schedules.reload()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Agendas</h1>
            <p>Expediente e agendamentos em horário de São Paulo.</p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.button} to="/nova-agenda">
              + Novo expediente
            </Link>
            <Link className={styles.button} to="/agendar">
              Agendar atendimento
            </Link>
          </div>
        </header>
        {error && (
          <p id="schedule-error" role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" className={styles.success}>
            {message}
          </p>
        )}
        <section className={styles.card}>
          <h2>Expediente semanal</h2>
          <ApiFeedback loading={schedules.loading} error={schedules.error} retry={schedules.reload} />
          {schedules.data?.schedules.map((schedule) => (
            <div className={styles.dayRow} key={schedule.id}>
              <strong>{weekDays[schedule.weekDay]}</strong>
              <span>
                {schedule.startTime} – {schedule.endTime}
              </span>
              <button
                type="button"
                className={styles.secondary}
                disabled={busy}
                onClick={() => {
                  setEditing(schedule)
                  setError("")
                  setMessage("")
                  setInvalidTime(false)
                }}>
                Editar
              </button>
              <button
                type="button"
                className={styles.danger}
                disabled={busy}
                onClick={() => void remove(schedule)}>
                Excluir
              </button>
            </div>
          ))}
          {schedules.data?.schedules.length === 0 && (
            <p>Nenhum expediente cadastrado. Configure os dias e horários de atendimento.</p>
          )}
          {editing && (
            <form ref={editor} key={editing.id} className={styles.form} onSubmit={save}>
              <h2>Editar {weekDays[editing.weekDay]}</h2>
              <div className={styles.grid}>
                <label className={styles.field}>
                  Início
                  <input name="startTime" type="time" step={60} required defaultValue={editing.startTime} />
                </label>
                <label className={styles.field}>
                  Fim
                  <input
                    name="endTime"
                    type="time"
                    step={60}
                    required
                    defaultValue={editing.endTime}
                    aria-invalid={invalidTime}
                    aria-describedby={invalidTime ? "schedule-error" : undefined}
                    onChange={() => {
                      if (invalidTime) {
                        setInvalidTime(false)
                        setError("")
                      }
                    }}
                  />
                </label>
              </div>
              <div className={styles.actions}>
                <button type="submit" disabled={busy}>
                  {busy ? "Salvando..." : "Salvar expediente"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={styles.secondary}
                  onClick={() => setEditing(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>
        <section className={styles.card}>
          <div className={styles.header}>
            <h2>Agendamentos do dia</h2>
            <label className={styles.field}>
              Data
              <input
                type="date"
                required
                value={date}
                onChange={(event) => {
                  if (event.target.value) setDate(event.target.value)
                }}
              />
            </label>
          </div>
          <ApiFeedback
            loading={appointments.loading}
            error={appointments.error}
            retry={appointments.reload}
            loadingMessage="Carregando agendamentos do dia..."
          />
          {appointments.data && (
            <AppointmentTable
              appointments={[...appointments.data].sort((a, b) => a.startAt.localeCompare(b.startAt))}
              onChange={appointments.reload}
              emptyMessage="Nenhum agendamento nesta data. Escolha outro dia ou agende um atendimento."
            />
          )}
        </section>
      </div>
    </MainLayout>
  )
}
