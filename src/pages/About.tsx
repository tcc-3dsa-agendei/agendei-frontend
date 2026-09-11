import styles from "./About.module.css";
import { MainLayout } from "../layout/MainLayout";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import form from "../assets/form.png";
import {
  IconTarget,
  IconEye,
  IconHeart,
  IconUsers,
} from "@tabler/icons-react";

const team = [
  { name: "Vitor Felipe", role: "Designer" },
  { name: "Vitor Felício", role: "Back-end" },
  { name: "Nelson Francisco", role: "Front-end" },
  { name: "Lucas Alves", role: "Documentação" },
  { name: "Moises Marques", role: "Front-end" },
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

          <img
              src={form}
              alt="Formas"
              className={styles.topDecorative}
            />

          <div className={styles.feature}>

            <div className={styles.featureIcon}>
              <IconTarget />
            </div>

            <div>

              <h2>Missão</h2>

              <p>
                Simplificar a gestão de agendamentos e informações
                empresariais, proporcionando mais organização, eficiência
                e qualidade no atendimento.
              </p>

            </div>

          </div>


          <div className={styles.feature}>

            <div className={styles.featureIcon}>
              <IconEye />
            </div>

            <div>

              <h2>Visão</h2>

              <p>
                Ser referência em soluções de gestão de agendamentos,
                ajudando empresas de diferentes segmentos a crescerem
                com mais organização.
              </p>

            </div>

          </div>


          <div className={styles.feature}>

            <div className={styles.featureIcon}>
              <IconHeart />
            </div>

            <div>

              <h2>Valores</h2>

              <p>
                Valorizamos a simplicidade, a inovação e o compromisso
                com nossos usuários, desenvolvendo soluções que promovam
                organização, produtividade e uma melhor experiência de
                atendimento.
              </p>

            </div>

          </div>

        </section>


        <section className={styles.team}>

          <div className={styles.teamTitle}>

            <div className={styles.teamIcon}>
              <IconUsers />
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
                    alt="Foto do membro"
                  />

                </div>

                <h3>{member.name}</h3>

                <span>{member.role}</span>

              </div>

            ))}

          </div>

          <img
              src={form}
              alt="Formas"
              className={styles.bottomDecorative}
            />

        </section>

      </div>

    </MainLayout>
  );
}

export default About;