export default function ListaUsuarios({ usuarios, aoEditar, aoExcluir }) {
  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          {u.name} - {u.email}{' '}
          <button onClick={() => aoEditar(u)}>Editar</button>
          <button onClick={() => aoExcluir(u.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  )
}
