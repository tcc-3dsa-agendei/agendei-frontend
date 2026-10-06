import {
  IconCalendarEvent,
  IconEdit,
  IconHome,
  IconListDetails,
  IconLogout,
  IconUserCircle,
  IconUsers
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { auth } from "@/lib/auth"
import styles from "./Sidebar.module.css"

export function Sidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const agendaActive = ["/agenda", "/nova-agenda", "/agendar"].includes(pathname)
  const { data } = auth.useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const sidebar = useRef<HTMLElement>(null)
  const userContainer = useRef<HTMLDivElement>(null)
  const userTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])
  useEffect(() => {
    if (!userMenuOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!userContainer.current?.contains(event.target as Node)) setUserMenuOpen(false)
    }
    const closeOnFocusOut = (event: FocusEvent) => {
      if (!userContainer.current?.contains(event.relatedTarget as Node)) setUserMenuOpen(false)
    }
    const container = userContainer.current
    document.addEventListener("pointerdown", closeOutside)
    container?.addEventListener("focusout", closeOnFocusOut)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      container?.removeEventListener("focusout", closeOnFocusOut)
    }
  }, [userMenuOpen])
  function closeNavigation() {
    setUserMenuOpen(false)
    if (mobileOpen) onClose?.()
  }

  const [logoutError, setLogoutError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const handleLogout = async () => {
    setLoggingOut(true)
    setLogoutError("")
    try {
      const { error } = await auth.signOut()
      if (error) {
        setLogoutError(error.message ?? "Não foi possível sair da conta.")
        return
      }
      navigate("/login", { replace: true })
    } catch {
      setLogoutError("Não foi possível conectar ao servidor. Tente novamente.")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside
      ref={sidebar}
      id="main-navigation"
      aria-label="Navegação principal"
      className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation()
          if (userMenuOpen) {
            setUserMenuOpen(false)
            userTrigger.current?.focus()
          } else onClose?.()
        }
        if (mobileOpen && event.key === "Tab") {
          const elements = sidebar.current?.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")
          const visible = Array.from(elements ?? []).filter((element) => element.getClientRects().length)
          const first = visible[0],
            last = visible.at(-1)
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }
      }}>
      <div>
        <button type="button" className={styles.closeMenu} onClick={onClose}>
          Fechar menu
        </button>
        <h1 className={styles.logo}>Agendei.com</h1>

        <nav className={styles.menu} aria-label="Páginas">
          <NavLink
            to="/home"
            onClick={closeNavigation}
            className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconHome />
            Início
          </NavLink>

          <Link
            to="/agenda"
            onClick={closeNavigation}
            aria-current={agendaActive ? "page" : undefined}
            className={agendaActive ? styles.active : styles.text}>
            <IconCalendarEvent />
            Agendas
          </Link>

          <NavLink
            to="/servicos"
            onClick={closeNavigation}
            className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconListDetails />
            Serviços
          </NavLink>

          <NavLink
            to="/clientes"
            onClick={closeNavigation}
            className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconUsers />
            Clientes
          </NavLink>
        </nav>
      </div>

      <div ref={userContainer} className={styles.userContainer}>
        <button
          ref={userTrigger}
          type="button"
          className={styles.user}
          aria-expanded={userMenuOpen}
          aria-controls="account-actions"
          onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <span className={styles.avatar}>
            <IconUserCircle />
          </span>

          <span className={styles.userInfo}>
            <strong>{data?.user.name}</strong>
            <span>{data?.user.email}</span>
          </span>
        </button>

        <div id="account-actions" className={styles.userMenu} hidden={!userMenuOpen}>
          <NavLink to="/profile" onClick={closeNavigation}>
            <IconEdit />
            Meu perfil
          </NavLink>

          {logoutError && <p role="alert">{logoutError}</p>}
          <button type="button" disabled={loggingOut} onClick={handleLogout}>
            <IconLogout />
            {loggingOut ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
