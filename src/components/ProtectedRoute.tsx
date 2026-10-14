import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { SESSION_EXPIRED_EVENT } from "@/lib/api"
import { auth } from "@/lib/auth"

export function ProtectedRoute() {
  const { data, isPending, error, refetch } = auth.useSession()
  const [expired, setExpired] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const onExpired = () => {
      setExpired(true)
      void refetch()
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [refetch])
  if (expired || error?.status === 401)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (isPending) return <p role="status">Carregando sessão...</p>
  if (error)
    return (
      <div role="alert">
        Não foi possível verificar sua sessão.{" "}
        <button type="button" onClick={() => void refetch()}>
          Tentar novamente
        </button>
      </div>
    )
  if (!data?.user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <Outlet />
}
