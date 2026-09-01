import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import {
    IconHome,
    IconCalendarEvent,
    IconUsers,
    IconInfoCircle,
    IconUserCircle
} from '@tabler/icons-react'

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
                        <IconHome />
                        Home
                    </NavLink>

                    <NavLink
                        to="/agenda"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        <IconCalendarEvent />
                        Agendas
                    </NavLink>

                    <NavLink
                        to="/clientes"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        <IconUsers />
                        Clientes
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.text
                        }
                    >
                        <IconInfoCircle />
                        Sobre nós
                    </NavLink>

                </nav>

            </div>

            <div className={styles.user}>

                <div className={styles.avatar}>
                    <IconUserCircle />
                </div>

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