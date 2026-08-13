import styles from './Home.module.css';
import { MainLayout } from '../layout/MainLayout'
import notebook from "../assets/notebook.jpg";

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



function IconBarChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M22 18h0" strokeLinecap="round" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dados das funcionalidades exibidas na grade central da página.
// Mantidos em um array para facilitar manutenção/futuras edições.
const features = [
  {
    icon: <IconCalendar />,
    title: 'Gestão de Agendamentos',
    text: 'Crie, edite e gerencie agendamentos de forma prática e rápida',
  },
  {
    icon: <IconUsers />,
    title: 'Gestão de Clientes',
    text: 'Mantenha todas as informações dos seus clientes organizadas',
  },
  {
    icon: <IconBarChart />,
    title: 'Relatórios',
    text: 'Acompanhe estatísticas e indicadores importantes do seu negócio',
  },
  {
    icon: <IconSliders />,
    title: 'Personalização',
    text: 'Configure serviços, horários e preferências de acordo com sua necessidade',
  },
];

export function Home() {
  return (
    <MainLayout>

    <div className={styles.page}>

      <main className={styles.main}>
        {/* ----- Seção Hero (apresentação inicial) ----- */}
        <section className={styles.hero}>

          <div className={styles.heroContent}>

              <p className={styles.eyebrow}>
                  Bem-vindo ao Agendei.com
              </p>

              <h1 className={styles.title}>
                  Organize seus agendamentos
                  <br />
                  de forma simples e eficiente
              </h1>

              <p className={styles.description}>
                  O Agendei.com é uma plataforma completa para gerenciar
                  clientes, serviços e horários em um só lugar, facilitando
                  o dia a dia da sua empresa.
              </p>

              <div className={styles.ctaGroup}>
                  <button className={styles.btnPrimary} type="button">
                      Saiba mais
                  </button>

                  <button className={styles.btnSecondary} type="button">
                      Acessar agenda
                  </button>
              </div>

          </div>

          <div className={styles.heroImageWrapper}>

          <img
              className={styles.heroImage}
              src={notebook}
              alt="Notebook com código"
          />


        </div>


        </section>

        {/* ----- Seção de funcionalidades principais ----- */}
        <section className={styles.featuresSection}>
          <h2 className={styles.featuresTitle}>Principais Funcionalidades</h2>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div className={styles.featureCard} key={feature.title}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----- Rodapé: destaque de produto + assinatura da marca ----- */}
        <section className={styles.footerSection}>
          <div className={styles.footerCard}>
            <div className={styles.footerIcon}>
              <IconClock />
            </div>
            <div>
              <h4 className={styles.footerCardTitle}>Mais tempo para o que realmente importa</h4>
              <p className={styles.footerCardText}>
                Criado para ajudar empresas a otimizar seu tempo, melhorarem a experiência dos
                clientes e aumentarem a produtividade
              </p>
            </div>
          </div>

          <div className={styles.footerCard}>
            <div className={styles.footerIcon}>
              <span style={{ fontWeight: 700, color: '#1b4d47' }}>A</span>
            </div>
            <div>
              <h4 className={styles.brandName}>Agendei.com</h4>
              <p className={styles.brandQuote}>
                "Transformando a gestão de agendamentos em uma experiência simples, organizada e
                eficiente."
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
    </MainLayout>
  );
}

export default Home;
