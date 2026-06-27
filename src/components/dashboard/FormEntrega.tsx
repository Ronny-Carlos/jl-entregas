type Props = {
  cliente: string
  endereco: string
  produto: string
  codigoPedido: string
  observacao: string

  setCliente: (value: string) => void
  setEndereco: (value: string) => void
  setProduto: (value: string) => void
  setCodigoPedido: (value: string) => void
  setObservacao: (value: string) => void

  cadastrarEntrega: () => void
}

export default function FormEntrega({
  cliente,
  endereco,
  produto,
  codigoPedido,
  observacao,
  setCliente,
  setEndereco,
  setProduto,
  setCodigoPedido,
  setObservacao,
  cadastrarEntrega,
}: Props) {
  return (
    <div className="rounded-2xl bg-zinc-800 p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold">
        Nova entrega
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
        />

        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
        />

        <input
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
        />

        <input
          type="text"
          placeholder="Código do pedido"
          value={codigoPedido}
          onChange={(e) => setCodigoPedido(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
        />

        <input
          type="text"
          placeholder="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
        />

        <button
          onClick={cadastrarEntrega}
          className="rounded-lg bg-green-600 p-3 font-bold transition hover:bg-green-700"
        >
          Cadastrar entrega
        </button>
      </div>
    </div>
  )
}