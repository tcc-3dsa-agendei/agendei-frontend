import { type FormEvent, useCallback, useState } from "react"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { useInterfaceFocus } from "@/hooks/use-interface-focus"
import { MainLayout } from "@/layout/MainLayout"
import { errorMessage, servicesApi } from "@/lib/api"
import { formatPrice } from "@/lib/date-utils"
import type { Service } from "@/types/api"
import styles from "./Management.module.css"

export function Services() {
  const [page, setPage] = useState(1)
  const resource = useApiData(
    useCallback((signal: AbortSignal) => servicesApi.list({ page, pageSize: 20 }, signal), [page])
  )
  const [editing, setEditing] = useState<Service | "new" | null>(null)
  const editor = useInterfaceFocus<HTMLFormElement>(editing, "input")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [invalidName, setInvalidName] = useState(false)
  const [message, setMessage] = useState("")
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name")).trim()
    const rawPrice = String(form.get("price"))
    const body = {
      name,
      description: String(form.get("description")).trim() || null,
      durationInMinutes: Number(form.get("duration")),
      price: rawPrice === "" ? null : Number(rawPrice)
    }
    if (!name) {
      setError("Informe o nome do serviço.")
      setInvalidName(true)
      event.currentTarget.querySelector<HTMLInputElement>('[name="name"]')?.focus()
      return
    }
    setBusy(true)
    setError("")
    setInvalidName(false)
    setMessage("")
    try {
      if (editing && editing !== "new") await servicesApi.update(editing.id, body)
      else await servicesApi.create(body)
      setEditing(null)
      setMessage("Serviço salvo.")
      setPage(1)
      resource.reload()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  async function remove(service: Service) {
    if (!window.confirm(`Excluir o serviço “${service.name}”?`)) return
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await servicesApi.delete(service.id)
      setMessage("Serviço excluído.")
      if (resource.data?.services.length === 1 && page > 1) setPage(page - 1)
      else resource.reload()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  const service = editing && editing !== "new" ? editing : undefined
  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Serviços</h1>
            <p>Gerencie os serviços oferecidos pela sua empresa.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setEditing("new")
              setError("")
              setMessage("")
              setInvalidName(false)
            }}>
            + Novo serviço
          </button>
        </header>
        {error && (
          <p id="service-error" role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" className={styles.success}>
            {message}
          </p>
        )}
        {editing && (
          <section className={styles.card}>
            <h2>{service ? "Editar serviço" : "Novo serviço"}</h2>
            <form ref={editor} key={service?.id ?? "new"} className={styles.form} onSubmit={save}>
              <label className={styles.field}>
                Nome
                <input
                  name="name"
                  required
                  maxLength={100}
                  defaultValue={service?.name}
                  aria-invalid={invalidName}
                  aria-describedby={invalidName ? "service-error" : undefined}
                  onChange={() => {
                    if (invalidName) {
                      setInvalidName(false)
                      setError("")
                    }
                  }}
                />
              </label>
              <label className={styles.field}>
                Descrição
                <textarea name="description" defaultValue={service?.description ?? ""} />
              </label>
              <div className={styles.grid}>
                <label className={styles.field}>
                  Duração (minutos)
                  <input
                    name="duration"
                    type="number"
                    required
                    min={5}
                    max={1440}
                    step={1}
                    defaultValue={service?.durationInMinutes ?? 30}
                  />
                </label>
                <label className={styles.field}>
                  Preço (R$, opcional)
                  <input
                    name="price"
                    type="number"
                    min={0}
                    max={99999999.99}
                    step="0.01"
                    defaultValue={service?.price ?? ""}
                  />
                </label>
              </div>
              <div className={styles.actions}>
                <button type="submit" disabled={busy}>
                  {busy ? "Salvando..." : "Salvar serviço"}
                </button>
                <button
                  type="button"
                  className={styles.secondary}
                  disabled={busy}
                  onClick={() => setEditing(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
        <section className={styles.card}>
          <ApiFeedback loading={resource.loading} error={resource.error} retry={resource.reload} />
          {resource.data && (
            <>
              {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Scrollable tables need keyboard access. */}
              <section className={styles.table} aria-label="Lista de serviços" tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      <th>Serviço</th>
                      <th>Duração</th>
                      <th>Preço</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.data.services.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </td>
                        <td>{item.durationInMinutes} min</td>
                        <td>{formatPrice(item.price)}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.secondary}
                              disabled={busy}
                              onClick={() => {
                                setEditing(item)
                                setError("")
                                setInvalidName(false)
                              }}>
                              Editar
                            </button>
                            <button
                              type="button"
                              className={styles.danger}
                              disabled={busy}
                              onClick={() => void remove(item)}>
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {!resource.data.services.length && (
                <p>Nenhum serviço cadastrado. Crie o primeiro serviço para começar a agendar.</p>
              )}
              <nav className={styles.pagination} aria-label="Páginas de serviços">
                <button type="button" disabled={busy || page === 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </button>
                <span>Página {page}</span>
                <button
                  type="button"
                  disabled={busy || !resource.data.pagination.hasNext}
                  onClick={() => setPage(page + 1)}>
                  Próxima
                </button>
              </nav>
            </>
          )}
        </section>
      </div>
    </MainLayout>
  )
}
