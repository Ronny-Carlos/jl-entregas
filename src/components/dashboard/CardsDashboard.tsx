
type Props = {
  entregas: any[]
}

export default function CardsDashboard({
  entregas,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">

      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-lg transition hover:border-zinc-500">
        <p className="text-sm font-medium text-zinc-400">
          Total
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          {entregas.length}
        </h2>
      </div>

      <div className="rounded-xl border border-yellow-600/30 bg-zinc-800 p-5 shadow-lg transition hover:border-yellow-500">
        <p className="text-sm font-medium text-yellow-500">
          Pendentes
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          {
            entregas.filter(
              (e) => e.status === 'Pendente'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-xl border border-blue-600/30 bg-zinc-800 p-5 shadow-lg transition hover:border-blue-500">
        <p className="text-sm font-medium text-blue-400">
          Em rota
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          {
            entregas.filter(
              (e) => e.status === 'Em rota'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-xl border border-green-600/30 bg-zinc-800 p-5 shadow-lg transition hover:border-green-500">
        <p className="text-sm font-medium text-green-400">
          Entregues
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          {
            entregas.filter(
              (e) => e.status === 'Entregue'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-xl border border-red-600/30 bg-zinc-800 p-5 shadow-lg transition hover:border-red-500">
        <p className="text-sm font-medium text-red-400">
          Não entregues
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          {
            entregas.filter(
              (e) => e.status === 'Não entregue'
            ).length
          }
        </h2>
      </div>

    </div>
  )
}
