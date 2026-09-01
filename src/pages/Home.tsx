import { MainLayout } from "../layout/MainLayout";
import styles from "./Home.module.css";
import notebook from "../assets/notebook.jpg"; 
import logo from "../assets/logo.png";
import form from "../assets/form.png";
import {
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconClock
} from "@tabler/icons-react";

export function Home() {
  return (
    <MainLayout>
      <div className={styles.page}>

        <main className={styles.main}>


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

                <button className={styles.btnPrimary}>
                  Saiba mais
                </button>

                <button className={styles.btnSecondary}>
                  Acessar agenda
                </button>

              </div>

            </div>

            <div className={styles.heroImageWrapper}>

              <img
                className={styles.heroImage}
                src={notebook}
                alt="Notebook com calendário de agendamentos"
              />

              <div className={styles.line}>
                <span></span>
              </div>

            </div>

          </section>



          <section className={styles.featuresSection}>

            <img
              src={form}
              alt="Formas"
              className={styles.topDecorative}
            />

            <h2 className={styles.featuresTitle}>
              Principais Funcionalidades
            </h2>

            <div className={styles.featuresLine}> 
              <span></span> 
              </div>

            <div className={styles.featuresGrid}>

              <div className={styles.featureCard}>

                <div className={styles.featureIcon}>
                  <IconCalendarEvent />
                </div>

                <h3 className={styles.featureTitle}>
                  Gestão de Agendamentos
                </h3>

                <p className={styles.featureText}>
                  Crie, edite e gerencie agendamentos de forma prática e rápida.
                </p>

              </div>


              <div className={styles.featureCard}>

                <div className={styles.featureIcon}>
                  <IconUsers />
                </div>

                <h3 className={styles.featureTitle}>
                  Gestão de Clientes
                </h3>

                <p className={styles.featureText}>
                  Mantenha todas as informações dos seus clientes organizadas.
                </p>

              </div>


              <div className={styles.featureCard}>

                <div className={styles.featureIcon}>
                  <IconChartBar />
                </div>

                <h3 className={styles.featureTitle}>
                  Relatórios
                </h3>

                <p className={styles.featureText}>
                  Acompanhe estatísticas e indicadores importantes do seu negócio.
                </p>

              </div>


              <div className={styles.featureCard}>

                <div className={styles.featureIcon}>
                  <IconSettings />
                </div>

                <h3 className={styles.featureTitle}>
                  Personalização
                </h3>

                <p className={styles.featureText}>
                  Configure serviços, horários e preferências de acordo com sua necessidade.
                </p>

              </div>

            </div>

          </section>



          <section className={styles.footerSection}>

            <div className={styles.footerCard}>

              <div className={styles.footerIcon}>
                <IconClock />
              </div>

              <div>

                <h4 className={styles.footerCardTitle}>
                  Mais tempo para o que realmente importa
                </h4>

                <p className={styles.footerCardText}>
                  Criado para ajudar empresas a otimizar seu tempo,
                  melhorarem a experiência dos clientes e aumentarem
                  a produtividade.
                </p>

              </div>

            </div>


            <div className={styles.footerCard}>

              <div className={styles.footerIcon}>
                <img
                  src={logo}
                  alt="Agendei.com"
                  className={styles.logo}
            />
              </div>

              <div>

                <h4 className={styles.brandName}>
                  Agendei.com
                </h4>

                <p className={styles.brandQuote}>
                  "Transformando a gestão de agendamentos em uma
                  experiência simples, organizada e eficiente."
                </p>

              </div>

            </div>

            <img
              src={form}
              alt="Formas"
              className={styles.bottomDecorative}
            />

          </section>

        </main>

      </div>
    </MainLayout>
  );
}

export default Home;