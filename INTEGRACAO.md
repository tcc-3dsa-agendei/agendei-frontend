# Integração implementada

A implementação segue `plano-integracao-frontend.md` e os handlers atuais de
`../agendei-backend/src/routes`. Nenhuma alteração de contrato no backend foi necessária.

## Executar localmente

1. No backend, configure o banco e as variáveis existentes e inicie a API conforme
   as instruções desse projeto.
2. No frontend, use pnpm 12, instale as dependências com `pnpm install` e copie
   `.env.example` para `.env` caso o arquivo ainda não exista.
3. Defina `VITE_BACKEND_URL=http://localhost:3333`, sem `/api` ao final.
4. Execute `pnpm dev --host localhost --port 5173 --strictPort` e acesse
   `http://localhost:5173`. O backend deve usar essa mesma origem em `FRONTEND_URL`
   e `BETTER_AUTH_URL=http://localhost:3333`.
5. O calendário usa `America/Sao_Paulo`; mantenha o backend com esse mesmo
   `SCHEDULING_TIME_ZONE` (valor padrão).

Cookies acompanham todas as requisições à API. Não misture `localhost` e
`127.0.0.1` nos endereços do frontend/backend. As migrações necessárias e o
estado do banco devem ser verificados conforme `../agendei-backend/CONTRATOS_DA_API.md`.

## Cobertura das telas

- Login/cadastro: senha mínima de oito caracteres, CNPJ com máscara e envio só de
  dígitos, erros inline e bloqueio de envios durante a requisição. Cadastro inicia
  a sessão automaticamente, conforme configuração do backend.
- Rotas privadas: o conteúdo só monta após a confirmação da sessão. Erros 401 nas
  rotas de negócio levam ao login. `/agendar` também é privado: a API atual opera
  apenas sobre os recursos da conta autenticada.
- Agendas: consulta de expedientes, edição/exclusão com erros de negócio,
  seleção de data e reservas do dia com serviço, cliente, horário e status.
- Novo expediente: quatro etapas, intervalo por dia, prevenção de dias duplicados,
  consulta dos serviços e revisão. Gravação sequencial; se houver falha parcial,
  os dias com resposta de sucesso ficam marcados e não são reenviados.
- Serviços: listagem paginada, cadastro, edição e exclusão com confirmação.
  Descrição/preço vazios são enviados como `null` para permitir limpeza na edição.
- Clientes: reservas, busca por nome/telefone, todos os status, período inclusivo
  no seletor de datas, paginação visual e estatísticas calculadas sobre todo o
  período consultado. Clientes únicos são identificados pelo telefone normalizado.
- Agendamento: serviço, calendário, slots livres pela duração, dados do cliente,
  revisão e confirmação baseada na resposta da API. Conflitos recarregam os dados
  e exigem selecionar outro horário; o backend continua sendo a autoridade final.
- Perfil: dados reais da sessão; consulta ao [OpenCNPJ](https://opencnpj.org/) com
  CNPJ normalizado, validação da resposta, cancelamento, timeout e nova tentativa.

## Decisões de contrato

O modelo de expediente não tem nome, descrição ou vínculo com serviços.
A primeira etapa explica o expediente semanal e a terceira permite consultar um
serviço para a revisão. Todos os serviços ficam disponíveis em todos os expedientes;
nenhuma associação fictícia é exibida como salva.

A API não persiste telefone da conta nem e-mail do cliente de uma reserva.
Esses campos foram retirados dos respectivos formulários para não coletar dados
que seriam descartados. O perfil apresenta somente consulta de dados.

A API filtra reservas por data, mas não por nome/status e não fornece totais.
O frontend percorre as páginas antes de aplicar esses filtros, estatísticas e
paginação visual; o calendário também lê todas as páginas do dia para não oferecer
vagas já ocupadas. Essa estratégia pode exigir muitas requisições para históricos
extensos; filtros e agregações no servidor são uma evolução futura.

Somente reservas canceladas liberam o intervalo no backend atual. As ações de
status respeitam os estados finais, o início para `no_show` e o término para
`completed`. Datas são convertidas pelo fuso IANA, independentemente do navegador;
o filtro `to` da API é exclusivo e recebe a meia-noite do dia seguinte.

A camada HTTP também disponibiliza atualização e exclusão de reservas. As telas
previstas neste plano usam criação, consulta e alteração de status.

## Verificação

```sh
pnpm test      # Node.js 24 ou superior
pnpm lint
pnpm build
```

A suíte usa `node:test` e `node:assert/strict`, sem novas dependências, com HTTP
e sessão simulados. O frontend e seus testes usam exclusivamente Node.js.
Os testes cobrem cookies, serialização, respostas 204, erros, paginação, fuso,
intervalos, estados, proteção de rotas e tratamento dos dados da empresa.

O comando habilita os mocks de módulos do Node (API experimental) e executa os
arquivos sequencialmente no mesmo processo. `tests/register.mjs` resolve o alias
`@/` e transpila JSX com o TypeScript já instalado; os arquivos `.ts` usam o
suporte nativo do Node. Não é necessário instalar outro runtime.

Os 27 testes foram executados com Node.js 26.8.2. Também é possível executar o
script sem o executor pnpm usando `node --run test`. TypeScript, Vite e Biome
foram verificados pelos binários locais. O lint tem três avisos preexistentes
(CSS e uma asserção em `main.tsx`); o build avisa sobre o tamanho do bundle
principal. A formatação foi aplicada aos arquivos alterados.

Não foi executado um fluxo no navegador com banco real nem aplicada migração.
Para validar ponta a ponta: criar conta, cadastrar serviço e expediente, fazer
reserva, conferir Agendas/Clientes, confirmar o atendimento e, após seu término,
concluí-lo. Verificar também conflito de horários, serviço vinculado impedindo
exclusão, sessão expirada e indisponibilidade do OpenCNPJ.
