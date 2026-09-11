import styles from './Footer.module.css'

export function Footer() {
    return (
        <footer className={styles.footer}>
            <p >
                © 2026 Agendei.com - Todos os direitos reservados
            </p>
            <p>
                Trabalho acadêmico sem fins lucrativos
            </p>
        </footer>
    )
}

export default Footer