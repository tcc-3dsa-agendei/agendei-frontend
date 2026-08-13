import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'

export function Sidebar() {
    return (

        <aside className={styles.sidebar}>

            <div>

                <h1 className={styles.logo}>
                    Agendei.com
                </h1>

                <nav className={styles.menu}>

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/agenda"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        Agendas
                    </NavLink>

                    <NavLink
                        to="/clientes"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        Clientes
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        Sobre nós
                    </NavLink>

                </nav>

            </div>

            <div className={styles.user}>

                <div className={styles.avatar}></div>

                <div>

                    <h4>Dom Comédia</h4>

                    <span>
                        dcomedia@gmail.com
                    </span>

                </div>

            </div>

        </aside>
    )
}

export default Sidebar