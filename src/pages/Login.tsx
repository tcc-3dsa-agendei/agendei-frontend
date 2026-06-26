import { Link } from "react-router-dom";
import styles from "./Login.module.css";

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.lineTopo}>
        <span></span>
      </div>

      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div className={styles.leftContent}>
            <h1>Não possui uma conta?</h1>

            <div className={styles.line}></div>

            <p>
              Crie uma nova conta com suas informações pessoais e comece sua
              jornada conosco
            </p>

            <Link to="/register" className={styles.model1}>
              Criar conta
            </Link>
          </div>
        </div>

        <div className={styles.rightSide}>
          <h2 className={styles.logo}>Agendei.com</h2>

          <div className={styles.formContainer}>
            <h1>Login</h1>

            <p>Faça login informando seus dados abaixo</p>

            <input type="text" placeholder="Nome ou E-mail" />

            <input type="password" placeholder="Senha" />

            <div className={styles.remember}>
              <input type="checkbox" />
              <span>Manter-se conectado</span>
            </div>

            <Link to="/home" className={styles.confirm}>
              Fazer Login
            </Link>

            <a href="#" className={styles.login}>
              Esqueci a Senha
            </a>
          </div>
        </div>
      </div>
      <div className={styles.lineBaixo}>
        <span></span>
      </div>
    </div>
  );
}

export default Login;
