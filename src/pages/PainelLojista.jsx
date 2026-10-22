import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = [
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
]

export default function PainelLojista({ produtos, listaEspera = [] }) {
  const categoriaResumo = CATEGORIAS.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria.id)
    const valorEmEstoque = itens
      .filter((produto) => produto.price && produto.estoque > 0)
      .reduce((total, produto) => total + produto.price * produto.estoque, 0)

    const semPreco = itens.filter((produto) => produto.semPreco).length
    const clientesEsperando = listaEspera.filter((item) =>
      itens.some((produto) => produto.id === item.produtoId)
    ).length

    const lucroEstimado = itens
      .filter((produto) => produto.price && produto.estoque > 0)
      .reduce((total, produto) => {
        const margem = produto.precoOriginal && produto.precoOriginal > produto.price ? 0.25 : 0.3
        return total + produto.price * produto.estoque * margem
      }, 0)

    return {
      ...categoria,
      itens,
      valorEmEstoque,
      semPreco,
      clientesEsperando,
      lucroEstimado,
    }
  })

  const totalEstoque = categoriaResumo.reduce((total, categoria) => total + categoria.valorEmEstoque, 0)
  const totalLucro = categoriaResumo.reduce((total, categoria) => total + categoria.lucroEstimado, 0)
  const totalAguardandoPreco = produtos.filter((produto) => produto.semPreco).length
  const totalClientesEsperando = listaEspera.length

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>

      <div className="painel-resumo">
        <div className="painel-card">
          <span className="painel-rotulo">Valor em estoque</span>
          <strong>{formatarPreco(totalEstoque)}</strong>
        </div>

        <div className="painel-card">
          <span className="painel-rotulo">Produtos esperando preço</span>
          <strong>{totalAguardandoPreco}</strong>
        </div>

        <div className="painel-card">
          <span className="painel-rotulo">Clientes esperando volta</span>
          <strong>{totalClientesEsperando}</strong>
        </div>

        <div className="painel-card">
          <span className="painel-rotulo">Lucro estimado</span>
          <strong>{formatarPreco(totalLucro)}</strong>
        </div>
      </div>

      <div className="painel-grid">
        {categoriaResumo.map((categoria) => (
          <article key={categoria.id} className="painel-categoria">
            <div className="painel-categoria-topo">
              <h2>{categoria.nome}</h2>
              <span className="selo selo-ok">{categoria.itens.length} itens</span>
            </div>

            <ul className="painel-metrica">
              <li>
                <span>Valor em estoque</span>
                <strong>{formatarPreco(categoria.valorEmEstoque)}</strong>
              </li>
              <li>
                <span>Esperando preço</span>
                <strong>{categoria.semPreco}</strong>
              </li>
              <li>
                <span>Clientes esperando</span>
                <strong>{categoria.clientesEsperando}</strong>
              </li>
              <li>
                <span>Lucro estimado</span>
                <strong>{formatarPreco(categoria.lucroEstimado)}</strong>
              </li>
            </ul>
          </article>
        ))}
      </div>

      <div className="painel-acao">
        <Link to="/estoque" className="botao botao-secundario">
          Ver estoque detalhado
        </Link>
      </div>
    </section>
  )
}
