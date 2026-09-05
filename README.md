# Agendei.com

Sistema de agendamentos online e gerenciamento de clientes desenvolvido como Trabalho de Conclusão de Curso.

O objetivo do Agendei.com é facilitar a gestão de agendamentos, clientes e informações empresariais em um só lugar, oferecendo uma solução simples, intuitiva e eficiente para empresas que precisam otimizar seu tempo e melhorar o atendimento aos clientes.

## Funcionalidades

- **Gestão de Agendamentos**: crie, edite e gerencie agendamentos de forma prática e rápida.
- **Criação de Agenda em etapas**: configure informações básicas, dias e horários, serviços e revise antes de finalizar.
- **Gestão de Clientes**: mantenha todas as informações dos seus clientes organizadas, com busca e filtros por status.
- **Perfil do Usuário**: visualize e edite suas informações pessoais e da empresa.
- **Cadastro e Login**: criação de conta com dados pessoais e empresariais.
- **Relatórios**: acompanhe estatísticas e indicadores importantes do seu negócio.

## Tecnologias

| Tecnologia        | Descrição                                   |
| ----------------- | ------------------------------------------- |
| React 19          | Biblioteca para construção de interfaces    |
| TypeScript        | Superset JavaScript com tipagem estática    |
| Vite              | Ferramenta de build e servidor de desenvolvimento |
| React Router 7    | Roteamento entre as páginas da aplicação    |
| CSS Modules       | Estilização isolada por componente          |
| Tabler Icons      | Conjunto de ícones                          |
| Biome             | Formatação e linting do código              |
| Bun               | Gerenciador de pacotes e executor de scripts |

## Instalando o Bun

O projeto utiliza o Bun como gerenciador de pacotes. Se você ainda não o possui instalado, siga as instruções abaixo.

### Linux e macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Verificando a instalação

Após instalar, reinicie o terminal e confirme que o Bun está disponível:

```bash
bun --version
```

## Como executar

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/tcc-3dsa-agendei/agendei-frontend.git
cd agendei-frontend
```

Instale as dependências:

```bash
bun install
```

Inicie o servidor de desenvolvimento:

```bash
bun run dev
```

Para gerar a versão de produção:

```bash
bun run build
```

Para pré-visualizar a versão de build:

```bash
bun run preview
```

## Estrutura do projeto

```
agendei-frontend/
├── src/
│   ├── assets/           # Imagens e recursos estáticos
│   ├── components/       # Componentes reutilizáveis (Sidebar, Footer)
│   ├── layout/           # Layout principal com sidebar e rodapé
│   ├── pages/            # Páginas da aplicação
│   ├── routes/           # Configuração de rotas
│   ├── app.tsx           # Componente raiz da aplicação
│   └── main.tsx          # Ponto de entrada
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json
```

## Rotas

| Rota            | Página                        |
| --------------- | ----------------------------- |
| `/`             | Apresentação (Hero Section)   |
| `/login`        | Login                         |
| `/register`     | Criação de conta              |
| `/home`         | Início                        |
| `/agenda`       | Agendas                       |
| `/nova-agenda`  | Criação de nova agenda        |
| `/clientes`     | Clientes                      |
| `/profile`      | Perfil do usuário             |
| `/about`        | Sobre nós                     |

## Equipe

| Membro            | Papel         |
| ----------------- | ------------- |
| Vitor Felipe      | Designer      |
| Vitor Felício     | Back-end      |
| Nelson Francisco  | Front-end     |
| Lucas Alves       | Documentação  |
| Moises Marques    | Front-end     |