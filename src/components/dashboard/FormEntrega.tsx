
type Props = {
  cliente: string
  telefone: string
  endereco: string
  codigoPedido: string
  observacao: string
  arquivoVenda: File | null

  setCliente: (value: string) => void
  setTelefone: (value: string) => void
  setEndereco: (value: string) => void
  setCodigoPedido: (value: string) => void
  setObservacao: (value: string) => void
  setArquivoVenda: (file: File | null) => void

  cadastrarEntrega: () => void
}

export default function FormEntrega({
  cliente,
  telefone,
  endereco,
  codigoPedido,
  observacao,
  arquivoVenda,
  setCliente,
  setTelefone,
  setEndereco,
  setCodigoPedido,
  setObservacao,
  setArquivoVenda,
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
          type="tel"
          placeholder="Telefone / WhatsApp"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
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

        <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/50 p-4">
          <label className="mb-2 block text-sm font-medium text-white">
            Arquivo da venda
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) =>
              setArquivoVenda(e.target.files?.[0] ?? null)
            }
            className="w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-500"
          />

          <p className="mt-2 text-xs text-zinc-400">
            Formatos permitidos: PDF, JPG e PNG. Tamanho máximo: 10 MB.
          </p>

          {arquivoVenda && (
            <p className="mt-2 break-all text-sm text-green-400">
              Arquivo selecionado: {arquivoVenda.name}
            </p>
          )}
        </div>

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
