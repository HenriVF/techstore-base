import { get } from './api'

function normalizarPreco(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) && valor > 0 ? valor : null
  }
  if (typeof valor === 'string') {
    let limpo = valor.replace(/[^\d.,-]/g, '')
    if (limpo.includes(',')) limpo = limpo.replace(/\./g, '').replace(',', '.')
    const numero = Number(limpo)
    return limpo !== '' && Number.isFinite(numero) && numero > 0 ? numero : null
  }
  return null
}

export function buscarProdutos() {
  return get('/products.json').then((lista) =>
    lista
      .map((produto) => {
        const price = normalizarPreco(produto.price)
        const precoOriginal = normalizarPreco(produto.precoOriginal)
        const estoque = Number(produto.estoque) || 0

        return {
          ...produto,
          estoque,
          price,
          precoOriginal: precoOriginal ?? undefined,
          semPreco: price === null,
        }
      })
      .filter((produto) => produto.price && Number(produto.estoque) > 0)
  )
}