import styles from "@/pages/Management.module.css"
export function ApiFeedback({
  loading,
  error,
  retry,
  loadingMessage = "Carregando..."
}: {
  loading: boolean
  error?: string
  retry: () => void
  loadingMessage?: string
}) {
  if (loading) return <p role="status">{loadingMessage}</p>
  if (error)
    return (
      <div className={`${styles.error} ${styles.feedback}`} role="alert">
        <span>{error}</span>
        <button type="button" onClick={retry}>
          Tentar novamente
        </button>
      </div>
    )
  return null
}
