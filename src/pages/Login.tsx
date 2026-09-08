import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import z from "zod"
import form from "../assets/form.png"
import styles from "./Login.module.css"

const loginFormSchema = z.object({
  email: z.email("E-mail inválido").max(255, "Máximo de 255 caracteres"),
  password: z.string().min(6, "Mínimo de 6 caracteres").max(128, "Máximo de 128 caracteres"),
  remember_me: z.boolean().default(true).optional()
})

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      remember_me: true
    }
  })

  const handleSignIn = handleSubmit(async ({ email, password, remember_me }) => {
    console.log(email, password, remember_me)
  })

  return (
    <div className={styles.container}>
      <img src={form} alt="Formas" className={styles.topDecorative} />

      <div className={styles.lineTop}>
        <span></span>
      </div>

      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div className={styles.leftContent}>
            <h1>Não possui uma conta?</h1>

            <div className={styles.line}></div>

            <p>Crie uma nova conta com suas informações pessoais e comece sua jornada conosco</p>

            <Link to="/register" className={styles.model1}>
              Criar conta
            </Link>
          </div>
        </div>

        <div className={styles.rightSide}>
          <h2 className={styles.logo}>Agendei.com</h2>

          <form onSubmit={handleSignIn} className={styles.formContainer}>
            <h1>Login</h1>

            <p>Faça login informando seus dados abaixo</p>

            <div>
              <label htmlFor="email">Seu e-mail</label>
              <input {...register("email")} type="email" id="email" placeholder="Ex.: empresa@email.com" />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password">Sua senha</label>
              <input {...register("password")} type="password" id="password" placeholder="Sua senha" />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            <div className={styles.remember}>
              <input {...register("remember_me")} type="checkbox" />
              <span>Manter-se conectado</span>
            </div>

            <button className={styles.confirm} type="submit">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.lineBottom}>
        <span></span>
      </div>

      <img src={form} alt="Formas" className={styles.bottomDecorative} />
    </div>
  )
}
