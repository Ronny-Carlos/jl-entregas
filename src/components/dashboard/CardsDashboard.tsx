type Props = {
  entregas: any[]
}

export default function CardsDashboard({
  entregas,
}: Props) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-5">

      <div className="rounded-2xl bg-zinc-800 p-5 shadow-xl">
        <p>Total</p>

        <h2 className="mt-2 text-4xl font-bold">
          {entregas.length}
        </h2>
      </div>

      <div className="rounded-2xl bg-yellow-600 p-5 shadow-xl">
        <p>Pendentes</p>

        <h2 className="mt-2 text-4xl font-bold">
          {
            entregas.filter(
              (e) => e.status === 'Pendente'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-2xl bg-blue-600 p-5 shadow-xl">
        <p>Em rota</p>

        <h2 className="mt-2 text-4xl font-bold">
          {
            entregas.filter(
              (e) => e.status === 'Em rota'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-2xl bg-green-600 p-5 shadow-xl">
        <p>Entregues</p>

        <h2 className="mt-2 text-4xl font-bold">
          {
            entregas.filter(
              (e) => e.status === 'Entregue'
            ).length
          }
        </h2>
      </div>

      <div className="rounded-2xl bg-red-600 p-5 shadow-xl">
        <p>Não entregues</p>

        <h2 className="mt-2 text-4xl font-bold">
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