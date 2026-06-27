import BarraPesquisa from './BarraPesquisa'
import CardEntrega from './CardEntrega'

type Props = {
  entregas: any[]
  pesquisa: string
  setPesquisa: (value: string) => void
  perfil: any
  atualizarStatus: (id: number, status: string) => Promise<void>
  editarEntrega: (entrega: any) => void
  excluirEntrega: (entrega: any) => void
}

export default function ListaEntregas({
  entregas,
  pesquisa,
  setPesquisa,
  perfil,
  atualizarStatus,
  editarEntrega,
  excluirEntrega,
}: Props) {
  return (
    <div className="rounded-2xl bg-zinc-800 p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold">
        Entregas cadastradas
      </h2>

      <BarraPesquisa
        pesquisa={pesquisa}
        setPesquisa={setPesquisa}
      />

      <div className="flex max-h-[600px] flex-col gap-4 overflow-y-auto">
        {entregas
          .filter((entrega) => {
            return (
              entrega.cliente
                ?.toLowerCase()
                .includes(pesquisa.toLowerCase()) ||
              entrega.produto
                ?.toLowerCase()
                .includes(pesquisa.toLowerCase())
            )
          })
          .map((entrega) => (
            <CardEntrega
              key={entrega.id}
              entrega={entrega}
              perfil={perfil}
              atualizarStatus={atualizarStatus}
              editarEntrega={editarEntrega}
              excluirEntrega={excluirEntrega}
            />
          ))}
      </div>
    </div>
  )
}