import StatusEntrega from './StatusEntrega'

type Props = {
  entrega: any
  perfil: any
  atualizarStatus: (id: number, status: string) => Promise<void>
  editarEntrega: (entrega: any) => void
  excluirEntrega: (entrega: any) => void
}

export default function CardEntrega({
  entrega,
  perfil,
  atualizarStatus,
  editarEntrega,
  excluirEntrega,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <p>
        <strong>Cliente:</strong> {entrega.cliente}
      </p>

      <p>
        <strong>Endereço:</strong> {entrega.endereco}
      </p>

      <p>
        <strong>Produto:</strong> {entrega.produto}
      </p>

      <p>
        <strong>Código:</strong> {entrega.codigo_pedido}
      </p>

      <p>
        <strong>Observação:</strong> {entrega.observacao}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => atualizarStatus(entrega.id, 'Em rota')}
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold hover:bg-blue-700"
        >
          Em rota
        </button>

        <button
          onClick={() => atualizarStatus(entrega.id, 'Entregue')}
          className="rounded-lg bg-green-600 px-3 py-1 text-sm font-bold hover:bg-green-700"
        >
          Entregue
        </button>

        <button
          onClick={() => atualizarStatus(entrega.id, 'Não entregue')}
          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-bold hover:bg-red-700"
        >
          Não entregue
        </button>

        <button
          onClick={() => editarEntrega(entrega)}
          className="rounded-lg bg-yellow-600 px-3 py-1 text-sm font-bold hover:bg-yellow-700"
        >
          Editar
        </button>

        {perfil?.cargo === 'master' && (
          <button
            onClick={() => excluirEntrega(entrega)}
            className="rounded-lg bg-zinc-700 px-3 py-1 text-sm font-bold hover:bg-zinc-600"
          >
            Excluir
          </button>
        )}

        <StatusEntrega status={entrega.status} />
      </div>
    </div>
  )
}