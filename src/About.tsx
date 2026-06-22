import styles from './About.module.css';

// ===========================================================
// About.tsx
// Página "Sobre o Agendei.com" — apresenta missão, visão,
// valores e os membros da equipe desenvolvedora
// ===========================================================

// --- Ícones SVG inline ---

function IconHome() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.7-3.5 3.3-5.5 6.5-5.5s5.8 2 6.5 5.5" strokeLinecap="round" />
      <path d="M16 9.5a3 3 0 1 0 0-6" strokeLinecap="round" />
      <path d="M15.5 14.7c2.6.4 4.5 2.2 5 5.3" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Ícone de pessoa usado nos cards de Missão/Visão/Valores e no título da equipe
function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

// Dados dos cards de Missão, Visão e Valores
const mvv = [
  {
    title: 'Missão',
    text: 'Simplificar a gestão de agendamentos e informações empresariais, proporcionando mais organização, eficiência e qualidade no atendimento.',
  },
  {
    title: 'Visão',
    text: 'Ser referência em soluções de gestão de agendamentos, ajudando empresas de diferentes segmentos a crescerem com mais organização.',
  },
  {
    title: 'Valores',
    text: 'Valorizamos a simplicidade, a inovação e o compromisso com nossos usuários, desenvolvendo soluções que promovam organização, produtividade e uma melhor experiência de atendimento.',
  },
];

// Dados dos membros da equipe
const team = [
  { name: 'Vitor Felipe',     role: 'Designer'       },
  { name: 'Vitor Felício',    role: 'Back-end'        },
  { name: 'Nelson Francisco', role: 'Front-end'       },
  { name: 'Lucas Alves',      role: 'Documentação'    },
  { name: 'Moises Marques',   role: 'Front-End'        },
];

export function About() {
  return (
    <div className={styles.page}>
      {/* ----------------------- SIDEBAR ----------------------- */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.logo}>Agendei.com</div>
          <nav className={styles.nav}>
            <button className={styles.navItemActive} type="button">
              <IconHome />
              Home
            </button>
            <button className={styles.navItem} type="button">
              <IconCalendar />
              Agendas
            </button>
            <button className={styles.navItem} type="button">
              <IconUsers />
              Clientes
            </button>
            <button className={styles.navItem} type="button">
              <IconSettings />
              Configurações
            </button>
          </nav>
        </div>

        <div className={styles.userBox}>
          <div className={styles.avatar} />
          <div>
            <div className={styles.userName}>Dom Comédia</div>
            <div className={styles.userEmail}>dcomedia@gmail.com</div>
          </div>
        </div>
      </aside>

      {/* -------------------- CONTEÚDO PRINCIPAL -------------------- */}
      <main className={styles.main}>
        <div className={styles.card}>

          {/* ----- Título e parágrafos de apresentação ----- */}
          <h1 className={styles.title}>Sobre o Agendei.com</h1>

          <p className={styles.paragraph}>
            O Agendei.com é um sistema desenvolvido como Trabalho de Conclusão de Curso com o
            objetivo de facilitar a gestão de agendamentos, clientes e informações empresariais.
          </p>
          <p className={styles.paragraph}>
            Nosso propósito é oferecer uma solução simples, intuitiva e eficiente para organizar
            a rotina de empresas que precisam otimizar seu tempo e melhorar o atendimento aos
            clientes.
          </p>

          {/* ----- Cards de Missão, Visão e Valores ----- */}
          <div className={styles.mvvGrid}>
            {mvv.map((item) => (
              <div className={styles.mvvCard} key={item.title}>
                <div className={styles.mvvHeader}>
                  <div className={styles.mvvIcon}>
                    <IconPerson />
                  </div>
                  <span className={styles.mvvTitle}>{item.title}</span>
                </div>
                <p className={styles.mvvText}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* ----- Seção Nossa Equipe ----- */}
          <div className={styles.teamSection}>
            <div className={styles.teamHeader}>
              {/* Ícone + título + linha decorativa verde */}
              <svg className={styles.teamIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
              <span className={styles.teamTitle}>Nossa equipe</span>
              <div className={styles.teamDivider} />
            </div>

            <div className={styles.teamGrid}>
              {team.map((member) => (
                <div className={styles.teamMember} key={member.name}>
                  {/* Foto circular — substituir src pelo caminho real da foto */}
                  <div className={styles.memberPhoto} />
                  <span className={styles.memberName}>{member.name}</span>
                  <span className={styles.memberRole}>{member.role}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default About;