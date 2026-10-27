import { useEffect, useState } from 'react'

export default function FormularioUsuario({ usuario, aoSalvar, aoCancelar }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setNome(usuario ? usuario.name : '')
    setEmail(usuario ? usuario.email : '')
  }, [usuario])

  function enviar(e) {
    e.preventDefault()
    aoSalvar({ name: nome, email })
    if (!usuario) {
      setNome('')
      setEmail('')
    }
  }

  return (
    <form onSubmit={enviar}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">{usuario ? 'Salvar' : 'Criar'}</button>
      {usuario && <button type="button" onClick={aoCancelar}>Cancelar</button>}
    </form>
  )
}
