// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const esperaPorProduto = produtos
    .map((produto) => ({
      produto,
      clientes: listaEspera.filter((item) => item.produtoId === produto.id),
    }))
    .filter(({ clientes }) => clientes.length > 0)
    .sort((a, b) => b.clientes.length - a.clientes.length)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="area-espera">
        <h2>Clientes na lista de espera</h2>

        {esperaPorProduto.length === 0 ? (
          <p className="aviso">Nenhum cliente aguardando reposição no momento.</p>
        ) : (
          <ul className="lista-espera-interna">
            {esperaPorProduto.map(({ produto, clientes }) => (
              <li key={produto.id} className="item-espera">
                <div className="item-espera-topo">
                  <strong>{produto.title}</strong>
                  <span className="selo selo-esgotado">{clientes.length} aguardando</span>
                </div>

                <ul className="clientes-espera">
                  {clientes.map((cliente) => (
                    <li key={cliente.id}>
                      <span>{cliente.nome}</span>
                      <span>{cliente.email}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
