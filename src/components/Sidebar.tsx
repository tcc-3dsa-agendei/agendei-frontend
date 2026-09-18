import {
  IconCalendarEvent,
  IconEdit,
  IconHome,
  IconLogout,
  IconUserCircle,
  IconUsers
} from "@tabler/icons-react"
import { Navigate, NavLink, useNavigate } from "react-router-dom"
import { auth } from "@/lib/auth"
import styles from "./Sidebar.module.css"

export function Sidebar() {
  const navigate = useNavigate()
  const { data, isPending } = auth.useSession()

  if (isPending) {
    return <p>Carregando sessão do usuário...</p>
  }

  if (!data?.user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    const { error } = await auth.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login", { replace: true })
        }
      }
    })

    if (error) {
      alert(`Erro ao sair da conta: ${error.message}`)
      return
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div>
        <h1 className={styles.logo}>Agendei.com</h1>

        <nav className={styles.menu}>
          <NavLink to="/home" className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconHome />
            Home
          </NavLink>

          <NavLink to="/agenda" className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconCalendarEvent />
            Agendas
          </NavLink>

          <NavLink to="/clientes" className={({ isActive }) => (isActive ? styles.active : styles.text)}>
            <IconUsers />
            Clientes
          </NavLink>
        </nav>
      </div>

      <div className={styles.userContainer}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <IconUserCircle />
          </div>

          <div className={styles.userInfo}>
            <h4>{data.user.name}</h4>
            <span>{data.user.email}</span>
          </div>
        </div>

        <div className={styles.userMenu}>
          <NavLink to="/profile">
            <IconEdit />
            Editar perfil
          </NavLink>

          <button type="button" onClick={handleLogout}>
            <IconLogout />
            Sair da conta
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
