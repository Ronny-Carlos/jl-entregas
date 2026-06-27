'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function login() {
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error) {
    toast.error(error.message)
    return
  }

  const user = data.user

  const { data: perfil, error: perfilError } =
    await supabase
      .from('perfis')
      .select('ativo')
      .eq('id', user.id)
      .single()

  if (perfilError) {
    await supabase.auth.signOut()

    toast.error('Erro ao verificar usuário.')

    return
  }

  if (!perfil?.ativo) {
    await supabase.auth.signOut()

    toast.error(
      'Seu usuário está desativado. Entre em contato com o administrador.'
    )

    return
  }

  toast.success('Login realizado!')

  router.push('/dashboard')
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 p-8 text-white">
      <Toaster position="top-right" />

      <div className="w-full max-w-md rounded-2xl bg-zinc-800 p-8 shadow-2xl">

        <h1 className="mb-8 text-center text-4xl font-bold">
          JL Entregas 🚚
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
          />

          <button
            onClick={login}
            className="rounded-lg bg-green-600 p-3 font-bold transition hover:bg-green-700"
          >
            Entrar
          </button>

        </div>
      </div>
    </main>
  )
}