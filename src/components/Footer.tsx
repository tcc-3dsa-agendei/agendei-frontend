import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandCol}>
          <h3 className={styles.brandTitle}>
            Agendei<span>.com</span>
          </h3>
          <p className={styles.brandDescription}>
            Sua solução prática e rápida para agendamentos online. Simplificando a sua rotina diária.
          </p>
        </div>

        <div className={styles.contactCol}>
          <h4 className={styles.colTitle}>Suporte</h4>
          <ul className={styles.contactList}>
            <li>
              <a href="mailto:contato@agendei.com">contato@agendei.com</a>
            </li>
            <li>
              <span>Atendimento Segunda a Sexta</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottomBar}>
        <p>© 2026 Agendei.com — Todos os direitos reservados.</p>
        <p className={styles.academicNotice}>Trabalho acadêmico sem fins lucrativos.</p>
      </div>
    </footer>
  )
}

export default Footer
