import { isValidCNPJ } from "@brazilian-utils/brazilian-utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useHookFormMask } from "use-mask-input"
import { z } from "zod"
import { auth } from "@/lib/auth"
import form from "../assets/form.png"
import duplicate from "./Login.module.css"
import styles from "./Register.module.css"

const registerFormSchema = z
  .object({
    name: z.string().min(3, "Mínimo de 3 caracteres").max(255, "Máximo de 255 caracteres"),
    email: z.email("E-mail inválido").max(255, "Máximo de 255 caracteres"),
    password: z.string().min(8, "Mínimo de 8 caracteres").max(128, "Máximo de 128 caracteres"),
    confirm_password: z.string().min(8, "Mínimo de 8 caracteres").max(128, "As senhas não coincidem"),
    cnpj: z
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .refine(isValidCNPJ, "CNPJ inválido")
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
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    reValidateMode: "onBlur"
  })

  const navigate = useNavigate()
  const { refetch } = auth.useSession()

  const registerWithMask = useHookFormMask(register)

  const [submitError, setSubmitError] = useState("")
  const handleRegisterUser = handleSubmit(async ({ name, email, password, cnpj }) => {
    setSubmitError("")
    try {
      const { error } = await auth.signUp.email({ name, email, password, cnpj })
      if (error) {
        setSubmitError(
          error.code === "CNPJ_ALREADY_REGISTERED"
            ? "Este CNPJ já está cadastrado."
            : (error.message ?? "Não foi possível criar sua conta.")
        )
        return
      }

      await refetch()

      navigate("/home", { replace: true })
    } catch {
      setSubmitError("Não foi possível conectar ao servidor. Tente novamente.")
    }
  })

  return (
    <div className={styles.container}>
      <img src={form} alt="" className={styles.topDecorative} />

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
              <div>
                <label htmlFor="name">Seu nome completo</label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Ex.: João da Silva"
                />
                {errors.name && (
                  <p id="name-error" className={styles.error}>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email">Seu e-mail</label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
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
                <label htmlFor="password">Crie sua senha</label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  placeholder="Mínimo de 8 caracteres"
                />
                {errors.password && (
                  <p id="password-error" className={styles.error}>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirm_password">Confirme sua senha</label>
                <input
                  {...register("confirm_password")}
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirm_password)}
                  aria-describedby={errors.confirm_password ? "confirm-password-error" : undefined}
                  placeholder="Confirme sua senha"
                />
                {errors.confirm_password && (
                  <p id="confirm-password-error" className={styles.error}>
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cnpj">CNPJ</label>
                <input
                  {...registerWithMask("cnpj", "cnpj")}
                  id="cnpj"
                  type="text"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.cnpj)}
                  aria-describedby={errors.cnpj ? "cnpj-error" : undefined}
                />
                {errors.cnpj && (
                  <p id="cnpj-error" className={styles.error}>
                    {errors.cnpj.message}
                  </p>
                )}
              </div>
            </div>

            {submitError && (
              <p role="alert" className={styles.error}>
                {submitError}
              </p>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Aguarde..." : "Cadastrar"}
            </button>
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

      <img src={form} alt="" className={styles.bottomDecorative} />
    </div>
  )
}
