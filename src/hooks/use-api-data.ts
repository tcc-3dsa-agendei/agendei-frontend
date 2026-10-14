import { useEffect, useState } from "react"
import { ApiError, errorMessage } from "@/lib/api"

// Callers memoize load. Hide previous data immediately when the request changes.
export function useApiData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState<{
    load: typeof load
    revision: number
    data?: T
    error?: string
    status?: number
  }>()
  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve()
      .then(() => load(controller.signal))
      .then(
        (data) => {
          if (!controller.signal.aborted) setResult({ load, revision, data })
        },
        (error) => {
          if (!controller.signal.aborted)
            setResult({
              load,
              revision,
              error: errorMessage(error),
              status: error instanceof ApiError ? error.status : undefined
            })
        }
      )
    return () => controller.abort()
  }, [load, revision])
  const current = result?.load === load && result.revision === revision
  return {
    data: current ? result.data : undefined,
    error: current ? result.error : undefined,
    status: current ? result.status : undefined,
    loading: !current,
    reload: () => setRevision((value) => value + 1)
  }
}
