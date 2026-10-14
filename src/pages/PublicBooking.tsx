import { isValidPhone } from "@brazilian-utils/brazilian-utils"
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { z } from "zod"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { ApiError, errorMessage, publicBookingApi } from "@/lib/api"
import { calendarDateInZone, formatPrice } from "@/lib/date-utils"
import type { PublicAppointment } from "@/types/api"
import styles from "./Management.module.css"

export function PublicBooking() {
  const { companyId = "" } = useParams()
  const companyResource = useApiData(
    useCallback((signal: AbortSignal) => publicBookingApi.company(companyId, signal), [companyId])
  )
  const company = companyResource.data?.company
  const [serviceId, setServiceId] = useState("")
  const [date, setDate] = useState("")
  const [startAt, setStartAt] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [fieldError, setFieldError] = useState<"name" | "email" | "phone" | null>(null)
  const [busy, setBusy] = useState(false)
  const sending = useRef(false)
  const [confirmation, setConfirmation] = useState<PublicAppointment | null>(null)
  useEffect(() => {
    if (!companyId) return
    setServiceId("")
    setDate("")
    setStartAt("")
    setConfirmation(null)
  }, [companyId])
  const service = company?.services.find((item) => item.id === serviceId)
  const availability = useApiData(
    useCallback(
      (signal: AbortSignal) =>
        service && date
          ? publicBookingApi.availability(companyId, service.id, date, signal)
          : Promise.resolve({ slots: [] }),
      [companyId, service, date]
    )
  )
  const slots = service && date ? availability.data?.slots : undefined
  const validSlot = slots?.some((slot) => slot.startAt === startAt) ?? false
  const zone = company?.timeZone ?? "UTC"
  const time = (value: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value))
  const timeWithOffset = (value: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset"
    }).format(new Date(value))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current || !service || !validSlot) return
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    if (!cleanName) {
      setFieldError("name")
      setError("Informe seu nome.")
      return
    }
    if (!z.email().max(254).safeParse(cleanEmail).success) {
      setFieldError("email")
      setError("Informe um e-mail válido.")
      return
    }
    if (!isValidPhone(phone, { version: 2 })) {
      setFieldError("phone")
      setError("Informe um telefone brasileiro válido com DDD.")
      return
    }
    setFieldError(null)
    setError("")
    sending.current = true
    setBusy(true)
    try {
      const result = await publicBookingApi.create(companyId, {
        serviceId: service.id,
        startAt,
        customerName: cleanName,
        customerEmail: cleanEmail,
        customerPhone: phone,
        notes: notes.trim() || null
      })
      setConfirmation(result.appointment)
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 409) {
        setStartAt("")
        availability.reload()
        setError("Esse horário ficou indisponível. Escolha outro horário.")
      } else if (cause instanceof ApiError && cause.status === 404) {
        setServiceId("")
        setStartAt("")
        companyResource.reload()
        setError("Empresa ou serviço indisponível. Confira as opções atualizadas.")
      } else if (cause instanceof ApiError && cause.status === 422) {
        setStartAt("")
        availability.reload()
        setError(errorMessage(cause))
      } else if (cause instanceof ApiError && cause.status === 0) {
        setError("Não foi possível confirmar o resultado. Confira com a empresa antes de tentar novamente.")
      } else setError(errorMessage(cause))
    } finally {
      sending.current = false
      setBusy(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>{company?.name ?? "Agendamento"}</h1>
          <p>Escolha um serviço e um horário. Horários da empresa{company ? ` (${zone})` : ""}.</p>
        </div>
      </header>
      <ApiFeedback
        loading={companyResource.loading}
        error={
          companyResource.status === 404
            ? "Empresa não encontrada. Confira o link recebido."
            : companyResource.status === 422
              ? "Link de agendamento inválido."
              : companyResource.error
        }
        retry={companyResource.reload}
      />
      {company && (!company.services.length || !company.schedules.length) && (
        <p className={styles.card} role="status">
          Agendamento indisponível no momento. Consulte a empresa.
        </p>
      )}
      {company &&
        company.services.length > 0 &&
        company.schedules.length > 0 &&
        (confirmation ? (
          <section className={styles.card}>
            <h2>Agendamento realizado</h2>
            <p role="status">Sua reserva foi registrada.</p>
            <p>{service?.name}</p>
            <p>
              {new Intl.DateTimeFormat("pt-BR", { timeZone: zone, dateStyle: "long" }).format(
                new Date(confirmation.startAt)
              )}{" "}
              · {timeWithOffset(confirmation.startAt)} – {timeWithOffset(confirmation.endAt)}
            </p>
            <p>Reserva: {confirmation.id}</p>
            <button
              type="button"
              onClick={() => {
                setConfirmation(null)
                setStartAt("")
                setName("")
                setEmail("")
                setPhone("")
                setNotes("")
                availability.reload()
              }}>
              Fazer outro agendamento
            </button>
          </section>
        ) : (
          <form onSubmit={(event) => void submit(event)}>
            <section className={styles.card}>
              <h2>Serviço</h2>
              <div className={styles.grid}>
                {company.services.map((item) => (
                  <button
                    type="button"
                    className={styles.secondary}
                    key={item.id}
                    aria-pressed={serviceId === item.id}
                    onClick={() => {
                      setServiceId(item.id)
                      setStartAt("")
                      setError("")
                    }}>
                    <strong>{item.name}</strong>
                    <br />
                    {item.description && (
                      <span>
                        {item.description}
                        <br />
                      </span>
                    )}
                    {item.durationInMinutes} min · {formatPrice(item.price)}
                  </button>
                ))}
              </div>
            </section>
            <section className={styles.card}>
              <h2>Data e horário</h2>
              <label className={styles.field}>
                Data
                <input
                  type="date"
                  value={date}
                  min={calendarDateInZone(zone)}
                  required
                  onChange={(event) => {
                    setDate(event.target.value)
                    setStartAt("")
                    setError("")
                  }}
                />
              </label>
              {service && date && (
                <>
                  <ApiFeedback
                    loading={availability.loading}
                    error={availability.error}
                    retry={availability.reload}
                  />
                  {slots && (
                    <fieldset
                      className={`${styles.actions} ${styles.slotGroup}`}
                      aria-label="Horários disponíveis">
                      {slots.map((slot) => {
                        const duplicate = slots.some(
                          (other) =>
                            other.startAt !== slot.startAt && time(other.startAt) === time(slot.startAt)
                        )
                        return (
                          <button
                            type="button"
                            className={styles.secondary}
                            key={slot.startAt}
                            aria-pressed={startAt === slot.startAt}
                            onClick={() => setStartAt(slot.startAt)}>
                            {duplicate ? timeWithOffset(slot.startAt) : time(slot.startAt)}
                          </button>
                        )
                      })}
                    </fieldset>
                  )}
                  {slots?.length === 0 && (
                    <p role="status">Nenhum horário disponível nesta data. Escolha outra data.</p>
                  )}
                </>
              )}
            </section>
            <section className={styles.card}>
              <h2>Seus dados</h2>
              <div className={styles.form}>
                <label className={styles.field}>
                  Nome *
                  <input
                    value={name}
                    required
                    maxLength={150}
                    autoComplete="name"
                    aria-invalid={fieldError === "name"}
                    aria-describedby={fieldError === "name" ? "booking-error" : undefined}
                    onChange={(event) => {
                      setName(event.target.value)
                      if (fieldError === "name") setFieldError(null)
                    }}
                  />
                </label>
                <label className={styles.field}>
                  E-mail *
                  <input
                    type="email"
                    value={email}
                    required
                    maxLength={254}
                    autoComplete="email"
                    aria-invalid={fieldError === "email"}
                    aria-describedby={fieldError === "email" ? "booking-error" : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (fieldError === "email") setFieldError(null)
                    }}
                  />
                </label>
                <label className={styles.field}>
                  Telefone com DDD *
                  <input
                    type="tel"
                    value={phone}
                    required
                    maxLength={25}
                    autoComplete="tel"
                    placeholder="(11) 91234-5678"
                    aria-invalid={fieldError === "phone"}
                    aria-describedby={fieldError === "phone" ? "booking-error" : undefined}
                    onChange={(event) => {
                      setPhone(event.target.value)
                      if (fieldError === "phone") setFieldError(null)
                    }}
                  />
                </label>
                <label className={styles.field}>
                  Observações (opcional)
                  <textarea
                    value={notes}
                    maxLength={2000}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </label>
              </div>
            </section>
            {error && (
              <p id="booking-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={!validSlot || busy}>
              {busy ? "Agendando..." : "Confirmar agendamento"}
            </button>
          </form>
        ))}
    </main>
  )
}
