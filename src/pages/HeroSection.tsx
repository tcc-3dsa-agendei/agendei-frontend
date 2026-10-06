import { IconChevronDown, IconEye, IconHeart, IconTarget, IconUser, IconUsers } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import form from "../assets/form.png"
import fundo from "../assets/fundo.jpg"
import logo from "../assets/logo.png"
import { Footer } from "../components/Footer"
import styles from "./HeroSection.module.css"

interface TeamMember {
  name: string
  role: string
  photo?: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Vitor Felipe",
    role: "Designer"
  },
  {
    name: "Vitor Felicio",
    role: "Back-end"
  },
  {
    name: "Nelson Francisco",
    role: "Front-end"
  },
  {
    name: "Lucas Alves",
    role: "Documentação"
  },
  {
    name: "Moises Marques",
    role: "Designer"
  }
]

export function HeroSection() {
  const handleLearnMore = () => {
    document.getElementById("sobre-nos")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    })
  }

  const handleTeamScroll = () => {
    document.getElementById("nossa-equipe")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    })
  }

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <img src={form} alt="" className={styles.topDecorative} />

        <div className={styles.content}>
          <h1>Agendei.com</h1>

          <p>Agendar não precisa ser complicado</p>

          <div className={styles.buttonGroup}>
            <Link to="/login" className={styles.button}>
              Começar
            </Link>

            <button type="button" className={styles.buttonSecondary} onClick={handleLearnMore}>
              Saiba mais
            </button>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img src={fundo} alt="Calendário de agendamentos" />
        </div>

        <div className={styles.topLine}></div>

        <div className={styles.bottomLine}></div>

        <img src={form} alt="" className={styles.bottomDecorative} />
      </section>

      <section id="sobre-nos" className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutBrand}>
            <div className={styles.logoContainer}>
              <img src={logo} alt="Logo Agendei.com" />
            </div>
          </div>

          <div className={styles.aboutInfo}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Sobre nós</span>

              <h2>Sobre o Agendei.com</h2>
            </div>

            <div className={styles.aboutText}>
              <p>
                O Agendei.com é um sistema desenvolvido como Trabalho de Conclusão de Curso com o objetivo de
                facilitar a gestão de agendamentos, clientes e informações empresariais.
              </p>

              <p>
                Nosso propósito é oferecer uma solução simples, intuitiva e eficiente para organizar a rotina
                de empresas que precisam otimizar seu tempo e melhorar o atendimento aos clientes.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.valuesSection}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <IconTarget />
            </div>

            <div className={styles.valueContent}>
              <h3>Missão</h3>

              <p>
                Simplificar a gestão de agendamentos e informações empresariais, proporcionando maior
                organização, eficiência e qualidade no atendimento.
              </p>
            </div>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <IconEye />
            </div>

            <div className={styles.valueContent}>
              <h3>Visão</h3>

              <p>
                Ser referência em soluções de gestão de agendamentos, ajudando empresas de diferentes
                segmentos a crescerem com mais organização.
              </p>
            </div>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <IconHeart />
            </div>

            <div className={styles.valueContent}>
              <h3>Valores</h3>

              <p>
                Valorizamos a simplicidade, a inovação e o compromisso com nossos usuários, desenvolvendo
                soluções que promovam praticidade e uma melhor experiência de atendimento.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.teamArrow}>
          <button type="button" onClick={handleTeamScroll} aria-label="Ir para nossa equipe">
            <IconChevronDown />
          </button>
        </div>

        <div id="nossa-equipe" className={styles.teamSection}>
          <div className={styles.teamHeader}>
            <div className={styles.teamTitle}>
              <div className={styles.teamIcon}>
                <IconUsers />
              </div>

              <h2>Nossa equipe</h2>
            </div>

            <div className={styles.teamLine}></div>
          </div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <article className={styles.teamCard} key={member.name}>
                <div className={styles.memberPhoto}>
                  {member.photo ? <img src={member.photo} alt={`Foto de ${member.name}`} /> : <IconUser />}
                </div>

                <h3>{member.name}</h3>

                <span>{member.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer></Footer>
    </main>
  )
}

export default HeroSection
