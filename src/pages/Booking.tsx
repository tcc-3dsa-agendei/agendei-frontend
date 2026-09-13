import { isValidMobilePhone } from "@brazilian-utils/brazilian-utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  IconCalendarClock,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconClipboardCheck,
  IconListDetails,
  IconUser
} from "@tabler/icons-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { z } from "zod"
import { MainLayout } from "../layout/MainLayout"
import styles from "./Booking.module.css"

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
]

const services = [
  { id: "corte", name: "Corte de cabelo", duration: "30 minutos", price: "R$35,00" },
  { id: "barba", name: "Barba", duration: "20 minutos", price: "R$20,00" },
  { id: "combo", name: "Corte + Barba", duration: "50 minutos", price: "R$50,00" },
  { id: "manicure", name: "Manicure", duration: "1 hora", price: "R$65,00" }
]

interface calendarDay {
  day: number
  month: number
  year: number
  currentMonth: boolean
}

function getCalendarDays(month: number, year: number): calendarDay[] {
  const firstWeekDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year

  const days: calendarDay[] = []

  for (let i = firstWeekDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, currentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, month, year, currentMonth: true })
  }

  let nextMonthDay = 1
  while (days.length % 7 !== 0) {
    days.push({ day: nextMonthDay, month: nextMonth, year: nextYear, currentMonth: false })
    nextMonthDay++
  }

  return days
}

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

function formatMinutesToTime(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

function getTimeSlots(
  startTime: string,
  endTime: string,
  intervalStart: string,
  intervalEnd: string
): string[] {
  const slots: string[] = []

  const start = parseTimeToMinutes(startTime)
  const end = parseTimeToMinutes(endTime)
  const intervalStartMinutes = parseTimeToMinutes(intervalStart)
  const intervalEndMinutes = parseTimeToMinutes(intervalEnd)

  for (let minutes = start; minutes < end; minutes += 30) {
    const isInsideInterval = minutes >= intervalStartMinutes && minutes < intervalEndMinutes

    if (!isInsideInterval) {
      slots.push(formatMinutesToTime(minutes))
    }
  }

  return slots
}

const clientDataFormSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(255, "Máximo de 255 caracteres"),
  email: z.email("E-mail inválido").max(255, "Máximo de 255 caracteres"),
  phone: z.string().refine(isValidMobilePhone, "Telefone inválido")
})

