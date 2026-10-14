import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import z from "zod"
import { auth } from "@/lib/auth"
import form from "../assets/form.png"
import styles from "./Login.module.css"

const loginFormSchema = z.object({
  email: z.email("E-mail inválido").max(255, "Máximo de 255 caracteres"),
  password: z.string().min(8, "Mínimo de 8 caracteres").max(128, "Máximo de 128 caracteres"),
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

  const navigate = useNavigate()
  const location = useLocation()
  const { refetch } = auth.useSession()
  const [submitError, setSubmitError] = useState("")

  const handleSignIn = handleSubmit(async ({ email, password, remember_me }) => {
    setSubmitError("")
    try {
      const { error } = await auth.signIn.email({ email, password, rememberMe: remember_me })
      if (error) {
        setSubmitError(error.message ?? "Não foi possível entrar.")
        return
      }

      await refetch()

      const destination = location.state?.from
      navigate(
        typeof destination === "string" && destination.startsWith("/") && !destination.startsWith("//")
          ? destination
          : "/home",
        { replace: true }
      )
    } catch {
      setSubmitError("Não foi possível conectar ao servidor. Tente novamente.")
    }
  })

  return (
    <div className={styles.container}>
      <img src={form} alt="" className={styles.topDecorative} />

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
              <input
                {...register("email")}
                type="email"
                id="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="Ex.: empresa@email.com"
              />
              {errors.email && (
                <p id="email-error" className={styles.error}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password">Sua senha</label>
              <input
                {...register("password")}
                type="password"
                id="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                placeholder="Sua senha"
              />
              {errors.password && (
                <p id="password-error" className={styles.error}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className={styles.remember}>
              <input {...register("remember_me")} type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">
                <span>Manter-se conectado</span>
              </label>
            </div>

            {submitError && (
              <p role="alert" className={styles.error}>
                {submitError}
              </p>
            )}
            <button className={styles.confirm} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.lineBottom}>
        <span></span>
      </div>

      <img src={form} alt="" className={styles.bottomDecorative} />
    </div>
  )
}
