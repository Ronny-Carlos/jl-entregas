
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
  const estiloInput =
    "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  return (
    <div className="rounded-2xl border border-zinc-700/70 bg-zinc-800 p-6 shadow-lg">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Nova entrega
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Preencha os dados para cadastrar uma entrega.
        </p>
      </div>

      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Nome do cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className={estiloInput}
        />

        <input
          type="text"
          placeholder="Endereço de entrega"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className={estiloInput}
        />

        <input
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          className={estiloInput}
        />

        <input
          type="text"
          placeholder="Código do pedido"
          value={codigoPedido}
          onChange={(e) => setCodigoPedido(e.target.value)}
          className={estiloInput}
        />

        <input
          type="text"
          placeholder="Observação (opcional)"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className={estiloInput}
        />

        <button
          onClick={cadastrarEntrega}
          className="mt-2 w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-green-900/20 transition duration-200 hover:bg-green-500 active:scale-[0.98]"
        >
          Cadastrar entrega
        </button>

      </div>
    </div>
  )
}
