import { Link } from "react-router-dom";
import styles from "./HeroSection.module.css";
import form from "../assets/form.png";
import fundo from "../assets/fundo.jpg";

export function HeroSection() {
  return (
    <main className={styles.container}>

      <img
        src={form}
        alt="Formas"
        className={styles.topDecorative}
      />

      <section className={styles.hero}>

        <div className={styles.content}>

          <h1>Agendei.com</h1>

          <p>
            Agendar não precisa ser complicado
          </p>

          <Link to="/login" className={styles.button}>
            Começar
          </Link>

        </div>

        <div className={styles.imageContainer}>
          <img
            src={fundo}
            alt="Calendário de agendamentos"
          />
        </div>

      </section>

      <div className={styles.topLine}></div>
      <div className={styles.bottomLine}></div>

      <img
        src={form}
        alt="Formas"
        className={styles.bottomDecorative}
      />

    </main>
  );
}

export default HeroSection;