export function Booking() {
  const today = new Date()

  const [step, setStep] = useState<number>(1)

  const [calendarDate, setCalendarDate] = useState<{ month: number; year: number }>({
    month: today.getMonth(),
    year: today.getFullYear()
  })

  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("18:00")
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const {
    register,
    trigger,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(clientDataFormSchema),
    reValidateMode: "onBlur"
  })

  const registerWithMask = useHookFormMask(register)

  const calendarDays = getCalendarDays(calendarDate.month, calendarDate.year)
  const timeSlots = getTimeSlots(startTime, endTime, "12:00", "13:00")
  const selectedServiceData = services.find((service) => service.id === selectedService)

  const handlePreviousMonth = () => {
    setCalendarDate((current) =>
      current.month === 0
        ? { month: 11, year: current.year - 1 }
        : { month: current.month - 1, year: current.year }
    )
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCalendarDate((current) =>
      current.month === 11
        ? { month: 0, year: current.year + 1 }
        : { month: current.month + 1, year: current.year }
    )
    setSelectedDay(null)
  }

  const handleContinue = async () => {
    if (step === 3) {
      const isValid = await trigger()

      if (!isValid) return
    }

    setStep(step + 1)
  }

  const handleConfirmBooking = () => {
    const { name, email, phone } = getValues()

    console.log({
      date: `${selectedDay}/${calendarDate.month + 1}/${calendarDate.year}`,
      time: selectedTime,
      service: selectedServiceData,
      name,
      email,
      phone
    })

    setIsConfirmed(true)
  }

  const handleNewBooking = () => {
    setStep(1)
    setSelectedDay(today.getDate())
    setSelectedTime(null)
    setSelectedService(null)
    setIsConfirmed(false)
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.main}>
          <header className={styles.banner}>
            <div className={styles.avatar}></div>

            <div className={styles.bannerInfo}>
              <h1>Barbearia NJ</h1>

              <p>Agende seu horário de forma rápida e fácil</p>
            </div>
          </header>

          <section className={styles.steps}>
            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 1 ? styles.active : ""}`}>1</div>

              <div className={styles.stepInfo}>
                <strong>Data e hora</strong>

                <span>Selecione a data e hora desejada</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 2 ? styles.active : ""}`}>2</div>

              <div className={styles.stepInfo}>
                <strong>Serviços</strong>

                <span>Selecione o serviço desejado</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 3 ? styles.active : ""}`}>3</div>

              <div className={styles.stepInfo}>
                <strong>Seus dados</strong>

                <span>Preencha com suas informações</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 4 ? styles.active : ""}`}>4</div>

              <div className={styles.stepInfo}>
                <strong>Confirmação</strong>

                <span>Revise e confirme seu agendamento</span>
              </div>
            </div>
          </section>

          <section className={styles.content}>
            {!isConfirmed ? (
              <>
                {step === 1 && (
                  <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                      <div className={styles.icon}>
                        <IconCalendarClock size={18} stroke={1.8} />
                      </div>

                      <div>
                        <h2>Escolha a data, horário e serviço do seu agendamento</h2>

                        <p>Selecione a data e o horário disponível para o seu atendimento.</p>
                      </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.dateTimeGrid}>
                      <div>
                        <p className={styles.columnDescription}>
                          Selecione no calendário abaixo o dia em que você deseja agendar seu atendimento.
                        </p>

                        <div className={styles.calendarHeader}>
                          <button
                            type="button"
                            className={styles.calendarNavButton}
                            onClick={handlePreviousMonth}>
                            <IconChevronLeft size={18} stroke={1.8} />
                          </button>

                          <div className={styles.calendarSelects}>
                            <select
                              value={calendarDate.month}
                              onChange={(event) =>
                                setCalendarDate((current) => ({
                                  ...current,
                                  month: Number(event.target.value)
                                }))
                              }>
                              {months.map((month, index) => (
                                <option key={month} value={index}>
                                  {month}
                                </option>
                              ))}
                            </select>

                            <select
                              value={calendarDate.year}
                              onChange={(event) =>
                                setCalendarDate((current) => ({
                                  ...current,
                                  year: Number(event.target.value)
                                }))
                              }>
                              {[today.getFullYear(), today.getFullYear() + 1].map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            className={styles.calendarNavButton}
                            onClick={handleNextMonth}>
                            <IconChevronRight size={18} stroke={1.8} />
                          </button>
                        </div>

                        <div className={styles.weekdaysRow}>
                          {weekDays.map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>

                        <div className={styles.daysGrid}>
                          {calendarDays.map((calendarDay) => (
                            <button
                              key={`${calendarDay.year}-${calendarDay.month}-${calendarDay.day}`}
                              type="button"
                              className={`${styles.day} ${!calendarDay.currentMonth ? styles.dayOtherMonth : ""} ${
                                calendarDay.currentMonth && calendarDay.day === selectedDay
                                  ? styles.daySelected
                                  : ""
                              }`}
                              onClick={() => calendarDay.currentMonth && setSelectedDay(calendarDay.day)}>
                              {calendarDay.day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className={styles.columnDescription}>
                          Selecione abaixo o horário disponível que você deseja agendar seu atendimento.
                        </p>

                        <div className={styles.timeFields}>
                          <div className={styles.timeField}>
                            <label htmlFor="start-time">Horário de início</label>

                            <input
                              id="start-time"
                              type="time"
                              value={startTime}
                              onChange={(event) => setStartTime(event.target.value)}
                            />
                          </div>

                          <div className={styles.timeField}>
                            <label htmlFor="end-time">Horário de término</label>

                            <input
                              id="end-time"
                              type="time"
                              value={endTime}
                              onChange={(event) => setEndTime(event.target.value)}
                            />
                          </div>
                        </div>

                        <div className={styles.intervalField}>
                          <label htmlFor="interval">Intervalo</label>

                          <input id="interval" type="text" value="12:00 – 13:00" readOnly />
                        </div>

                        <h3 className={styles.slotsTitle}>Horários disponíveis</h3>

                        <div className={styles.slotsGrid}>
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className={`${styles.slot} ${slot === selectedTime ? styles.slotSelected : ""}`}
                              onClick={() => setSelectedTime(slot)}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                      <div className={styles.icon}>
                        <IconListDetails size={18} stroke={1.8} />
                      </div>

                      <div>
                        <h2>Serviços oferecidos</h2>

                        <p>Selecione abaixo o serviço desejado para o seu atendimento.</p>
                      </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.servicesList}>
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          className={`${styles.serviceItem} ${
                            service.id === selectedService ? styles.serviceItemSelected : ""
                          }`}
                          onClick={() => setSelectedService(service.id)}>
                          <div
                            className={`${styles.serviceRadio} ${
                              service.id === selectedService ? styles.serviceRadioSelected : ""
                            }`}>
                            {service.id === selectedService && <div className={styles.serviceRadioDot}></div>}
                          </div>

                          <div className={styles.serviceInfo}>
                            <strong>{service.name}</strong>

                            <p>
                              {service.duration}&nbsp;&nbsp;|&nbsp;&nbsp;{service.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                      <div className={styles.icon}>
                        <IconUser size={18} stroke={1.8} />
                      </div>

                      <div>
                        <h2>Seus dados</h2>

                        <p>Preencha suas informações para confirmarmos o seu agendamento.</p>
                      </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.field}>
                      <label htmlFor="name">Nome completo</label>

                      <input {...register("name")} id="name" type="text" placeholder="Ex.: João da Silva" />

                      {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="phone">Telefone</label>

                      <input
                        {...registerWithMask("phone", "phone-br")}
                        id="phone"
                        type="text"
                        placeholder="Ex.: (11) 91234-5678"
                      />

                      {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="email">E-mail</label>

                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="Ex.: seuemail@email.com"
                      />

                      {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                      <div className={styles.icon}>
                        <IconClipboardCheck size={18} stroke={1.8} />
                      </div>

                      <div>
                        <h2>Revisão do agendamento</h2>

                        <p>Confira todas as informações antes de confirmar o seu agendamento.</p>
                      </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryBox}>
                        <h3>Data e horário</h3>

                        <div className={styles.summaryRow}>
                          <span>Data</span>

                          <strong>
                            {selectedDay
                              ? `${selectedDay} de ${months[calendarDate.month]} de ${calendarDate.year}`
                              : "Não selecionada"}
                          </strong>
                        </div>

                        <div className={styles.summaryRow}>
                          <span>Horário</span>

                          <strong>{selectedTime ?? "Não selecionado"}</strong>
                        </div>

                        <div className={styles.summaryRow}>
                          <span>Serviço</span>

                          <strong>
                            {selectedServiceData
                              ? `${selectedServiceData.name} – ${selectedServiceData.price}`
                              : "Não selecionado"}
                          </strong>
                        </div>
                      </div>

                      <div className={styles.summaryBox}>
                        <h3>Seus dados</h3>

                        <div className={styles.summaryRow}>
                          <span>Nome</span>

                          <strong>{getValues("name") || "Não informado"}</strong>
                        </div>

                        <div className={styles.summaryRow}>
                          <span>Telefone</span>

                          <strong>{getValues("phone") || "Não informado"}</strong>
                        </div>

                        <div className={styles.summaryRow}>
                          <span>E-mail</span>

                          <strong>{getValues("email") || "Não informado"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.actions}>
                  {step === 1 ? (
                    <button type="button" className={styles.cancelButton}>
                      Cancelar
                    </button>
                  ) : (
                    <button type="button" className={styles.cancelButton} onClick={() => setStep(step - 1)}>
                      Voltar
                    </button>
                  )}

                  {step < 4 ? (
                    <button type="button" className={styles.continueButton} onClick={handleContinue}>
                      Continuar
                    </button>
                  ) : (
                    <button type="button" className={styles.continueButton} onClick={handleConfirmBooking}>
                      Confirmar agendamento
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>
                  <IconCircleCheck size={40} stroke={1.5} />
                </div>

                <h2>Agendamento realizado com sucesso!</h2>

                <p>
                  Seu horário com a Barbearia NJ foi reservado para o dia {selectedDay} de{" "}
                  {months[calendarDate.month]} às {selectedTime}.
                </p>

                <button type="button" className={styles.continueButton} onClick={handleNewBooking}>
                  Fazer novo agendamento
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default Booking
