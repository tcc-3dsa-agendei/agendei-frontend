import { useState } from "react"
import { AppointmentEditor } from "@/components/AppointmentEditor"
import { ApiError, appointmentsApi, errorMessage } from "@/lib/api"
import { allowedStatuses, statusLabels } from "@/lib/appointment-status"
import { formatDate, formatTime } from "@/lib/date-utils"
import styles from "@/pages/Management.module.css"
import type { AppointmentStatus, AppointmentWithService } from "@/types/api"

export function AppointmentTable({
  appointments,
  onChange,
  emptyMessage = "Nenhum agendamento encontrado."
}: {
  appointments: AppointmentWithService[]
  onChange: () => void
  emptyMessage?: string
}) {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const selected = appointments.find((item) => item.id === editing)
  async function changeStatus(id: string, status: AppointmentStatus) {
    setBusy(id)
    setError("")
    try {
      await appointmentsApi.updateStatus(id, status)
      onChange()
    } catch (error) {
      setError(errorMessage(error))
      if (error instanceof ApiError && error.status === 409) onChange()
    } finally {
      setBusy(null)
    }
  }
  async function remove(id: string) {
    if (!window.confirm("Excluir esta reserva?")) return
    setBusy(id)
    setError("")
    try {
      await appointmentsApi.delete(id)
      onChange()
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusy(null)
    }
  }
  return (
    <>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Scrollable tables need keyboard access. */}
      <section className={styles.table} aria-label="Lista de agendamentos" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Serviço</th>
              <th scope="col">Data / horário</th>
              <th scope="col">Status</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <strong>{appointment.customerName}</strong>
                  <small>{appointment.customerPhone}</small>
                  <small>{appointment.customerEmail ?? "E-mail não informado"}</small>
                  {appointment.notes && <small>{appointment.notes}</small>}
                </td>
                <td>{appointment.service.name}</td>
                <td>
                  {formatDate(appointment.startAt)}
                  <small>
                    {formatTime(appointment.startAt)} – {formatTime(appointment.endAt)}
                  </small>
                </td>
                <td>
                  <span className={styles.badge} data-status={appointment.status}>
                    {statusLabels[appointment.status]}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.secondary}
                      disabled={busy !== null}
                      onClick={() => setEditing(appointment.id)}>
                      Editar
                    </button>
                    {allowedStatuses(appointment).map((status) => (
                      <button
                        type="button"
                        className={styles.secondary}
                        disabled={busy !== null}
                        key={status}
                        onClick={() => void changeStatus(appointment.id, status)}>
                        {statusLabels[status]}
                      </button>
                    ))}
                    {busy === appointment.id && <span role="status">Salvando...</span>}
                    <button
                      type="button"
                      className={styles.danger}
                      disabled={busy !== null}
                      onClick={() => void remove(appointment.id)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!appointments.length && <p role="status">{emptyMessage}</p>}
      </section>
      {selected && (
        <section className={styles.card} aria-label="Editar reserva">
          <AppointmentEditor
            key={selected.id}
            appointment={selected}
            onSaved={() => {
              setEditing(null)
              onChange()
            }}
            onCancel={() => setEditing(null)}
          />
        </section>
      )}
    </>
  )
}
