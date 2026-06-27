'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import MenuLateral from '@/components/MenuLateral'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [cargoUsuario, setCargoUsuario] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] =
    useState('vendedor')

  useEffect(() => {
    async function carregar() {
      await verificarUsuario()
      await buscarUsuarios()
    }

    carregar()
  }, [])

  async function verificarUsuario() {
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

    setNomeUsuario(data?.nome || '')
    setCargoUsuario(data?.cargo || '')

    if (!data) {
      toast.error('Perfil não encontrado')
      setCarregando(false)
      return
    }

    if (data.cargo !== 'master') {
      toast.error('Sem permissão')
      window.location.href = '/dashboard'
      return
    }

    setCarregando(false)
  }

  async function buscarUsuarios() {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('nome')

    if (error) {
      toast.error('Erro ao buscar usuários')
      return
    }

    setUsuarios(data || [])
  }

  async function criarUsuario() {
    const response = await fetch(
      '/api/criar-usuario',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cargo,
        }),
      }
    )

    const resultado =
      await response.json()

    if (!response.ok) {
      toast.error(
        resultado.error ||
        'Erro ao criar usuário'
      )
      return
    }

    toast.success(
      'Usuário criado com sucesso!'
    )

    setNome('')
    setEmail('')
    setSenha('')
    setCargo('vendedor')

    buscarUsuarios()
  }

  async function alterarStatus(
    id: string,
    ativo: boolean
  ) {
    const {
      data,
      error,
    } = await supabase
      .from('perfis')
      .update({
        ativo: !ativo,
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error(error)

      toast.error(error.message)

      return
    }

    if (!data || data.length === 0) {
      toast.error(
        'Nenhum usuário foi atualizado.'
      )

      return
    }

    toast.success(
      ativo
        ? 'Usuário desativado!'
        : 'Usuário ativado!'
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

  return (
    <main className="min-h-screen bg-zinc-900 p-8 text-white">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Usuários
            </h1>

            <p className="mt-2 text-zinc-400">
              Painel administrativo
            </p>
          </div>
          <div className="mt-8 mb-8 grid gap-4 md:grid-cols-4">

            <div className="rounded-xl bg-zinc-800 p-5 shadow-lg">
              <p className="text-zinc-400 text-sm">
                Total
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {usuarios.length}
              </h2>
            </div>

            <div className="rounded-xl bg-zinc-800 p-5 shadow-lg">
              <p className="text-zinc-400 text-sm">
                Masters
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {
                  usuarios.filter(
                    (u) => u.cargo === 'master'
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-xl bg-zinc-800 p-5 shadow-lg">
              <p className="text-zinc-400 text-sm">
                Vendedores
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {
                  usuarios.filter(
                    (u) => u.cargo === 'vendedor'
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-xl bg-zinc-800 p-5 shadow-lg">
              <p className="text-zinc-400 text-sm">
                Entregadores
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {
                  usuarios.filter(
                    (u) => u.cargo === 'entregador'
                  ).length
                }
              </h2>
            </div>

          </div>

          <button
            onClick={() =>
            (window.location.href =
              '/dashboard')
            }
            className="rounded-lg bg-zinc-700 px-4 py-2 font-bold transition hover:bg-zinc-600"
          >
            Voltar
          </button>

        </div>

        <div className="mb-8 rounded-2xl bg-zinc-800 p-6 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold">
            Criar usuário
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
            />

            <select
              value={cargo}
              onChange={(e) =>
                setCargo(e.target.value)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"
            >
              <option value="vendedor">
                Vendedor
              </option>

              <option value="entregador">
                Entregador
              </option>

              <option value="master">
                Master
              </option>
            </select>

          </div>

          <button
            onClick={criarUsuario}
            className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-bold transition hover:bg-green-700"
          >
            Criar usuário
          </button>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-6 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold">
            Usuários cadastrados
          </h2>

          <div className="flex flex-col gap-4">

            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 md:flex-row md:items-center md:justify-between"
              >

                <div>
                  <p className="text-lg font-bold">
                    {usuario.nome}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {usuario.email ||
                      'Sem e-mail'}
                  </p>

                  <p className="mt-1 text-sm">
                    Cargo: {usuario.cargo}
                  </p>
                </div>

                <button
                  onClick={() =>
                    alterarStatus(
                      usuario.id,
                      usuario.ativo
                    )
                  }
                  className={`rounded-lg px-4 py-2 font-bold transition ${usuario.ativo
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {usuario.ativo
                    ? 'Desativar'
                    : 'Ativar'}
                </button>

              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  )
}