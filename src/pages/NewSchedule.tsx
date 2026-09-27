import {
  IconCalendarClock,
  IconClipboardCheck,
  IconFileDescription,
  IconListDetails,
  IconPencil,
  IconTrash
} from "@tabler/icons-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "../layout/MainLayout"
import styles from "./NewSchedule.module.css"

interface today {
  dayN: number
  day: string
  mon: string
}
export function NewSchedule() {
  const _navigate = useNavigate()

  const [_today, _setToday] = useState<today>({
    dayN: 1,
    day: "Quarta-Feira",
    mon: "Junho"
  })

  const [step, setStep] = useState<number>(1)
  return (
    <MainLayout>
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.header}>
            <div className={styles.title}>Nova agenda</div>

            <p>Crie uma nova agenda e configure os dias, horários e serviços disponíveis</p>
          </section>

          <section className={styles.steps}>
            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 1 ? styles.active : ""}`}>1</div>

              <div className={styles.stepInfo}>
                <strong>Informações básicas</strong>

                <span>Nome e descrição</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 2 ? styles.active : ""}`}>2</div>

              <div className={styles.stepInfo}>
                <strong>Dias e horários</strong>

                <span>Defina quando estará disponível</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 3 ? styles.active : ""}`}>3</div>

              <div className={styles.stepInfo}>
                <strong>Serviços</strong>

                <span>Adicione os serviços oferecidos</span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div className={styles.step}>
              <div className={`${styles.stepNumber} ${step >= 4 ? styles.active : ""}`}>4</div>

              <div className={styles.stepInfo}>
                <strong>Revisão</strong>

                <span>Revise e finalize sua agenda</span>
              </div>
            </div>
          </section>

          <section className={styles.content}>
            {step === 1 && (
              <div className={styles.form}>
                <div className={styles.sectionTitle}>
                  <div className={styles.icon}>
                    <IconFileDescription size={18} stroke={1.8} />
                  </div>

                  <div>
                    <h2>Informações básicas da agenda</h2>

                    <p>
                      Comece definindo um nome para sua agenda e uma descrição para que seus clientes saibam
                      do que se trata.
                    </p>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.field}>
                  <label htmlFor="schedule-name">Nome da agenda*</label>

                  <input
                    id="schedule-name"
                    type="text"
                    placeholder="Ex: Atendimento geral, Corte e barba, Manicure..."
                  />

                  <span className={styles.counter}>0/60</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="schedule-description">Descrição da agenda*</label>

                  <textarea
                    id="schedule-description"
                    placeholder="Descreva brevemente o propósito desta agenda, os tipos de atendimento, o público ou qualquer informação importante"
                    maxLength={200}
                  />

                  <span className={styles.counter}>0/200</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.form}>
                <div className={styles.sectionTitle}>
                  <div className={styles.icon}>
                    <IconCalendarClock size={18} stroke={1.8} />
                  </div>

                  <div>
                    <h2>Dias e horários de atendimento</h2>

                    <p>
                      Selecione a data, os dias da semana em que você atende e defina os horários disponíveis.
                    </p>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.scheduleContent}>
                  <div className={styles.weekDays}>
                    <h3>Dias da semana</h3>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Segunda-feira</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Terça-feira</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Quarta-feira</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Quinta-feira</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Sexta-feira</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Sábado</span>
                    </label>

                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Domingo</span>
                    </label>
                  </div>

                  <div className={styles.calendarArea}>
                    <h3>Dias do mês</h3>

                    <div className={styles.calendarPlaceholder}></div>
                  </div>

                  <div className={styles.attendance}>
                    <h3>Horários de atendimento</h3>

                    <p className={styles.attendanceDescription}>
                      Defina o horário de início, término e os intervalos do seu atendimento.
                    </p>

                    <div className={styles.timeFields}>
                      <div className={styles.timeField}>
                        <label htmlFor="start-time">Horário de início</label>

                        <input id="start-time" type="text" value="9:00" readOnly />
                      </div>

                      <div className={styles.timeField}>
                        <label htmlFor="end-time">Horário de término</label>

                        <input id="end-time" type="text" value="18:00" readOnly />
                      </div>
                    </div>

                    <div className={styles.intervalField}>
                      <label htmlFor="interval">Intervalo (opcional)</label>

                      <input id="interval" type="text" value="12:00 – 13:00" readOnly />
                    </div>

                    <button type="button" className={styles.addIntervalButton}>
                      Adicionar intervalos
                    </button>

                    <div className={styles.infoMessage}>
                      Os horários definidos serão válidos para todos os dias selecionados.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.form}>
                <div className={styles.sectionTitle}>
                  <div className={styles.icon}>
                    <IconListDetails size={18} stroke={1.8} />
                  </div>

                  <div>
                    <h2>Serviços oferecidos</h2>

                    <p>
                      Adicione os serviços que sua empresa oferece, informando o nome, duração e, se desejar,
                      o preço.
                    </p>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.servicesHeader}>
                  <h3>Serviços cadastrados</h3>

                  <button type="button" className={styles.addServiceButton}>
                    Adicionar serviço
                  </button>
                </div>

                <div className={styles.servicesList}>
                  <div className={styles.serviceItem}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceIcon}>
                        <span></span>
                      </div>

                      <div>
                        <strong>Corte de cabelo</strong>

                        <p>30 minutos&nbsp;&nbsp;|&nbsp;&nbsp;R$35,00</p>
                      </div>
                    </div>

                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.editButton}>
                        <IconPencil size={16} stroke={1.8} />
                      </button>

                      <button type="button" className={styles.deleteButton}>
                        <IconTrash size={16} stroke={1.8} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.serviceItem}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceIcon}>
                        <span></span>
                      </div>

                      <div>
                        <strong>Manicure</strong>

                        <p>1 hora&nbsp;&nbsp;|&nbsp;&nbsp;R$65,00</p>
                      </div>
                    </div>

                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.editButton}>
                        <IconPencil size={16} stroke={1.8} />
                      </button>

                      <button type="button" className={styles.deleteButton}>
                        <IconTrash size={16} stroke={1.8} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.serviceItem}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceIcon}>
                        <span></span>
                      </div>

                      <div>
                        <strong>Barba</strong>

                        <p>20 minutos&nbsp;&nbsp;|&nbsp;&nbsp;R$20,00</p>
                      </div>
                    </div>

                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.editButton}>
                        <IconPencil size={16} stroke={1.8} />
                      </button>

                      <button type="button" className={styles.deleteButton}>
                        <IconTrash size={16} stroke={1.8} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.serviceItem}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceIcon}>
                        <span></span>
                      </div>

                      <div>
                        <strong>Corte de cabelo</strong>

                        <p>30 minutos&nbsp;&nbsp;|&nbsp;&nbsp;R$35,00</p>
                      </div>
                    </div>

                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.editButton}>
                        <IconPencil size={16} stroke={1.8} />
                      </button>

                      <button type="button" className={styles.deleteButton}>
                        <IconTrash size={16} stroke={1.8} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className={styles.form}>
                <div className={styles.sectionTitle}>
                  <div className={styles.icon}>
                    <IconClipboardCheck size={18} stroke={1.8} />
                  </div>

                  <div>
                    <h2>Revisão da agenda</h2>

                    <p>Confira todas as informações antes de finalizar sua agenda.</p>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              {step === 1 ? (
                <button type="button" className={styles.cancelButton}>
                  Cancelar
                </button>
              ) : (
                <button type="button" className={styles.cancelButton} onClick={() => setStep(step - 1)}>
                  Voltar
                </button>
              )}

              {step < 4 ? (
                <button type="button" className={styles.continueButton} onClick={() => setStep(step + 1)}>
                  Continuar
                </button>
              ) : (
                <button type="button" className={styles.continueButton}>
                  Finalizar
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  )
}
