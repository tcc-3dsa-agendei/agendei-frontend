import { IconCalendarEvent, IconClock, IconListDetails, IconSettings, IconUsers } from "@tabler/icons-react"
import { Link, useNavigate } from "react-router-dom"
import form from "../assets/form.png"
import logo from "../assets/logo.png"
import notebook from "../assets/notebook.jpg"
import { MainLayout } from "../layout/MainLayout"
import styles from "./Home.module.css"

export function Home() {
  const navigate = useNavigate()
  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Bem-vindo ao Agendei.com</p>

              <h1 className={styles.title}>
                Organize seus agendamentos
                <br />
                de forma simples e eficiente
              </h1>

              <p className={styles.description}>
                O Agendei.com é uma plataforma completa para gerenciar clientes, serviços e horários em um só
                lugar, facilitando o dia a dia da sua empresa.
              </p>

              <div className={styles.ctaGroup}>
                <button type="button" className={styles.btnPrimary} onClick={() => navigate("/agendar")}>
                  Agendar atendimento
                </button>

                <button type="button" className={styles.btnSecondary} onClick={() => navigate("/agenda")}>
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
            <img src={form} alt="" className={styles.topDecorative} />

            <h2 className={styles.featuresTitle}>Acessos rápidos</h2>

            <div className={styles.featuresLine}>
              <span></span>
            </div>

            <div className={styles.featuresGrid}>
              <Link to="/agenda" className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <IconCalendarEvent />
                </div>

                <h3 className={styles.featureTitle}>Gestão de Agendamentos</h3>

                <p className={styles.featureText}>
                  Consulte os atendimentos e configure os dias e horários de expediente.
                </p>
              </Link>

              <Link to="/clientes" className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <IconUsers />
                </div>

                <h3 className={styles.featureTitle}>Gestão de Clientes</h3>

                <p className={styles.featureText}>
                  Encontre clientes e acompanhe a situação de suas reservas.
                </p>
              </Link>

              <Link to="/servicos" className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <IconListDetails />
                </div>

                <h3 className={styles.featureTitle}>Serviços</h3>

                <p className={styles.featureText}>Cadastre serviços e revise duração, descrição e preço.</p>
              </Link>

              <Link to="/profile" className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <IconSettings />
                </div>

                <h3 className={styles.featureTitle}>Meu perfil</h3>

                <p className={styles.featureText}>
                  Confira os dados da sua conta e as informações da empresa.
                </p>
              </Link>
            </div>
          </section>

          <section className={styles.footerSection}>
            <div className={styles.footerCard}>
              <div className={styles.footerIcon}>
                <IconClock />
              </div>

              <div>
                <h4 className={styles.footerCardTitle}>Mais tempo para o que realmente importa</h4>

                <p className={styles.footerCardText}>
                  Criado para ajudar empresas a otimizar seu tempo, melhorarem a experiência dos clientes e
                  aumentarem a produtividade.
                </p>
              </div>
            </div>

            <div className={styles.footerCard}>
              <div className={styles.footerIcon}>
                <img src={logo} alt="Agendei.com" className={styles.logo} />
              </div>

              <div>
                <h4 className={styles.brandName}>Agendei.com</h4>

                <p className={styles.brandQuote}>
                  "Transformando a gestão de agendamentos em uma experiência simples, organizada e eficiente."
                </p>
              </div>
            </div>

            <img src={form} alt="" className={styles.bottomDecorative} />
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default Home
