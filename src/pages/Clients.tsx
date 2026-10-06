import { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { ApiFeedback } from "@/components/ApiFeedback"
import { AppointmentTable } from "@/components/AppointmentTable"
import { useApiData } from "@/hooks/use-api-data"
import { MainLayout } from "@/layout/MainLayout"
import { appointmentsApi } from "@/lib/api"
import { statusLabels } from "@/lib/appointment-status"
import { addDays, businessDate, toBusinessISO } from "@/lib/date-utils"
import styles from "./Management.module.css"

export function Clients() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [page, setPage] = useState(1)
  const invalidRange = Boolean(from && to && from > to)
  const hasFilters = Boolean(search || status || from || to)
  // The API filters dates only. Fetch all pages before applying name/status filters or statistics.
  const resource = useApiData(
    useCallback(
      (signal: AbortSignal) =>
        invalidRange
          ? Promise.resolve([])
          : appointmentsApi.listAll(
              {
                from: from ? toBusinessISO(from) : undefined,
                to: to ? toBusinessISO(addDays(to, 1)) : undefined
              },
              signal
            ),
      [from, to, invalidRange]
    )
  )
  const appointments = resource.data ?? []
  const normalized = search.trim().toLocaleLowerCase("pt-BR")
  const phone = search.replace(/\D/g, "")
  const filtered = appointments.filter(
    (item) =>
      (!status || item.status === status) &&
      (!normalized ||
        item.customerName.toLocaleLowerCase("pt-BR").includes(normalized) ||
        (phone.length > 0 && item.customerPhone.replace(/\D/g, "").includes(phone)))
  )
  const lastPage = Math.max(1, Math.ceil(filtered.length / 20))
  const currentPage = Math.min(page, lastPage)
  const statistics = [
    {
      label: "Clientes únicos no período",
      value: new Set(appointments.map((item) => item.customerPhone)).size
    },
    {
      label: "Agendamentos hoje no período",
      value: appointments.filter((item) => businessDate(new Date(item.startAt)) === businessDate()).length
    },
    {
      label: "Confirmados no período",
      value: appointments.filter((item) => item.status === "confirmed").length
    },
    {
      label: "Pendentes no período",
      value: appointments.filter((item) => item.status === "scheduled").length
    }
  ]
  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Clientes e reservas</h1>
            <p>Consulte os atendimentos e atualize a situação das reservas.</p>
          </div>
          <Link className={styles.button} to="/agendar">
            Novo agendamento
          </Link>
        </header>
        {resource.data && !invalidRange && (
          <section className={styles.stats}>
            {statistics.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <strong>{stat.value}</strong>
                {stat.label}
              </div>
            ))}
          </section>
        )}
        <section className={styles.card}>
          <div className={styles.filters}>
            <label className={styles.field}>
              Nome ou telefone
              <input
                type="search"
                placeholder="Ex.: João ou (11) 91234-5678"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </label>
            <label className={styles.field}>
              Status
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value)
                  setPage(1)
                }}>
                <option value="">Todos</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              De
              <input
                type="date"
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value)
                  setPage(1)
                }}
              />
            </label>
            <label className={styles.field}>
              Até (inclusive)
              <input
                type="date"
                value={to}
                aria-invalid={invalidRange}
                aria-describedby={invalidRange ? "date-range-error" : undefined}
                onChange={(event) => {
                  setTo(event.target.value)
                  setPage(1)
                }}
              />
            </label>
            <button
              type="button"
              className={styles.secondary}
              disabled={!hasFilters}
              onClick={() => {
                setSearch("")
                setStatus("")
                setFrom("")
                setTo("")
                setPage(1)
              }}>
              Limpar filtros
            </button>
          </div>
          {invalidRange ? (
            <p id="date-range-error" className={styles.error} role="alert">
              A data final deve ser igual ou posterior à inicial.
            </p>
          ) : (
            <>
              <ApiFeedback loading={resource.loading} error={resource.error} retry={resource.reload} />
              {resource.data && (
                <>
                  <AppointmentTable
                    appointments={filtered.slice((currentPage - 1) * 20, currentPage * 20)}
                    onChange={resource.reload}
                    emptyMessage={
                      appointments.length
                        ? "Nenhuma reserva corresponde aos filtros. Ajuste a busca ou limpe os filtros."
                        : "Nenhuma reserva neste período. Selecione outras datas ou crie um agendamento."
                    }
                  />
                  <nav className={styles.pagination} aria-label="Páginas de agendamentos">
                    <span>{filtered.length} agendamento(s)</span>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}>
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de {lastPage}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === lastPage}
                      onClick={() => setPage(currentPage + 1)}>
                      Próxima
                    </button>
                  </nav>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </MainLayout>
  )
}
