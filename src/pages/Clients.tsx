import { useState } from "react";
import { MainLayout } from "../layout/MainLayout";
import styles from "./Clients.module.css";

const clients = [
  {
    id: 1,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
  {
    id: 2,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
  {
    id: 3,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
  {
    id: 4,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
  {
    id: 5,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
  {
    id: 6,
    name: "Moises",
    lastName: "Araújo",
    service: "Corte de cabelo",
    company: "Barbearia NJ",
    date: "06/07/2026",
    day: "Quinta-feira",
    time: "08:30",
    status: "Confirmado",
  },
];

const statistics = [
  { value: "128", label: "Total de clientes" },
  { value: "14", label: "Agendamentos hoje" },
  { value: "9", label: "Confirmados" },
  { value: "5", label: "Pendentes" },
];

export function Clients() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos os status");

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      client.name.toLowerCase().includes(searchText) ||
      client.lastName.toLowerCase().includes(searchText) ||
      client.service.toLowerCase().includes(searchText);

    const matchesStatus =
      status === "Todos os status" || client.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className={styles.page}>

        {/* Estatísticas */}
        <section className={styles.statistics}>

          {statistics.map((item) => (
            <div className={styles.statCard} key={item.label}>
              <h2>{item.value}</h2>
              <p>{item.label}</p>
            </div>
          ))}

        </section>


        {/* Tabela */}
        <section className={styles.tableCard}>

          <div className={styles.filters}>

            <div className={styles.search}>
              <span>⌕</span>

              <input
                type="text"
                placeholder="Buscar"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>


            <div className={styles.filterButtons}>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>Todos os status</option>
                <option>Confirmado</option>
                <option>Pendente</option>
                <option>Cancelado</option>
              </select>

              <button>06/07 – 08/07</button>

              <button>☷ &nbsp; Mais filtros</button>

            </div>

          </div>


          <table>

            <thead>
              <tr>
                <th></th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Status</th>
              </tr>
            </thead>


            <tbody>

              {filteredClients.map((client) => (
                <tr key={client.id}>

                  <td>
                    <div className={styles.avatar}></div>
                  </td>

                  <td>
                    <strong>{client.name}</strong>
                    <span>{client.lastName}</span>
                  </td>

                  <td>
                    <strong>{client.service}</strong>
                    <span>{client.company}</span>
                  </td>

                  <td>
                    <strong>{client.date}</strong>
                    <span>{client.day}</span>
                  </td>

                  <td>
                    <strong>{client.time}</strong>
                  </td>

                  <td>
                    <span className={styles.status}>
                      {client.status}
                    </span>
                  </td>

                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </section>

      </div>
    </MainLayout>
  );
}

export default Clients;