import styles from './Register.module.css'
import duplicate from './Login.module.css'
import { Link } from 'react-router-dom'

export function Register(){

    return(

        <div className={styles.container}>

            <div className={styles.lineTopo}>
                <span></span>
            </div>

            <div className={styles.card}>

                <div className={styles.leftSide}>

                    <h2 className={styles.logo}>
                        Agendei.com
                    </h2>

                    <div className={styles.formContainer}>

                        <h1>Criar Conta</h1>

                        <p>
                        Crie sua conta informando seus dados pessoais abaixo
                        </p>

                        <div className={styles.inputsGrid}>

                            <input
                                type="text"
                                placeholder="Nome"
                            />

                            <input
                                type="email"
                                placeholder="E-mail"
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                            />
                            <input
                                type="password"
                                placeholder="Confirmar senha"
                            />
                            <input
                                type="number"
                                placeholder="Telefone"
                            />
                            <input
                                type="number"
                                placeholder="CPF"
                            />
                            <input
                                type="text"
                                placeholder="Sexo"
                            />
                            <input
                                type="number"
                                placeholder="Telefone"
                            />
                            <input
                                type="date"
                                    placeholder="Data de nascimento"
                            />
                            <input
                                 type="text"
                                placeholder="Empresa"
                            />
                            <input
                                 type="number"
                                placeholder="CNPJ"
                             />

                            <input
                                type="text"
                                placeholder="Cargo / Função"
                            />

                            <input
                                type="text"
                                placeholder="Categoria"
                            />
                                <input
                                type="number"
                                placeholder="CEP"
                            />
                        </div>

                        <button>
                            Cadastrar
                        </button>

                    </div>
                </div>

                <div className={styles.rightSide}>

                    <div className={styles.rightContent}>

                        <h1>Já possui uma conta?</h1>

                        <div className={styles.line}></div>

                        <p>
                        Entre na sua conta já existente e dê o próximo passo conosco
                        </p>

                        <Link
                        className={duplicate.model1}
                        to='/login'
                        >
                            Fazer Login
                        </Link>

                    </div>

                </div>
            </div>
            <div className={styles.lineBaixo}>
                <span></span>
            </div>
        </div>


    )
}