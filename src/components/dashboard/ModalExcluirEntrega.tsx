type Props = {
  modalExcluir: boolean
  setModalExcluir: (value: boolean) => void
  setEntregaSelecionada: (value: any) => void
  excluirEntrega: () => void
}

export default function ModalExcluirEntrega({
  modalExcluir,
  setModalExcluir,
  setEntregaSelecionada,
  excluirEntrega,
}: Props) {
  if (!modalExcluir) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-md rounded-2xl bg-zinc-800 p-6 shadow-2xl">

        <h2 className="mb-4 text-2xl font-bold">
          Excluir entrega
        </h2>

        <p className="mb-6 text-zinc-300">
          Deseja realmente excluir esta entrega?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={() => {
              setModalExcluir(false)
              setEntregaSelecionada(null)
            }}
            className="rounded-lg bg-zinc-700 px-4 py-2 font-bold"
          >
            Cancelar
          </button>

          <button
            onClick={excluirEntrega}
            className="rounded-lg bg-red-600 px-4 py-2 font-bold"
          >
            Excluir
          </button>

        </div>

      </div>

    </div>
  )
}