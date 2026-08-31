import styles from "./About.module.css";
import { MainLayout } from "../layout/MainLayout";
import logo from "../assets/logo.png";
import user from "../assets/user.png";

const features = [
  {
    title: "Missão",
    text: "Simplificar a gestão de agendamentos e informações empresariais, proporcionando mais organização, eficiência e qualidade no atendimento.",
  },
  {
    title: "Visão",
    text: "Ser referência em soluções de gestão de agendamentos, ajudando empresas de diferentes segmentos a crescerem com mais organização.",
  },
  {
    title: "Valores",
    text: "Valorizamos a simplicidade, a inovação e o compromisso com nossos usuários, desenvolvendo soluções que promovam organização, produtividade e uma melhor experiência de atendimento.",
  },
];

const team = [
  { name: "Vitor Felipe", role: "Designer" },
  { name: "Vitor Felício", role: "Back-end" },
  { name: "Nelson Francisco", role: "Front-end" },
  { name: "Lucas Alves", role: "Documentação" },
  { name: "Moises Marques", role: "Designer" },
];

export function About() {
  return (
    <MainLayout>

      <div className={styles.page}>

        <section className={styles.intro}>

          <h1>Sobre o Agendei.com</h1>

          <p>
            O Agendei.com é um sistema desenvolvido como Trabalho de
            Conclusão de Curso com o objetivo de facilitar a gestão de
            agendamentos, clientes e informações empresariais.
          </p>

          <p>
            Nosso propósito é oferecer uma solução simples, intuitiva e
            eficiente para organizar a rotina de empresas que precisam
            otimizar seu tempo e melhorar o atendimento aos clientes.
          </p>

          <img
            src={logo}
            alt="Agendei.com"
            className={styles.logo}
            />

        </section>


        <section className={styles.features}>

          {features.map((feature) => (

            <div className={styles.feature} key={feature.title}>

              <div className={styles.featureIcon}>
                {/* Ícone */}
              </div>

              <div>
                <h2>{feature.title}</h2>

                <p>{feature.text}</p>
              </div>

            </div>

          ))}

        </section>


        <section className={styles.team}>

          <div className={styles.teamTitle}>

            <div className={styles.teamIcon}>
              {/* Ícone */}
            </div>

            <h2>Nossa equipe</h2>

            <div className={styles.teamLine}></div>

          </div>


          <div className={styles.teamList}>

            {team.map((member) => (

              <div className={styles.member} key={member.name}>

                <div className={styles.memberPhoto}>
                  <img
                  src={user}
                  alt="Foto do membro" />
                </div>

                <h3>{member.name}</h3>

                <span>{member.role}</span>

              </div>

            ))}

          </div>

        </section>

      </div>

    </MainLayout>
  );
}

export default About;