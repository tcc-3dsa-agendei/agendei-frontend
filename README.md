# Agendei.com

Sistema de agendamentos online e gerenciamento de clientes desenvolvido como Trabalho de Conclusão de Curso.

O objetivo do Agendei.com é facilitar a gestão de agendamentos, clientes e informações empresariais em um só lugar, oferecendo uma solução simples, intuitiva e eficiente para empresas que precisam otimizar seu tempo e melhorar o atendimento aos clientes.

## Funcionalidades

- **Dashboard**: visão geral do negócio com indicadores e acesso rápido às principais funcionalidades.
- **Gestão de Agendamentos**: crie, edite e gerencie agendamentos de forma prática e rápida.
- **Criação de Agenda em etapas**: configure informações básicas, dias e horários, serviços e revise antes de finalizar.
- **Gestão de Clientes**: mantenha todas as informações dos seus clientes organizadas, com busca e filtros por status.
- **Perfil do Usuário**: visualize e edite suas informações pessoais e da empresa.
- **Cadastro e Login**: criação de conta com validação dos dados via Zod e máscaras automáticas para telefone e CNPJ.
- **Relatórios**: acompanhe estatísticas e indicadores importantes do seu negócio.

## Tecnologias

| Tecnologia          | Descrição                                        |
| ------------------- | ------------------------------------------------ |
| React 19            | Biblioteca para construção de interfaces         |
| TypeScript          | Superset JavaScript com tipagem estática         |
| Vite                | Ferramenta de build e servidor de desenvolvimento |
| React Router 7      | Roteamento entre as páginas da aplicação         |
| React Hook Form     | Gerenciamento de formulários                     |
| Zod                 | Validação de dados e schemas                     |
| better-auth         | Cliente de autenticação                          |
| use-mask-input      | Máscaras de entrada (telefone, CNPJ, etc.)       |
| @brazilian-utils    | Utilitários de validação brasileiros (CNPJ, telefone) |
| CSS Modules         | Estilização isolada por componente               |
| Tabler Icons        | Conjunto de ícones                               |
| Biome               | Formatação e linting do código                   |
| pnpm                | Gerenciador de pacotes e executor de scripts     |

## Variáveis de ambiente

O projeto valida as variáveis de ambiente em tempo de execução por meio do arquivo `src/env.ts` (Zod). A variável abaixo é obrigatória para o funcionamento do cliente de autenticação.

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

| Variável                     | Descrição                                        |
| ---------------------------- | ------------------------------------------------ |
| `VITE_BETTER_AUTH_CLIENT_URL` | URL base do servidor de autenticação (better-auth) |

## Instalando o pnpm

O projeto utiliza o pnpm como gerenciador de pacotes. Se você ainda não o possui instalado, siga as instruções abaixo.

### Windows

Abra o **PowerShell como administrador** e execute os comandos abaixo:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### Linux e macOS

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Verificando a instalação

Após instalar, reinicie o terminal e confirme que o pnpm está disponível:

```bash
pnpm --version
```

## Como executar

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/tcc-3dsa-agendei/agendei-frontend.git
cd agendei-frontend
```

Instale as dependências:

```bash
pnpm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Para gerar a versão de produção:

```bash
pnpm build
```

Para pré-visualizar a versão de build:

```bash
pnpm preview
```

Para executar o lint e a formatação:

```bash
pnpm lint
pnpm format
```

## Estrutura do projeto

```
agendei-frontend/
├── src/
│   ├── assets/           # Imagens e recursos estáticos
│   ├── components/       # Componentes reutilizáveis (Sidebar, Footer)
│   ├── layout/           # Layout principal com sidebar e rodapé
│   ├── lib/              # Cliente de autenticação e utilitários
│   ├── pages/            # Páginas da aplicação
│   ├── routes/           # Configuração de rotas
│   ├── env.ts            # Validação das variáveis de ambiente
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
| Vitor Felicio     | Back-end      |
| Nelson Francisco  | Front-end     |
| Lucas Alves       | Documentação  |
| Moisés Marques    | Front-end     |