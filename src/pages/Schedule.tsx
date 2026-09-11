import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "../layout/MainLayout"
import styles from "./Schedule.module.css"

interface today {
  dayN: number
  day: string
  mon: string
}

export function Schedule() {
  const navigate = useNavigate()

  const [today, _setToday] = useState<today>({
    dayN: 1,
    day: "Quarta-Feira",
    mon: "Junho"
  })

  return (
    <MainLayout>
      {/*============== Topo ==============*/}
      <div className={styles.screenTop}>
        <div className={styles.schedulerLayout}>
          <div className={styles.retancle}>
            <div className={styles.header}>
              <p id={styles.title}>Agendas</p>

              <p id={styles.subtitles}>Visualize e gerencie todas as suas agendas</p>
            </div>

            <button type="button" className={styles.new} onClick={() => navigate("/nova-agenda")}>
              + Nova agenda
            </button>
          </div>
        </div>

        {/*============== Conteúdo (As três caixas) ==============*/}
        <div className={styles.mainContent}>
          <div className={styles.calendar}>
            <div className={styles.compCalendar}>
              <p id={styles.textCalendar}>Onde o componente estará.</p>
            </div>
            <div id={styles.line}></div>
            <div className={styles.filter}>
              <p id={styles.textFilter}>Filtros</p>
              <div className={styles.buttons}>
                <button type="button" className={styles.button}>
                  Todas as agendas
                </button>
                <button type="button" className={styles.button}>
                  Todos os profissionais
                </button>
                <button type="button" className={styles.button}>
                  Todos os serviços
                </button>
                <button type="button" className={styles.button} id={styles.cls}>
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          <div className={styles.hours}>
            <div className={styles.today}>
              <p id={styles.textday}>
                {today.day},{today.dayN} de {today.mon}
              </p>
              <p id={styles.subtitleDay}>(Onde ficará o dia atual.)</p>
            </div>
            <div className={styles.schedule}>
              <div className={styles.container}>Onde ficará o agendamento já criado!</div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.notes}>
              <p>Onde estarão as notas e lembretes</p>
            </div>
            <div className={styles.recents}>
              <p>Onde estarão os agendamentos recentes</p>
            </div>
          </div>
        </div>

        {/*==============          ==============*/}
      </div>
    </MainLayout>
  )
}
