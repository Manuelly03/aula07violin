export const BASE_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  constructor(status, statusText, message) {
    super(message || `${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

export async function requisicao(caminho, opcoes = {}) {
  const { signal, headers, body, ...resto } = opcoes

  const configuracoes = {
    ...resto,
    headers: { 'Content-Type': 'application/json', ...headers },
  }

  if (signal) configuracoes.signal = signal
  if (body !== undefined) configuracoes.body = JSON.stringify(body)

  const resp = await fetch(`${BASE_URL}${caminho}`, configuracoes)

  if (!resp.ok) throw new ApiError(resp.status, resp.statusText)
  if (resp.status === 204) return null

  return await resp.json()
}

export async function apiGet(caminho, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'GET' })
}

export async function apiPost(caminho, body, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'POST', body })
}

export async function apiPut(caminho, body, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'PUT', body })
}

export async function apiDelete(caminho, opcoes = {}) {
  return requisicao(caminho, { ...opcoes, method: 'DELETE' })
}

export function mensagemDeErro(e) {
  if (e.name === 'ApiError' && e.status === 404) return 'Recurso não encontrado'
  if (e.name === 'ApiError' && e.status >= 500) return 'Erro no servidor'
  if (e.name === 'ApiError') return `Erro ${e.status}`
  return 'Falha de rede'
}
