export type OpenCnpj = {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  situacao_cadastral: string
  data_situacao_cadastral: string
  matriz_filial: string
  data_inicio_atividade: string
  cnae_principal: string
  cnaes_secundarios: Array<string>
  cnaes: Array<{
    codigo: string
    descricao: string
    is_principal: boolean
  }>
  natureza_juridica: string
  tipo_logradouro: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  uf: string
  municipio: string
  codigo_municipio: string
  email: string
  telefones: Array<{
    ddd: string
    numero: string
    is_fax: boolean
  }>
  capital_social: string
  qualificacao_responsavel: {
    codigo: string
    descricao: string
  }
  ente_federativo: string
  porte_empresa: string
  opcao_simples: string
  data_opcao_simples: string
  data_exclusao_simples: string
  opcao_mei: string
  data_opcao_mei: string
  data_exclusao_mei: string
  motivo_situacao_cadastral: {
    codigo: string
    descricao: string
  }
  nome_cidade_exterior: string
  codigo_pais: string
  pais: {
    codigo: string
    descricao: string
  }
  situacao_especial: string
  data_situacao_especial: string
  QSA: Array<undefined>
}
