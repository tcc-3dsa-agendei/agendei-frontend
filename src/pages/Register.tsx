import { isValidMobilePhone } from "@brazilian-utils/brazilian-utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import form from "../assets/form.png"
import duplicate from "./Login.module.css"
import styles from "./Register.module.css"

const registerFormSchema = z
  .object({
    name: z.string().min(3).max(255),
    email: z.email().max(255),
    password: z.string().min(6).max(128),
    confirm_password: z.string().min(6).max(128),
    phone: z.string().refine(isValidMobilePhone)
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "As senhas não coincidem"
      })
    }
  })

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(registerFormSchema)
  })

  const handleRegisterUser = handleSubmit(async ({ name, email, password, phone }) => {
    console.log(name, email, password, phone)
  })

  return (
    <div className={styles.container}>
      <img src={form} alt="Formas" className={styles.topDecorative} />

      <div className={styles.lineTopo}>
        <span></span>
      </div>

      <div className={styles.card}>
        <div className={styles.leftSide}>
          <h2 className={styles.logo}>Agendei.com</h2>

          <form onSubmit={handleRegisterUser} className={styles.formContainer}>
            <h1>Criar Conta</h1>

            <p>Crie sua conta informando seus dados pessoais abaixo</p>

            <div className={styles.inputsGrid}>
              <input type="text" placeholder="Nome" />

              <input type="email" placeholder="E-mail" />

              <input type="password" placeholder="Senha" />
              <input type="password" placeholder="Confirmar senha" />
              <input type="number" placeholder="Telefone" />
              <input type="number" placeholder="CNPJ" />
            </div>

            <button type="submit">Cadastrar</button>
          </form>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.rightContent}>
            <h1>Já possui uma conta?</h1>

            <div className={styles.line}></div>

            <p>Entre na sua conta já existente e dê o próximo passo conosco</p>

            <Link className={duplicate.model1} to="/login">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.lineBaixo}>
        <span></span>
      </div>

      <img src={form} alt="Formas" className={styles.bottomDecorative} />
    </div>
  )
}
