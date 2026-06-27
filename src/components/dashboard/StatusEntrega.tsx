type Props = {
  status: string
}

export default function StatusEntrega({
  status,
}: Props) {
  let cor = 'bg-yellow-500 text-black'

  if (status === 'Entregue') {
    cor = 'bg-green-600'
  }

  if (status === 'Em rota') {
    cor = 'bg-blue-600'
  }

  if (status === 'Não entregue') {
    cor = 'bg-red-600'
  }

  return (
    <span
      className={`ml-auto rounded-full px-3 py-1 text-sm font-bold ${cor}`}
    >
      {status}
    </span>
  )
}