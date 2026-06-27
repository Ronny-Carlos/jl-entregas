'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

type Usuario = {
  id: string
  nome: string
  email: string
  cargo: 'master' | 'vendedor' | 'entregador'
  ativo: boolean
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] = useState('vendedor')

  const [pesquisa, setPesquisa] = useState('')

  useEffect(() => {
    iniciar()
  }, [])

  async function iniciar() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    const { data: perfil } = await supabase
      .from('perfis')
      .select('cargo')
      .eq('id', user.id)
      .single()

    if (!perfil || perfil.cargo !== 'master') {
      toast.error('Sem permissão.')
      window.location.href = '/dashboard'
      return
    }

    await buscarUsuarios()

    setCarregando(false)
  }

  async function buscarUsuarios() {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('nome')

    if (error) {
      toast.error(error.message)
      return
    }

    setUsuarios((data as Usuario[]) || [])
  }

  async function criarUsuario() {
    const response = await fetch('/api/criar-usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
        cargo,
      }),
    })

    const resultado = await response.json()

    if (!response.ok) {
      toast.error(resultado.error)
      return
    }

    toast.success('Usuário criado!')

    setNome('')
    setEmail('')
    setSenha('')
    setCargo('vendedor')

    buscarUsuarios()
  }

  async function alterarStatus(id: string, ativo: boolean) {
    const { error } = await supabase
      .from('perfis')
      .update({
        ativo: !ativo,
      })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(
      ativo ? 'Usuário desativado!' : 'Usuário ativado!'
    )

    buscarUsuarios()
  }

    if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
        <h1 className="text-3xl font-bold">
          Carregando...
        </h1>
      </main>
    )
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = pesquisa.toLowerCase()

    return (
      usuario.nome?.toLowerCase().includes(texto) ||
      usuario.email?.toLowerCase().includes(texto) ||
      usuario.cargo?.toLowerCase().includes(texto)
    )
  })

  return (
    <main className="min-h-screen bg-zinc-900 p-8 text-white">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Usuários
            </h1>

            <p className="text-zinc-400 mt-2">
              Painel administrativo
            </p>
          </div>

          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="rounded-lg bg-zinc-700 px-5 py-2 font-bold hover:bg-zinc-600 transition"
          >
            Voltar
          </button>

        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-zinc-800 p-5">
            <p className="text-sm text-zinc-400">
              Total
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {usuarios.length}
            </h2>
          </div>

          <div className="rounded-xl bg-zinc-800 p-5">
            <p className="text-sm text-zinc-400">
              Masters
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {usuarios.filter(u => u.cargo === 'master').length}
            </h2>
          </div>

          <div className="rounded-xl bg-zinc-800 p-5">
            <p className="text-sm text-zinc-400">
              Vendedores
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {usuarios.filter(u => u.cargo === 'vendedor').length}
            </h2>
          </div>

          <div className="rounded-xl bg-zinc-800 p-5">
            <p className="text-sm text-zinc-400">
              Entregadores
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {usuarios.filter(u => u.cargo === 'entregador').length}
            </h2>
          </div>

        </div>

        <div className="mb-8 rounded-2xl bg-zinc-800 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            Criar usuário
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <select
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            >
              <option value="vendedor">Vendedor</option>
              <option value="entregador">Entregador</option>
              <option value="master">Master</option>
            </select>

          </div>

          <button
            onClick={criarUsuario}
            className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-bold hover:bg-green-700"
          >
            Criar usuário
          </button>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            Usuários cadastrados
          </h2>

          <input
            className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
            placeholder="Pesquisar usuário..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />

          <div className="flex flex-col gap-4">

                      {usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                    {usuario.nome?.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <p className="text-lg font-bold">
                      {usuario.nome}
                    </p>

                    <p className="text-sm text-zinc-400">
                      {usuario.email || 'Sem e-mail'}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          usuario.cargo === 'master'
                            ? 'bg-red-600'
                            : usuario.cargo === 'vendedor'
                            ? 'bg-blue-600'
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {usuario.cargo.toUpperCase()}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          usuario.ativo
                            ? 'bg-green-600'
                            : 'bg-zinc-600'
                        }`}
                      >
                        {usuario.ativo ? 'ATIVO' : 'INATIVO'}
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  onClick={() =>
                    alterarStatus(usuario.id, usuario.ativo)
                  }
                  className={`rounded-lg px-5 py-2 font-bold transition ${
                    usuario.ativo
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {usuario.ativo ? 'Desativar' : 'Ativar'}
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>

    </main>
  )
}