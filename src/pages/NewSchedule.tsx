import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { useInterfaceFocus } from "@/hooks/use-interface-focus"
import { MainLayout } from "@/layout/MainLayout"
import { errorMessage, schedulesApi, servicesApi } from "@/lib/api"
import { formatPrice, weekDays } from "@/lib/date-utils"
import styles from "./Management.module.css"

const loadConfiguration = async (signal: AbortSignal) => {
  const [schedules, services] = await Promise.all([schedulesApi.list(signal), servicesApi.listAll(signal)])
  return { schedules: schedules.schedules, services }
}
export function NewSchedule() {
  const navigate = useNavigate()
  const resource = useApiData(loadConfiguration)
  const [step, setStep] = useState(1)
  const stepPanel = useInterfaceFocus<HTMLElement>(step, "h2")
  const [days, setDays] = useState(
    weekDays.map((_, weekDay) => ({
      weekDay,
      selected: weekDay > 0 && weekDay < 6,
      startTime: "08:00",
      endTime: "18:00"
    }))
  )
  const [saved, setSaved] = useState<number[]>([])
  const [serviceId, setServiceId] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const existing = resource.data?.schedules ?? []
  const selected = days.filter(
    (day) => day.selected && !existing.some((item) => item.weekDay === day.weekDay)
  )
  const service = resource.data?.services.find((item) => item.id === serviceId)
  function validate() {
    if (!selected.length) {
      setError("Selecione pelo menos um dia ainda não cadastrado.")
      return false
    }
    if (selected.some((day) => !day.startTime || !day.endTime || day.endTime <= day.startTime)) {
      setError("Em cada dia, informe horários válidos e término posterior ao início.")
      return false
    }
    setError("")
    return true
  }
  async function save() {
    if (!validate()) return
    setBusy(true)
    let savedCount = saved.length
    try {
      for (const { weekDay, startTime, endTime } of selected) {
        if (saved.includes(weekDay)) continue
        await schedulesApi.create({ weekDay, startTime, endTime })
        savedCount++
        setSaved((current) => [...current, weekDay])
      }
      navigate("/agenda")
    } catch (error) {
      setError(
        `${errorMessage(error)} ${savedCount ? `${savedCount} dia(s) já salvo(s). Ao tentar novamente, serão enviados apenas os dias restantes.` : "Não foi possível confirmar o salvamento. Confira os expedientes existentes em Agendas."}`
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Novo expediente</h1>
            <p>Configure os dias e horários de atendimento da sua empresa.</p>
          </div>
          <Link to="/agenda">Voltar às agendas</Link>
        </header>
        <ol className={styles.steps}>
          {["Informações", "Dias e horários", "Serviços", "Revisão"].map((label, index) => (
            <li key={label} aria-current={step === index + 1 ? "step" : undefined}>
              {label}
            </li>
          ))}
        </ol>
        <ApiFeedback loading={resource.loading} error={resource.error} retry={resource.reload} />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {resource.data && (
          <section ref={stepPanel} className={styles.card}>
            {step === 1 && (
              <>
                <h2>Expediente da empresa</h2>
                <p>
                  Cadastre um intervalo por dia da semana, no horário de São Paulo. Todos os serviços
                  cadastrados ficam disponíveis dentro desse expediente, conforme a duração e as reservas
                  existentes.
                </p>
                <p>
                  Você já possui {existing.length} dia(s) configurado(s). Para alterar esses horários, acesse
                  Agendas.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h2>Dias e horários</h2>
                {days.map((day) => {
                  const current = existing.find((item) => item.weekDay === day.weekDay)
                  const locked = Boolean(current) || saved.includes(day.weekDay)
                  return (
                    <div className={styles.dayRow} key={day.weekDay}>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(current) || day.selected}
                          disabled={locked || busy}
                          onChange={(event) =>
                            setDays(
                              days.map((item) =>
                                item.weekDay === day.weekDay
                                  ? { ...item, selected: event.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        {weekDays[day.weekDay]}
                      </label>
                      <label className={styles.field}>
                        Início
                        <input
                          type="time"
                          step={60}
                          value={current?.startTime ?? day.startTime}
                          disabled={locked || !day.selected || busy}
                          onChange={(event) =>
                            setDays(
                              days.map((item) =>
                                item.weekDay === day.weekDay
                                  ? { ...item, startTime: event.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        Fim
                        <input
                          type="time"
                          step={60}
                          value={current?.endTime ?? day.endTime}
                          disabled={locked || !day.selected || busy}
                          onChange={(event) =>
                            setDays(
                              days.map((item) =>
                                item.weekDay === day.weekDay ? { ...item, endTime: event.target.value } : item
                              )
                            )
                          }
                        />
                      </label>
                      {locked && <span>Já cadastrado</span>}
                    </div>
                  )
                })}
              </>
            )}
            {step === 3 && (
              <>
                <h2>Serviços oferecidos</h2>
                <p>
                  Selecione um serviço para consultar sua duração na revisão. O expediente vale para todos os
                  serviços.
                </p>
                <div className={styles.grid}>
                  {resource.data.services.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={styles.secondary}
                      aria-pressed={item.id === serviceId}
                      onClick={() => setServiceId(item.id)}>
                      {item.name} · {item.durationInMinutes} min · {formatPrice(item.price)}
                    </button>
                  ))}
                </div>
                {!resource.data.services.length && (
                  <p>
                    Nenhum serviço cadastrado. Você pode salvar o expediente e{" "}
                    <Link to="/servicos">cadastrar serviços</Link> depois.
                  </p>
                )}
              </>
            )}
            {step === 4 && (
              <>
                <h2>Revise antes de salvar</h2>
                <dl className={styles.review}>
                  {selected.map((day) => (
                    <div key={day.weekDay}>
                      <dt>{weekDays[day.weekDay]}</dt>
                      <dd>
                        {day.startTime} – {day.endTime}
                        {saved.includes(day.weekDay) ? " (salvo)" : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
                {service && (
                  <p>
                    Serviço consultado: {service.name} · {service.durationInMinutes} min ·{" "}
                    {formatPrice(service.price)}
                  </p>
                )}
                <p>Os horários serão salvos para a sua conta.</p>
              </>
            )}
            <div className={styles.stepActions}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.secondary}
                  disabled={busy}
                  onClick={() => setStep(step - 1)}>
                  Voltar
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step !== 2 || validate()) setStep(step + 1)
                  }}>
                  Continuar
                </button>
              ) : (
                <button type="button" disabled={busy} onClick={() => void save()}>
                  {busy ? "Salvando..." : "Salvar expediente"}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  )
}
