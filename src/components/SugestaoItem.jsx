import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const valorProduto = Number(produto.price || 0)
  const valorRestanteFrete = Math.max(0, 200 - valorProduto)
  const temFreteGratis = valorProduto >= 200

  return (
    <article className="card sugestao-card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <div className="card-precos">
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <div className="card-selos">
        {temFreteGratis ? (
          <span className="selo selo-frete">Frete grátis</span>
        ) : (
          <span className="selo selo-alerta">Faltam {formatarPreco(valorRestanteFrete)} para frete grátis</span>
        )}
      </div>

      <button className="botao botao-pequeno" onClick={() => onAdicionar(produto)}>
        Comprar
      </button>
    </article>
  )
}
