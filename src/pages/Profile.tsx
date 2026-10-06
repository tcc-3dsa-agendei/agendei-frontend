import {
  IconBriefcase,
  IconBuilding,
  IconBuildingStore,
  IconCheck,
  IconCircleCheck,
  IconEdit,
  IconId,
  IconLock,
  IconMail,
  IconMapPin,
  IconX
} from "@tabler/icons-react"
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { ApiFeedback } from "@/components/ApiFeedback"
import { useApiData } from "@/hooks/use-api-data"
import { useInterfaceFocus } from "@/hooks/use-interface-focus"
import { MainLayout } from "@/layout/MainLayout"
import { auth } from "@/lib/auth"
import { getCompany } from "@/lib/company"
import styles from "./Profile.module.css"

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "U"
  return (parts.length === 1 ? parts : [parts[0], parts.at(-1)])
    .map((part) => part?.charAt(0))
    .join("")
    .toUpperCase()
}

function formatCnpj(value?: string) {
  if (!value) return "Não informado"
  const digits = value.replace(/\D/g, "")
  if (digits.length !== 14) return value
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

function formatCep(value?: string | null) {
  if (!value) return "Não informado"
  const digits = value.replace(/\D/g, "")
  return digits.length === 8 ? digits.replace(/^(\d{5})(\d{3})$/, "$1-$2") : value
}

export function Profile() {
  const { data, refetch } = auth.useSession()
  const user = data?.user
  const cnpj = user?.cnpj
  const [editingName, setEditingName] = useState(false)
  const nameInput = useInterfaceFocus<HTMLInputElement>(editingName)
  const editTrigger = useRef<HTMLButtonElement>(null)
  const wasEditing = useRef(false)
  useEffect(() => {
    if (wasEditing.current && !editingName) editTrigger.current?.focus()
    wasEditing.current = editingName
  }, [editingName])
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [savingName, setSavingName] = useState(false)
  const company = useApiData(
    useCallback((signal: AbortSignal) => (cnpj ? getCompany(cnpj, signal) : Promise.resolve(null)), [cnpj])
  )
  const details = company.data
  const address = details
    ? [details.logradouro, details.numero, details.bairro].filter(Boolean).join(", ")
    : ""

  const beginNameEdit = () => {
    setName(user?.name ?? "")
    setNameError("")
    setSuccessMessage("")
    setEditingName(true)
  }

  const cancelNameEdit = () => {
    setName(user?.name ?? "")
    setNameError("")
    setEditingName(false)
  }

  const updateName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (normalizedName.length < 2) {
      setNameError("Informe um nome com pelo menos 2 caracteres.")
      return
    }

    setSavingName(true)
    setNameError("")
    setSuccessMessage("")
    try {
      const { error } = await auth.updateUser({ name: normalizedName })
      if (error) {
        setNameError(error.message ?? "Não foi possível atualizar o nome.")
        return
      }
      await refetch()
      setEditingName(false)
      setSuccessMessage("Nome atualizado com sucesso.")
    } catch {
      setNameError("Não foi possível conectar ao servidor. Tente novamente.")
    } finally {
      setSavingName(false)
    }
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.container}>
          <section className={styles.profileHeader} aria-labelledby="profile-title">
            <div className={styles.avatarBadge} aria-hidden="true">
              {initials(user?.name ?? "")}
            </div>
            <div className={styles.identity}>
              <span className={styles.eyebrow}>Meu perfil</span>
              <h1 id="profile-title">{user?.name || "Usuário"}</h1>
              <p>{user?.email || "E-mail não informado"}</p>
            </div>
            <span className={styles.badgeActive}>
              <IconCircleCheck aria-hidden="true" />
              Conta ativa
            </span>
          </section>

          <section className={styles.card} aria-labelledby="personal-data-title">
            <div className={styles.cardHeading}>
              <span className={styles.cardIcon}>
                <IconId aria-hidden="true" />
              </span>
              <div>
                <h2 id="personal-data-title">Dados pessoais e acesso</h2>
                <p>Informações usadas para identificar e acessar sua conta.</p>
              </div>
            </div>

            {successMessage && (
              <div className={styles.successBanner} role="status">
                <IconCircleCheck aria-hidden="true" />
                {successMessage}
              </div>
            )}

            <div className={styles.personalGrid}>
              <div className={styles.field}>
                <div className={styles.fieldLabelRow}>
                  {editingName ? (
                    <label htmlFor="profile-name">Nome</label>
                  ) : (
                    <span className={styles.fieldLabel}>Nome</span>
                  )}
                  {!editingName && (
                    <button
                      ref={editTrigger}
                      type="button"
                      className={styles.editButton}
                      onClick={beginNameEdit}>
                      <IconEdit aria-hidden="true" />
                      Editar nome
                    </button>
                  )}
                </div>
                {editingName ? (
                  <form className={styles.nameForm} onSubmit={updateName}>
                    <input
                      ref={nameInput}
                      id="profile-name"
                      type="text"
                      value={name}
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      aria-invalid={Boolean(nameError)}
                      aria-describedby={nameError ? "profile-name-error" : undefined}
                      disabled={savingName}
                      onChange={(event) => {
                        setName(event.target.value)
                        if (nameError) setNameError("")
                      }}
                    />
                    <div className={styles.editActions}>
                      <button type="submit" className={styles.saveButton} disabled={savingName}>
                        <IconCheck aria-hidden="true" />
                        {savingName ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        disabled={savingName}
                        onClick={cancelNameEdit}>
                        <IconX aria-hidden="true" />
                        Cancelar
                      </button>
                    </div>
                    {nameError && (
                      <p id="profile-name-error" className={styles.fieldError} role="alert">
                        {nameError}
                      </p>
                    )}
                  </form>
                ) : (
                  <div id="profile-name" className={styles.fieldValue}>
                    <IconId aria-hidden="true" />
                    <span>{user?.name || "Não informado"}</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>E-mail</span>
                <div className={styles.fieldValue}>
                  <IconMail aria-hidden="true" />
                  <span>{user?.email || "Não informado"}</span>
                  <IconLock className={styles.lockIcon} aria-label="Campo protegido" />
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>CNPJ</span>
                <div className={styles.fieldValue}>
                  <IconBuilding aria-hidden="true" />
                  <span>{formatCnpj(cnpj)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card} aria-labelledby="company-data-title">
            <div className={styles.cardHeading}>
              <span className={styles.cardIcon}>
                <IconBuildingStore aria-hidden="true" />
              </span>
              <div>
                <h2 id="company-data-title">Dados cadastrais da empresa</h2>
                <p>Informações públicas vinculadas ao CNPJ da conta.</p>
              </div>
            </div>

            <div className={styles.apiFeedback}>
              <ApiFeedback loading={company.loading} error={company.error} retry={company.reload} />
            </div>
            {!company.loading && !cnpj && (
              <p className={styles.emptyState}>Nenhum CNPJ informado na conta.</p>
            )}
            {details && (
              <dl className={styles.companyGrid}>
                <div className={styles.companyField}>
                  <IconBuilding aria-hidden="true" />
                  <div>
                    <dt>Razão social</dt>
                    <dd>{details.razao_social}</dd>
                  </div>
                </div>
                <div className={styles.companyField}>
                  <IconBuildingStore aria-hidden="true" />
                  <div>
                    <dt>Nome fantasia</dt>
                    <dd>{details.nome_fantasia || "Não informado"}</dd>
                  </div>
                </div>
                <div className={`${styles.companyField} ${styles.wideField}`}>
                  <IconMapPin aria-hidden="true" />
                  <div>
                    <dt>Endereço completo</dt>
                    <dd>{address || "Não informado"}</dd>
                  </div>
                </div>
                <div className={styles.companyField}>
                  <IconMapPin aria-hidden="true" />
                  <div>
                    <dt>CEP</dt>
                    <dd>{formatCep(details.cep)}</dd>
                  </div>
                </div>
                <div className={styles.companyField}>
                  <IconMapPin aria-hidden="true" />
                  <div>
                    <dt>Município / UF</dt>
                    <dd>{[details.municipio, details.uf].filter(Boolean).join(" / ") || "Não informado"}</dd>
                  </div>
                </div>
                <div className={`${styles.companyField} ${styles.wideField}`}>
                  <IconBriefcase aria-hidden="true" />
                  <div>
                    <dt>Atividade principal (CNAE)</dt>
                    <dd>
                      {details.cnaes?.find((item) => item.is_principal)?.descricao ??
                        details.cnae_principal ??
                        "Não informado"}
                    </dd>
                  </div>
                </div>
              </dl>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default Profile
