import { isValidCNPJ, isValidMobilePhone } from "@brazilian-utils/brazilian-utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useHookFormMask } from "use-mask-input"
import { z } from "zod"
import form from "../assets/form.png"
import duplicate from "./Login.module.css"
import styles from "./Register.module.css"

const registerFormSchema = z
  .object({
    name: z.string().min(3, "Mínimo de 3 caracteres").max(255, "Máximo de 255 caracteres"),
    email: z.email("E-mail inválido").max(255, "Máximo de 255 caracteres"),
    password: z.string().min(6, "Mínimo de 6 caracteres").max(128, "Máximo de 128 caracteres"),
    confirm_password: z.string().min(6, "As senhas não coincidem").max(128, "As senhas não coincidem"),
    phone: z.string().refine(isValidMobilePhone, "Telefone inválido"),
    tax_id: z.string().refine(isValidCNPJ, "CNPJ inválido")
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

  const registerWithMask = useHookFormMask(register)

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
              <div>
                <label htmlFor="name">Seu nome completo</label>
                <input {...register("name")} type="text" id="name" placeholder="Ex.: João da Silva" />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email">Seu e-mail</label>
                <input {...register("email")} id="email" type="email" placeholder="Ex.: empresa@email.com" />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password">Crie sua senha</label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                />
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirm_password">Confirme sua senha</label>
                <input
                  {...register("confirm_password")}
                  id="confirm_password"
                  type="password"
                  placeholder="Confirme sua senha"
                />
                {errors.confirm_password && <p className={styles.error}>{errors.confirm_password.message}</p>}
              </div>
              <div>
                <label htmlFor="phone">Seu telefone</label>
                <input {...registerWithMask("phone", "phone-br")} id="phone" type="text" />
                {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="tax_id">CNPJ</label>
                <input {...registerWithMask("tax_id", "cnpj")} id="tax_id" type="text" />
                {errors.tax_id && <p className={styles.error}>{errors.tax_id.message}</p>}
              </div>
            </div>

            <button type="submit">{isSubmitting ? "Aguarde..." : "Cadastrar"}</button>
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
