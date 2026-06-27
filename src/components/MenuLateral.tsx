'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Props = {
  nome?: string
  cargo?: string
}

export default function MenuLateral({
  nome,
  cargo,
}: Props) {
  const router = useRouter()

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 flex-col justify-between">

      <div>

        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white">
            JL Entregas
          </h1>

          <p className="text-zinc-400 text-sm mt-1">
            Sistema de Gestão
          </p>
        </div>

        <nav className="p-4 flex flex-col gap-2">

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg bg-zinc-800 p-3 text-left text-white hover:bg-zinc-700 transition"
          >
            🏠 Dashboard
          </button>

          {cargo === 'master' && (
            <button
              onClick={() =>
                router.push('/dashboard/usuarios')
              }
              className="w-full rounded-lg bg-zinc-800 p-3 text-left text-white hover:bg-zinc-700 transition"
            >
              👥 Usuários
            </button>
          )}

        </nav>

      </div>

      <div className="border-t border-zinc-800 p-6">

        <p className="font-bold text-white">
          {nome}
        </p>

        <p className="text-sm text-zinc-400 mb-4">
          {cargo}
        </p>

        <button
          onClick={sair}
          className="w-full rounded-lg bg-red-600 p-3 font-bold text-white hover:bg-red-700 transition"
        >
          Sair
        </button>

      </div>

    </aside>
  )
}