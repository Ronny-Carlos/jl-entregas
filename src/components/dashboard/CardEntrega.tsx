
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
  const estiloBotao =
    "rounded-lg px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:brightness-110 active:scale-95"

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 transition duration-200 hover:border-zinc-600">

      {/* Cabeçalho */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Cliente
          </p>

          <h3 className="mt-1 text-base font-bold text-white">
            {entrega.cliente}
          </h3>
        </div>

        <StatusEntrega status={entrega.status} />
      </div>

      {/* Informações da entrega */}
      <div className="grid gap-3 sm:grid-cols-2">

        <div>
          <p className="text-xs text-zinc-500">
            Endereço
          </p>
          <p className="mt-1 text-sm text-zinc-200">
            {entrega.endereco || 'Não informado'}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            Produto
          </p>
          <p className="mt-1 text-sm text-zinc-200">
            {entrega.produto || 'Não informado'}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            Código do pedido
          </p>
          <p className="mt-1 text-sm text-zinc-200">
            {entrega.codigo_pedido || 'Não informado'}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            Observação
          </p>
          <p className="mt-1 text-sm text-zinc-200">
            {entrega.observacao || 'Nenhuma observação'}
          </p>
        </div>

      </div>

      {/* Ações */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-800 pt-4">

        <button
          onClick={() => atualizarStatus(entrega.id, 'Em rota')}
          className={`${estiloBotao} bg-blue-600`}
        >
          Em rota
        </button>

        <button
          onClick={() => atualizarStatus(entrega.id, 'Entregue')}
          className={`${estiloBotao} bg-green-600`}
        >
          Entregue
        </button>

        <button
          onClick={() => atualizarStatus(entrega.id, 'Não entregue')}
          className={`${estiloBotao} bg-red-600`}
        >
          Não entregue
        </button>

        <button
          onClick={() => editarEntrega(entrega)}
          className={`${estiloBotao} bg-yellow-600`}
        >
          Editar
        </button>

        {perfil?.cargo === 'master' && (
          <button
            onClick={() => excluirEntrega(entrega)}
            className={`${estiloBotao} bg-zinc-700 hover:bg-zinc-600`}
          >
            Excluir
          </button>
        )}

      </div>
    </div>
  )
}
