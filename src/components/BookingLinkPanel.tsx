import { useState } from "react"
import { Link } from "react-router-dom"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { bookingLinkApi } from "@/lib/api"
import styles from "@/pages/Management.module.css"

const loadLink = (signal: AbortSignal) => bookingLinkApi.get(signal)
export function BookingLinkPanel() {
  const link = useApiData(loadLink)
  const [copied, setCopied] = useState("")
  async function copy() {
    if (!link.data?.url) return
    try {
      await navigator.clipboard.writeText(link.data.url)
      setCopied("Link copiado.")
    } catch {
      setCopied("Não foi possível copiar automaticamente. Selecione o endereço acima para copiar.")
    }
  }
  return (
    <section className={styles.card} aria-label="Link de agendamento">
      <h2>Link de agendamento</h2>
      <p>Compartilhe este endereço para seus clientes agendarem sem login.</p>
      <ApiFeedback
        loading={link.loading}
        error={link.status === 422 ? undefined : link.error}
        retry={link.reload}
      />
      {link.status === 422 && (
        <p role="alert">
          Cadastre ao menos <Link to="/servicos">um serviço</Link> e{" "}
          <Link to="/nova-agenda">um dia de atendimento</Link> para liberar o link.{" "}
          <button type="button" onClick={link.reload}>
            Consultar novamente
          </button>
        </p>
      )}
      {link.data && (
        <>
          <label className={styles.field}>
            Endereço público
            <input readOnly value={link.data.url} onFocus={(event) => event.currentTarget.select()} />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={() => void copy()}>
              Copiar link
            </button>
            <a className={styles.button} href={link.data.url} target="_blank" rel="noopener noreferrer">
              Abrir página pública
            </a>
          </div>
          {copied && <p role="status">{copied}</p>}
        </>
      )}
    </section>
  )
}
