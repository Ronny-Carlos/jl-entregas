type Props = {
  pesquisa: string
  setPesquisa: (value: string) => void
}

export default function BarraPesquisa({
  pesquisa,
  setPesquisa,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Pesquisar entrega..."
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
      className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
    />
  )
}