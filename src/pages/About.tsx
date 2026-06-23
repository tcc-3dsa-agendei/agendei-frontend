import styles from './About.module.css';
import { MainLayout } from '../layout/MainLayout'

// ===========================================================
// About.tsx
// Página "Sobre o Agendei.com" — apresenta missão, visão,
// valores e os membros da equipe desenvolvedora
// ===========================================================

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
  { name: 'Moises Marques',   role: 'Designer'        },
];

export function About() {
  return (
    <MainLayout>

    <div className={styles.page}>
      

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
              <IconPerson />
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
    </MainLayout>
  );
}

export default About;