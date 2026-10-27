import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete, mensagemDeErro } from './api'
import FormularioUsuario from './componentes/FormularioUsuario'
import ListaUsuarios from './componentes/ListaUsuarios'

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [emEdicao, setEmEdicao] = useState(null)

  useEffect(() => {
    const controle = new AbortController()

    async function buscar() {
      try {
        const data = await apiGet('/users', { signal: controle.signal })
        console.log(data)
        setUsuarios(data)
        setCarregando(false)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro(mensagemDeErro(e))
          setCarregando(false)
        }
      }
    }

    buscar()
    return () => controle.abort()
  }, [])

  async function salvar(dados) {
    setErro('')
    try {
      if (emEdicao) {
        const atualizado = await apiPut(`/users/${emEdicao.id}`, dados)
        setUsuarios(usuarios.map((u) => (u.id === emEdicao.id ? { ...u, ...atualizado } : u)))
        setEmEdicao(null)
      } else {
        const criado = await apiPost('/users', dados)
        setUsuarios([...usuarios, criado])
      }
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function excluir(id) {
    setErro('')
    try {
      await apiDelete(`/users/${id}`)
      setUsuarios(usuarios.filter((u) => u.id !== id))
      if (emEdicao && emEdicao.id === id) setEmEdicao(null)
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  return (
    <div>
      <h1>Usuários</h1>

      <FormularioUsuario
        usuario={emEdicao}
        aoSalvar={salvar}
        aoCancelar={() => setEmEdicao(null)}
      />

      {erro && <p>{erro}</p>}
      {carregando && <p>Carregando...</p>}
      {!carregando && usuarios.length === 0 && <p>Nenhum usuário.</p>}

      <ListaUsuarios usuarios={usuarios} aoEditar={setEmEdicao} aoExcluir={excluir} />
    </div>
  )
}
