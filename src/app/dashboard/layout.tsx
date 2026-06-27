'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import MenuLateral from '@/components/MenuLateral'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [perfil, setPerfil] = useState<any>(null)

  useEffect(() => {
    carregarPerfil()
  }, [])

  async function carregarPerfil() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    const { data } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', user.id)
      .single()

    setPerfil(data)
  }

  if (!perfil) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
        Carregando...
      </main>
    )
  }

  return (
    <main className="flex min-h-screen bg-zinc-900 text-white">
      <MenuLateral
        nome={perfil.nome}
        cargo={perfil.cargo}
      />

      <div className="flex-1 p-8">
        {children}
      </div>
    </main>
  )
}