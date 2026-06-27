type Props = {
  modalEditar: boolean
  novoCliente: string
  novoEndereco: string
  novoProduto: string
  novoCodigoPedido: string
  novaObservacao: string

  setNovoCliente: (value: string) => void
  setNovoEndereco: (value: string) => void
  setNovoProduto: (value: string) => void
  setNovoCodigoPedido: (value: string) => void
  setNovaObservacao: (value: string) => void

  setModalEditar: (value: boolean) => void
  setEntregaSelecionada: (value: any) => void

  editarEntrega: () => void
}

export default function ModalEditarEntrega({
  modalEditar,
  novoCliente,
  novoEndereco,
  novoProduto,
  novoCodigoPedido,
  novaObservacao,
  setNovoCliente,
  setNovoEndereco,
  setNovoProduto,
  setNovoCodigoPedido,
  setNovaObservacao,
  setModalEditar,
  setEntregaSelecionada,
  editarEntrega,
}: Props) {
  if (!modalEditar) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-md rounded-2xl bg-zinc-800 p-6 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold">
          Editar entrega
        </h2>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Cliente"
            value={novoCliente}
            onChange={(e) =>
              setNovoCliente(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={novoEndereco}
            onChange={(e) =>
              setNovoEndereco(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <input
            type="text"
            placeholder="Produto"
            value={novoProduto}
            onChange={(e) =>
              setNovoProduto(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <input
            type="text"
            placeholder="Código do pedido"
            value={novoCodigoPedido}
            onChange={(e) =>
              setNovoCodigoPedido(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <input
            type="text"
            placeholder="Observação"
            value={novaObservacao}
            onChange={(e) =>
              setNovaObservacao(e.target.value)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={() => {
              setModalEditar(false)
              setEntregaSelecionada(null)
            }}
            className="rounded-lg bg-zinc-700 px-4 py-2 font-bold"
          >
            Cancelar
          </button>

          <button
            onClick={editarEntrega}
            className="rounded-lg bg-yellow-600 px-4 py-2 font-bold"
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  )
}