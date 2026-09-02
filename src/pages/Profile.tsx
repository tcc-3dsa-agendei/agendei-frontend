import { MainLayout } from "../layout/MainLayout";
import styles from "./Profile.module.css";
import form from "../assets/form.png";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCircleCheck,
  IconLogout,
  IconBrandWhatsapp,
  IconUserCircle
} from "@tabler/icons-react";

export function Profile() {
  return (
    <MainLayout>

      <div className={styles.page}>

        <main className={styles.profile}>

            <div className={styles.header}>


                <div className={styles.headerTitle}>
                    <IconUserCircle />
                    <div className={styles.title}>
                        Perfil
                    </div>
                </div>
                <div className={styles.subtitles}>
                    Visualize e edite suas informações pessoais
            </div>

            </div>


          <aside className={styles.profileCard}>

            <div className={styles.avatar}>
              <div></div>
            </div>

            <h2>
              Dom Comédia
            </h2>

            <span className={styles.company}>
              Microsoft Inc.
            </span>

            <div className={styles.divider}></div>

            <div className={styles.contact}>

              <div>
                <IconMail />
                <span>dcomedia@gmail.com</span>
              </div>

              <div>
                <IconPhone />
                <span>(19) 99999-9999</span>
              </div>

              <div>
                <IconMapPin />
                <span>Sumaré / SP</span>
              </div>

              <div>
                <IconBriefcase />
                <span>Desenvolvedor</span>
              </div>

              <div>
                <IconCircleCheck />
                <span>Conta Ativa</span>
              </div>

            </div>

            <div className={styles.profileActions}>

              <button className={styles.editButton}>
                Editar Perfil
              </button>

              <button className={styles.logoutButton}>
                <IconLogout />
                Sair da conta
              </button>

              <button className={styles.whatsappButton}>
                <IconBrandWhatsapp />
                Conexão com Whatsapp
              </button>

            </div>

          </aside>


          <section className={styles.content}>



            <div className={styles.form}>


              <section className={styles.formSection}>

                <h3>
                  Informações pessoais
                </h3>

                <div className={styles.formGrid}>

                  <div className={styles.field}>
                    <label>Nome</label>
                    <input
                      type="text"
                      value="Dom Comédia"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>CPF</label>
                    <input
                      type="text"
                      value="000.000.000-00"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>E-mail</label>
                    <input
                      type="email"
                      value="dcomedia@gmail.com"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Gênero</label>
                    <input
                      type="text"
                      value="Masculino"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Senha</label>
                    <input
                      type="password"
                      value="123456789"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Data de Nascimento</label>
                    <input
                      type="text"
                      value="13/05/2009"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Telefone</label>
                    <input
                      type="text"
                      value="(19) 99999-9999"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Cargo / Função</label>
                    <input
                      type="text"
                      value="Desenvolvedor"
                      readOnly
                    />
                  </div>

                </div>

              </section>


              <section className={styles.formSection}>

                <h3>
                  Informações da empresa
                </h3>

                <div className={styles.formGrid}>

                  <div className={styles.field}>
                    <label>Nome da Empresa</label>
                    <input
                      type="text"
                      value="Microsoft Inc."
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Endereço</label>
                    <input
                      type="text"
                      value="Rua dos bobos, número 0"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>CNPJ</label>
                    <input
                      type="text"
                      value="XX.XXX.XXX/XXXX-XX"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>CEP</label>
                    <input
                      type="text"
                      value="00000-000"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Categoria</label>
                    <input
                      type="text"
                      value="Tecnologia"
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Cidade</label>
                    <input
                      type="text"
                      value="Sumaré / SP"
                      readOnly
                    />
                  </div>

                </div>

              </section>


              <button className={styles.updateButton}>
                Atualizar
              </button>

            </div>

          </section>

        </main>

        <img
              src={form}
              alt="Formas"
              className={styles.bottomDecorative}
            />

      </div>

    </MainLayout>
  );
}

export default Profile;