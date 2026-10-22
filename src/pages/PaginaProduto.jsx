import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera, onRegistrarListaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = produto.estoque === 0
  const valorProduto = Number(produto.price || 0)
  const valorRestanteFrete = Math.max(0, 200 - valorProduto)
  const temFreteGratis = valorProduto >= 200
  const relacionadas = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        Number(item.estoque) > 0
    )
    .slice(0, 4)
  const quantidadeEspera = listaEspera.filter((item) => item.produtoId === produto.id).length

  function handleSubmit(event) {
    event.preventDefault()

    if (!formulario.nome.trim() || !formulario.email.trim()) {
      setMensagemEspera('Preencha nome e e-mail para entrar na lista de espera.')
      return
    }

    const cadastrado = onRegistrarListaEspera(produto.id, formulario.nome, formulario.email)

    if (!cadastrado) {
      setMensagemEspera('Você já está na lista de espera para este produto.')
      return
    }

    setFormulario({ nome: '', email: '' })
    setMensagemEspera('Você foi adicionado à lista de espera. Vamos avisar quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          <p className="detalhe-descricao">{produto.description}</p>

          <p className={temFreteGratis ? 'mensagem-frete mensagem-frete-gratis' : 'mensagem-frete'}>
            {temFreteGratis
              ? 'Frete grátis liberado para esta compra.'
              : `Faltam ${formatarPreco(valorRestanteFrete)} para ganhar frete grátis.`}
          </p>

          {esgotado ? (
            <p className="detalhe-estoque detalhe-estoque-esgotado">Produto esgotado</p>
          ) : (
            <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>
          )}

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={esgotado}
          >
            {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <div className="card-lista-espera">
              <h2>Avise-me quando voltar</h2>
              <p className="lista-espera-resumo">
                {quantidadeEspera > 0
                  ? `${quantidadeEspera} pessoa${quantidadeEspera > 1 ? 's' : ''} na lista de espera.`
                  : 'Seja o primeiro a receber o aviso.'}
              </p>

              <form className="formulario-espera" onSubmit={handleSubmit}>
                <label>
                  Nome
                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(event) =>
                      setFormulario((atual) => ({ ...atual, nome: event.target.value }))
                    }
                    placeholder="Seu nome"
                  />
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    value={formulario.email}
                    onChange={(event) =>
                      setFormulario((atual) => ({ ...atual, email: event.target.value }))
                    }
                    placeholder="seu@email.com"
                  />
                </label>

                <button type="submit" className="botao botao-secundario botao-grande">
                  Quero receber o aviso
                </button>
              </form>

              {mensagemEspera && <p className="mensagem-espera">{mensagemEspera}</p>}
            </div>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionadas.length === 0 ? (
          <p className="estado-vazio estado-vazio-amplo">
            Não há produtos relacionados disponíveis no momento.
          </p>
        ) : (
          relacionadas.map((item) => <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />)
        )}
      </div>
    </section>
  )
}
