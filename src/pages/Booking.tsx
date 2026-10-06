import { isValidPhone } from "@brazilian-utils/brazilian-utils"
import { type FormEvent, useCallback, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ApiFeedback } from "@/components/ApiFeedback"
import { BookingCalendar } from "@/components/BookingCalendar"
import { useApiData } from "@/hooks/use-api-data"
import { useInterfaceFocus } from "@/hooks/use-interface-focus"
import { MainLayout } from "@/layout/MainLayout"
import { ApiError, appointmentsApi, errorMessage, schedulesApi, servicesApi } from "@/lib/api"
import { statusLabels } from "@/lib/appointment-status"
import {
  availableSlots,
  businessDate,
  dayRange,
  formatDate,
  formatPrice,
  formatTime,
  toBusinessISO,
  weekDayForDate
} from "@/lib/date-utils"
import type { Appointment, Service } from "@/types/api"
import styles from "./Management.module.css"

const loadConfiguration = async (signal: AbortSignal) => {
  const [services, schedules] = await Promise.all([servicesApi.listAll(signal), schedulesApi.list(signal)])
  return { services, schedules: schedules.schedules }
}
export function Booking() {
  const configuration = useApiData(loadConfiguration)
  const [date, setDate] = useState(businessDate())
  const appointments = useApiData(
    useCallback((signal: AbortSignal) => appointmentsApi.listAll(dayRange(date), signal), [date])
  )
  const [serviceId, setServiceId] = useState("")
  const [time, setTime] = useState("")
  const [step, setStep] = useState(1)
  const stepPanel = useInterfaceFocus<HTMLElement>(step, "h2")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [errorField, setErrorField] = useState<"name" | "phone" | null>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const phoneInput = useRef<HTMLInputElement>(null)
  const [confirmation, setConfirmation] = useState<{ appointment: Appointment; service: Service } | null>(
    null
  )
  const service = configuration.data?.services.find((item) => item.id === serviceId)
  const schedule = configuration.data?.schedules.find((item) => item.weekDay === weekDayForDate(date))
  const slots =
    service && appointments.data
      ? availableSlots(date, schedule, service.durationInMinutes, appointments.data)
      : []
  const validSlot = Boolean(time && slots.includes(time))
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!customerName.trim()) {
      setError("Informe o nome do cliente.")
      setErrorField("name")
      nameInput.current?.focus()
      return
    }
    if (!isValidPhone(customerPhone)) {
      setError("Informe um telefone brasileiro válido com DDD.")
      setErrorField("phone")
      phoneInput.current?.focus()
      return
    }
    setError("")
    setErrorField(null)
    setStep(4)
  }
  async function confirm() {
    if (!service || !validSlot) {
      setError("Selecione um horário disponível.")
      setStep(2)
      return
    }
    setBusy(true)
    setError("")
    try {
      const { appointment } = await appointmentsApi.create({
        serviceId: service.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ""),
        startAt: toBusinessISO(date, time),
        notes: notes.trim() || null
      })
      setConfirmation({ appointment, service })
    } catch (error) {
      setError(errorMessage(error))
      if (error instanceof ApiError && [409, 422, 404].includes(error.status)) {
        setTime("")
        setStep(2)
        appointments.reload()
        configuration.reload()
      }
    } finally {
      setBusy(false)
    }
  }
  function reset() {
    setConfirmation(null)
    setStep(1)
    setTime("")
    setServiceId("")
    setCustomerName("")
    setCustomerPhone("")
    setNotes("")
    setError("")
    setErrorField(null)
    appointments.reload()
    configuration.reload()
  }
  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Agendar atendimento</h1>
            <p>Cadastre uma reserva para um cliente da sua empresa. Horários de São Paulo.</p>
          </div>
          <Link to="/agenda">Voltar à agenda</Link>
        </header>
        {confirmation ? (
          <section className={styles.card}>
            <h2>Agendamento criado</h2>
            <p role="status">A reserva foi salva com sucesso.</p>
            <p>
              <strong>{confirmation.appointment.customerName}</strong> ·{" "}
              {confirmation.appointment.customerPhone}
            </p>
            <p>
              {confirmation.service.name} · {formatPrice(confirmation.service.price)}
            </p>
            <p>
              {formatDate(confirmation.appointment.startAt)} · {formatTime(confirmation.appointment.startAt)}{" "}
              – {formatTime(confirmation.appointment.endAt)}
            </p>
            <p>Status: {statusLabels[confirmation.appointment.status]}</p>
            <p>Reserva: {confirmation.appointment.id}</p>
            {confirmation.appointment.notes && <p>{confirmation.appointment.notes}</p>}
            <div className={styles.actions}>
              <Link className={styles.button} to="/agenda">
                Ver agenda
              </Link>
              <button type="button" className={styles.secondary} onClick={reset}>
                Novo agendamento
              </button>
            </div>
          </section>
        ) : (
          <>
            <ol className={styles.steps}>
              {["Serviço", "Data e horário", "Cliente", "Revisão"].map((label, index) => (
                <li key={label} aria-current={step === index + 1 ? "step" : undefined}>
                  {label}
                </li>
              ))}
            </ol>
            {error && (
              <p id="booking-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
            <ApiFeedback
              loading={configuration.loading}
              error={configuration.error}
              retry={configuration.reload}
            />
            {configuration.data && (
              <section ref={stepPanel} className={styles.card}>
                {step === 1 && (
                  <>
                    <h2>Escolha o serviço</h2>
                    <div className={styles.grid}>
                      {configuration.data.services.map((item) => (
                        <button
                          type="button"
                          className={styles.secondary}
                          aria-pressed={serviceId === item.id}
                          key={item.id}
                          onClick={() => {
                            setServiceId(item.id)
                            setTime("")
                          }}>
                          {item.name}
                          <br />
                          {item.durationInMinutes} min · {formatPrice(item.price)}
                        </button>
                      ))}
                    </div>
                    {!configuration.data.services.length && (
                      <p>
                        Cadastre um serviço em <Link to="/servicos">Serviços</Link> para começar.
                      </p>
                    )}
                    {!configuration.data.schedules.length && (
                      <p>
                        Configure primeiro seu <Link to="/nova-agenda">expediente semanal</Link>.
                      </p>
                    )}
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2>Data e horário · {service?.name ?? "Selecione novamente o serviço"}</h2>
                    <div className={styles.grid}>
                      <BookingCalendar
                        date={date}
                        schedules={configuration.data.schedules}
                        onChange={(value) => {
                          setDate(value)
                          setTime("")
                          setError("")
                        }}
                      />
                      <div>
                        <h2>Horários disponíveis</h2>
                        <p>{formatDate(toBusinessISO(date))}</p>
                        <ApiFeedback
                          loading={appointments.loading}
                          error={appointments.error}
                          retry={appointments.reload}
                        />
                        {appointments.data && (
                          <>
                            <div className={styles.actions}>
                              {slots.map((slot) => (
                                <button
                                  type="button"
                                  className={styles.secondary}
                                  key={slot}
                                  aria-pressed={time === slot}
                                  onClick={() => setTime(slot)}>
                                  {slot}
                                </button>
                              ))}
                            </div>
                            {!slots.length && <p>Nenhum horário disponível para esse serviço nesta data.</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <form id="booking-customer" className={styles.form} onSubmit={review}>
                    <h2>Dados do cliente</h2>
                    <label className={styles.field}>
                      Nome
                      <input
                        ref={nameInput}
                        aria-invalid={errorField === "name"}
                        aria-describedby={errorField === "name" ? "booking-error" : undefined}
                        required
                        autoComplete="name"
                        maxLength={150}
                        value={customerName}
                        onChange={(event) => {
                          setCustomerName(event.target.value)
                          if (errorField === "name") {
                            setErrorField(null)
                            setError("")
                          }
                        }}
                      />
                    </label>
                    <label className={styles.field}>
                      Telefone com DDD
                      <input
                        ref={phoneInput}
                        aria-invalid={errorField === "phone"}
                        aria-describedby={errorField === "phone" ? "booking-error" : undefined}
                        type="tel"
                        autoComplete="tel"
                        required
                        maxLength={25}
                        placeholder="(11) 91234-5678"
                        value={customerPhone}
                        onChange={(event) => {
                          setCustomerPhone(event.target.value)
                          if (errorField === "phone") {
                            setErrorField(null)
                            setError("")
                          }
                        }}
                      />
                    </label>
                    <label className={styles.field}>
                      Observações (opcional)
                      <textarea
                        maxLength={2000}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      />
                    </label>
                  </form>
                )}
                {step === 4 && (
                  <>
                    <h2>Revise o agendamento</h2>
                    <dl className={styles.review}>
                      <div>
                        <dt>Cliente</dt>
                        <dd>
                          {customerName} · {customerPhone}
                        </dd>
                      </div>
                      <div>
                        <dt>Serviço</dt>
                        <dd>
                          {service?.name} · {service ? formatPrice(service.price) : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>Data e horário</dt>
                        <dd>
                          {formatDate(toBusinessISO(date))} às {time}
                        </dd>
                      </div>
                      {notes && (
                        <div>
                          <dt>Observações</dt>
                          <dd>{notes}</dd>
                        </div>
                      )}
                    </dl>
                  </>
                )}
                <div className={styles.stepActions}>
                  {step > 1 && (
                    <button
                      type="button"
                      className={styles.secondary}
                      disabled={busy}
                      onClick={() => {
                        setStep(step - 1)
                        setError("")
                        setErrorField(null)
                      }}>
                      Voltar
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      disabled={step === 1 ? !service || !configuration.data.schedules.length : !validSlot}
                      onClick={() => setStep(step + 1)}>
                      Continuar
                    </button>
                  )}
                  {step === 3 && (
                    <button type="submit" form="booking-customer">
                      Revisar agendamento
                    </button>
                  )}
                  {step === 4 && (
                    <button type="button" disabled={busy || !validSlot} onClick={() => void confirm()}>
                      {busy ? "Salvando..." : "Confirmar agendamento"}
                    </button>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
