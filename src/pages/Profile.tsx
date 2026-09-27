import { IconCircleCheck, IconMail, IconUserCircle } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { auth } from "@/lib/auth"
import type { OpenCnpj } from "@/types/open-cnpj"
import form from "../assets/form.png"
import { MainLayout } from "../layout/MainLayout"
import styles from "./Profile.module.css"

export function Profile() {
  const [dadosEmpresa, setDadosEmpresa] = useState<OpenCnpj | null>(null)

  const { data, isPending } = auth.useSession()

  useEffect(() => {
    if (!data?.user.cnpj) return

    async function fetchCompanyData() {
      const response = await fetch(`https://api.opencnpj.org/${data?.user.cnpj}?datasets=receita`)

      const result = (await response.json()) as OpenCnpj

      setDadosEmpresa(result)
    }

    fetchCompanyData()
  }, [data?.user.cnpj])

  if (isPending) {
    return <p>Carregando sessão do usuário...</p>
  }

  if (!data) {
    return <Navigate to="/login" />
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <main className={styles.profile}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <IconUserCircle />
              <div className={styles.title}>Perfil</div>
            </div>
            <div className={styles.subtitles}>Visualize e edite suas informações pessoais</div>
          </div>

          <aside className={styles.profileCard}>
            <div className={styles.avatar}>
              <div></div>
            </div>

            <h2>{data.user.name}</h2>

            <span className={styles.company}>Microsoft Inc.</span>

            <div className={styles.divider}></div>

            <div className={styles.contact}>
              <div>
                <IconMail />
                <span>{data.user.email}</span>
              </div>

              {/* <div>
                <IconPhone />
                <span>{data.user.phoneNumber}</span>
              </div> */}

              <div>
                <IconCircleCheck />
                <span>Conta Ativa</span>
              </div>
            </div>

            <div className={styles.profileActions}>
              <button type="button" className={styles.editButton}>
                Editar Perfil
              </button>
            </div>
          </aside>

          <section className={styles.content}>
            <div className={styles.form}>
              <section className={styles.formSection}>
                <h3>Informações pessoais</h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="profile-name">Nome</label>
                    <input id="profile-name" type="text" value={data.user.name} readOnly />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-email">E-mail</label>
                    <input id="profile-email" type="email" value={data.user.email} readOnly />
                  </div>

                  {/* <div className={styles.field}>
                    <label>Telefone</label>
                    <input type="text" value={data.user.phoneNumber as string} readOnly />
                  </div> */}
                </div>
              </section>

              <section className={styles.formSection}>
                <h3>Informações da empresa</h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="profile-company-name">Nome da Empresa</label>
                    <input
                      id="profile-company-name"
                      type="text"
                      value={dadosEmpresa?.razao_social}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-address">Endereço</label>
                    <input
                      id="profile-address"
                      type="text"
                      value={`${dadosEmpresa?.logradouro}, ${dadosEmpresa?.bairro}, ${dadosEmpresa?.numero}`}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-cnpj">CNPJ</label>
                    <input id="profile-cnpj" type="text" value={data.user.cnpj} readOnly />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-cep">CEP</label>
                    <input id="profile-cep" type="text" value={dadosEmpresa?.cep} readOnly />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-category">Categoria</label>
                    <input
                      id="profile-category"
                      type="text"
                      value={dadosEmpresa?.cnaes[0].descricao}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="profile-city">Cidade</label>
                    <input id="profile-city" type="text" value={dadosEmpresa?.municipio} readOnly />
                  </div>
                </div>
              </section>

              <button type="submit" className={styles.updateButton}>
                Atualizar
              </button>
            </div>
          </section>
        </main>

        <img src={form} alt="Formas" className={styles.bottomDecorative} />
      </div>
    </MainLayout>
  )
}

export default Profile
