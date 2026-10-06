import { useState } from "react"
import { businessDate, weekDayForDate, weekDays } from "@/lib/date-utils"
import styles from "@/pages/Management.module.css"
import type { Schedule } from "@/types/api"

export function BookingCalendar({
  date,
  schedules,
  onChange
}: {
  date: string
  schedules: Schedule[]
  onChange: (date: string) => void
}) {
  const today = businessDate()
  const [month, setMonth] = useState(date.slice(0, 7))
  const first = `${month}-01`
  const monthDate = new Date(`${first}T12:00:00Z`)
  const count = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0)).getUTCDate()
  const offset = weekDayForDate(first)
  const title = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", month: "long", year: "numeric" }).format(
    monthDate
  )
  function changeMonth(amount: number) {
    monthDate.setUTCMonth(monthDate.getUTCMonth() + amount)
    setMonth(monthDate.toISOString().slice(0, 7))
  }
  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          aria-label="Mês anterior"
          disabled={month <= today.slice(0, 7)}
          onClick={() => changeMonth(-1)}>
          ‹
        </button>
        <strong aria-live="polite">{title}</strong>
        <button type="button" aria-label="Próximo mês" onClick={() => changeMonth(1)}>
          ›
        </button>
      </div>
      <div className={styles.days}>
        {weekDays.map((day) => (
          <span key={day}>{day.slice(0, 3)}</span>
        ))}
        {Array.from({ length: offset }, (_, index) => index).map((index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: count }, (_, index) => index + 1).map((day) => {
          const value = `${month}-${String(day).padStart(2, "0")}`
          const enabled =
            value >= today && schedules.some((schedule) => schedule.weekDay === weekDayForDate(value))
          return (
            <button
              key={value}
              type="button"
              className={styles.secondary}
              data-day={day}
              aria-label={new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
                dateStyle: "full"
              }).format(new Date(`${value}T12:00:00Z`))}
              aria-pressed={date === value}
              disabled={!enabled}
              onKeyDown={(event) => {
                const moves: Record<string, number> = {
                  ArrowLeft: -1,
                  ArrowRight: 1,
                  ArrowUp: -7,
                  ArrowDown: 7
                }
                const parent = event.currentTarget.parentElement
                if (event.key === "Home" || event.key === "End") {
                  event.preventDefault()
                  const rowStart = day - ((offset + day - 1) % 7)
                  const buttons = Array.from(
                    parent?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []
                  ).filter(
                    (button) =>
                      Number(button.dataset.day) >= rowStart && Number(button.dataset.day) < rowStart + 7
                  )
                  ;(event.key === "Home" ? buttons[0] : buttons.at(-1))?.focus()
                  return
                }
                const move = moves[event.key]
                if (!move) return
                event.preventDefault()
                for (let next = day + move; next >= 1 && next <= count; next += move) {
                  const button = parent?.querySelector<HTMLButtonElement>(`button[data-day="${next}"]`)
                  if (button && !button.disabled) {
                    button.focus()
                    break
                  }
                }
              }}
              onClick={() => onChange(value)}>
              {day}
            </button>
          )
        })}
      </div>
      <p>Dias sem expediente e datas passadas ficam indisponíveis.</p>
    </div>
  )
}
