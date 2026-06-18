import styles from './Login.module.css'

export function Login(){

    return(

        <div className={styles.container}>

            <div className={styles.card}>

                <div className={styles.leftSide}>

                    <div className={styles.leftContent}>

                        <h1>Não possui uma conta?</h1>

                        <div className={styles.line}></div>

                        <p>
                        Crie uma nova conta com suas
                        informações pessoais e
                        comece sua jornada conosco
                        </p>

                        <button>
                        Criar Conta
                        </button>

                    </div>

                </div>

                <div className={styles.rightSide}>

                    <div className={styles.formContainer}>

                        <h1>Login</h1>

                        <p>
                        Faça login informando seus dados abaixo
                        </p>

                        <input
                            type="text"
                            placeholder="Nome ou E-mail"
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                        />

                        <div className={styles.remember}>
                            <input type="checkbox"/>
                            <span>Manter-se conectado</span>
                        </div>

                        <button>
                            Fazer Login
                        </button>

                        <a href="#">
                            Esqueci a Senha
                        </a>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login