import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import styles from "./Clients.module.css";

const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const FilterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);
const ChevronUp = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface Appointment {
  id: number;
  clientName: string;
  clientSub: string;
  service: string;
  serviceSub: string;
  date: string;
  dateSub: string;
  time: string;
  status: "Confirmado" | "Pendente" | "Cancelado";
}

type SortKey = "clientName" | "service" | "date" | "time" | "status";
type SortDir = "asc" | "desc";

const allAppointments: Appointment[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  clientName: "Moises",
  clientSub: "Araújo",
  service: "Corte de cabelo",
  serviceSub: "Barbearia NJ",
  date: "06/07/2026",
  dateSub: "Quinta-feira",
  time: "08:30",
  status: "Confirmado",
}));

const STATUS_OPTIONS = [
  "Todos os status",
  "Confirmado",
  "Pendente",
  "Cancelado",
];

const statCards = [
  { label: "Total de clientes", value: "128" },
  { label: "Agendamentos hoje", value: "14" },
  { label: "Confirmados", value: "9" },
  { label: "Pendentes", value: "5" },
];

export function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [dateRange] = useState("06/07 – 08/07");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = allAppointments.filter((a) => {
    const matchSearch =
      search === "" ||
      a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.clientSub.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Todos os status" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp />
      ) : (
        <ChevronDown />
      )
    ) : (
      <span className={styles.sortPlaceholder}>
        <ChevronDown />
      </span>
    );

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.statsGrid}>
          {statCards.map((card) => (
            <div key={card.label} className={styles.statCard}>
              <p className={styles.statValue}>{card.value}</p>
              <p className={styles.statLabel}>{card.label}</p>
            </div>
          ))}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                className={styles.searchInput}
                placeholder="Buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.toolbarRight}>
              <div className={styles.statusDropdownWrap}>
                <select
                  className={styles.toolbarBtn}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button className={styles.toolbarBtn}>{dateRange}</button>

              <button className={styles.toolbarBtnOutlined}>
                <FilterIcon />
                Mais filtros
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thAvatar} />
                  {(
                    [
                      { key: "clientName", label: "Cliente" },
                      { key: "service", label: "Serviço" },
                      { key: "date", label: "Data" },
                      { key: "time", label: "Hora" },
                      { key: "status", label: "Status" },
                    ] as { key: SortKey; label: string }[]
                  ).map((col) => (
                    <th
                      key={col.key}
                      className={styles.th}
                      onClick={() => handleSort(col.key)}
                    >
                      <span className={styles.thInner}>
                        {col.label}
                        <span className={styles.sortIcon}>
                          <SortIcon col={col.key} />
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={styles.tdAvatar}>
                      <div className={styles.avatar} />
                    </td>
                    <td className={styles.td}>
                      <p className={styles.cellPrimary}>{row.clientName}</p>
                      <p className={styles.cellSub}>{row.clientSub}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.cellPrimary}>{row.service}</p>
                      <p className={styles.cellSub}>{row.serviceSub}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.cellPrimary}>{row.date}</p>
                      <p className={styles.cellSub}>{row.dateSub}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.cellPrimary}>{row.time}</p>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${styles[`badge${row.status}`]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      Nenhum resultado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
