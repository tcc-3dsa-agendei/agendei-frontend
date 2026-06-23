import styles from './Sidebar.module.css'

export function Sidebar() {
    return (

        <aside className={styles.sidebar}>

            <div>

                <h1 className={styles.logo}>
                    Agendei.com
                </h1>

                <nav className={styles.menu}>

                    <a href="#" className={styles.active}>
                         Home
                    </a>

                    <a href="#" className={styles.text}>
                         Sobre nós
                    </a>

                    <a href="#" className={styles.text}>
                         Agendas
                    </a>

                    <a href="#" className={styles.text}>
                         Clientes
                    </a>

                    <a href="#" className={styles.text}>
                         Configurações
                    </a>

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