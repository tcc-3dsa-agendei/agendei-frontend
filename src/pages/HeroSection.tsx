import initialStyle from "./HeroSection.module.css"
import { Link } from "react-router-dom";
import form from "../assets/form.png";

export function HeroSection() {
  return (
    <div className={initialStyle.main}>
      <div className={initialStyle.box}>
        <div className={initialStyle.left}>
          <img src={form} id={initialStyle.leftPng}/>
          <div className={initialStyle.center}>
            <p className={initialStyle.title}>Agendei.com</p>
            <p className={initialStyle.subtitle}>
              Agendar não precisa ser complicado
            </p>
          </div>
          <div id={initialStyle.lineLt}></div>
          {/*Linha verde, no canto inferior esquerdo*/}
        </div>

        <div className={initialStyle.right}>
          <div id={initialStyle.lineRt}></div>
          {/*Linha verde, no canto superior direito*/}
          <div className={initialStyle.center}>
            <div className={initialStyle.text}>
              <p id={initialStyle.subtitle1}>Seja bem-vindo(a)</p>
              <p id={initialStyle.subtitle2}>
                ao seu site de agendamentos totalmente gratuito!
              </p>
            </div>
            <Link 
            to="/login"
            className={initialStyle.button}
            >
              Começar
            </Link>
          </div>
          <img src={form} id={initialStyle.rightPng}/>
        </div>
      </div>
    </div>
  );
}
