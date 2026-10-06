import { IconMenu2 } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"
import styles from "./MainLayout.module.css"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  function closeMenu() {
    setMenuOpen(false)
  }
  useEffect(() => {
    if (wasOpen.current && !menuOpen && trigger.current?.getClientRects().length) trigger.current.focus()
    wasOpen.current = menuOpen
  }, [menuOpen])
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)")
    const onChange = () => setMenuOpen(false)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#main-content">
        Ir para o conteúdo
      </a>
      {menuOpen && <div className={styles.backdrop} aria-hidden="true" onClick={closeMenu} />}
      <Sidebar mobileOpen={menuOpen} onClose={closeMenu} />
      <div className={styles.content} inert={menuOpen}>
        <div className={styles.mobileHeader}>
          <button
            ref={trigger}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation">
            <IconMenu2 size={20} aria-hidden="true" /> Menu
          </button>
          <span>Agendei.com</span>
        </div>
        <main id="main-content" tabIndex={-1} className={styles.main}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
export default MainLayout
