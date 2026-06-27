'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import MenuLateral from '@/components/MenuLateral'
import CardsDashboard from '@/components/dashboard/CardsDashboard'
import FormEntrega from '@/components/dashboard/FormEntrega'
import ListaEntregas from '@/components/dashboard/ListaEntregas'
import ModalEditarEntrega from '@/components/dashboard/ModalEditarEntrega'
import ModalExcluirEntrega from '@/components/dashboard/ModalExcluirEntrega'

export default function Home() {
  const router = useRouter()

  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)

  const [cliente, setCliente] = useState('')
  const [endereco, setEndereco] = useState('')
  const [produto, setProduto] = useState('')
  const [codigoPedido, setCodigoPedido] =
    useState('')
  const [observacao, setObservacao] =
    useState('')

  const [entregas, setEntregas] =
    useState<any[]>([])

  const [pesquisa, setPesquisa] =
    useState('')

  const [modalEditar, setModalEditar] =
    useState(false)

  const [modalExcluir, setModalExcluir] =
    useState(false)

  const [entregaSelecionada,
    setEntregaSelecionada] =
    useState<any>(null)

  const [novoCliente, setNovoCliente] =
    useState('')

  const [novoEndereco, setNovoEndereco] =
    useState('')

  const [novoProduto, setNovoProduto] =
    useState('')

  const [novoCodigoPedido,
    setNovoCodigoPedido] =
    useState('')

  const [novaObservacao,
    setNovaObservacao] =
    useState('')

    useEffect(() => {
    verificarUsuario()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUsuario(session?.user ?? null)

        if (!session?.user) {
          router.push('/login')
          return
        }

        buscarEntregas()

        const { data } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setPerfil(data)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function verificarUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUsuario(user)

    buscarEntregas()

    const { data } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', user.id)
      .single()

    setPerfil(data)
  }

    async function logout() {
    await supabase.auth.signOut()

    setUsuario(null)
    setPerfil(null)

    toast.success('Logout realizado!')

    router.push('/login')
  }

  async function buscarEntregas() {
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error(error)
      toast.error('Erro ao buscar entregas')
      return
    }

    setEntregas(data || [])
  }

  async function cadastrarEntrega() {
    const { error } = await supabase
      .from('entregas')
      .insert([
        {
          cliente,
          endereco,
          produto,
          codigo_pedido: codigoPedido,
          observacao,
          status: 'Pendente',
        },
      ])

    if (error) {
      toast.error('Erro ao cadastrar entrega')
      return
    }

    toast.success('Entrega cadastrada!')

    setCliente('')
    setEndereco('')
    setProduto('')
    setCodigoPedido('')
    setObservacao('')

    buscarEntregas()
  }

  async function atualizarStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from('entregas')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
      return
    }

    toast.success('Status atualizado!')

    buscarEntregas()
  }

  async function editarEntrega() {
    if (!entregaSelecionada) return

    const { error } = await supabase
      .from('entregas')
      .update({
        cliente: novoCliente,
        endereco: novoEndereco,
        produto: novoProduto,
        codigo_pedido: novoCodigoPedido,
        observacao: novaObservacao,
      })
      .eq('id', entregaSelecionada.id)

    if (error) {
      toast.error('Erro ao editar entrega')
      return
    }

    toast.success('Entrega atualizada!')

    setModalEditar(false)
    setEntregaSelecionada(null)

    buscarEntregas()
  }

  async function excluirEntrega() {
    if (!entregaSelecionada) return

    const { error } = await supabase
      .from('entregas')
      .delete()
      .eq('id', entregaSelecionada.id)

    if (error) {
      toast.error('Erro ao excluir entrega')
      return
    }

    toast.success('Entrega excluída!')

    setModalExcluir(false)
    setEntregaSelecionada(null)

    buscarEntregas()
  }

  return (
    <main className="flex min-h-screen bg-zinc-900 text-white">
      <Toaster position="top-right" />



      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Sistema JL Entregas 🚚
            </h1>

            <p className="mt-2 text-zinc-400">
              Cargo: {perfil?.cargo}
            </p>
          </div>


        </div>

        <CardsDashboard entregas={entregas} />

        <div className="grid gap-8 lg:grid-cols-2">


          {perfil?.cargo !== 'entregador' && (
            <FormEntrega
              cliente={cliente}
              endereco={endereco}
              produto={produto}
              codigoPedido={codigoPedido}
              observacao={observacao}
              setCliente={setCliente}
              setEndereco={setEndereco}
              setProduto={setProduto}
              setCodigoPedido={setCodigoPedido}
              setObservacao={setObservacao}
              cadastrarEntrega={cadastrarEntrega}
            />
          )}

          <ListaEntregas
            entregas={entregas}
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            perfil={perfil}
            atualizarStatus={atualizarStatus}
            editarEntrega={(entrega) => {
              setEntregaSelecionada(entrega)
              setNovoCliente(entrega.cliente)
              setNovoEndereco(entrega.endereco)
              setNovoProduto(entrega.produto)
              setNovoCodigoPedido(entrega.codigo_pedido)
              setNovaObservacao(entrega.observacao)
              setModalEditar(true)
            }}
            excluirEntrega={(entrega) => {
              setEntregaSelecionada(entrega)
              setModalExcluir(true)
            }}
          />

        </div>
      </div>

      <ModalExcluirEntrega
        modalExcluir={modalExcluir}
        setModalExcluir={setModalExcluir}
        setEntregaSelecionada={setEntregaSelecionada}
        excluirEntrega={excluirEntrega}
      />

      <ModalEditarEntrega
        modalEditar={modalEditar}
        novoCliente={novoCliente}
        novoEndereco={novoEndereco}
        novoProduto={novoProduto}
        novoCodigoPedido={novoCodigoPedido}
        novaObservacao={novaObservacao}
        setNovoCliente={setNovoCliente}
        setNovoEndereco={setNovoEndereco}
        setNovoProduto={setNovoProduto}
        setNovoCodigoPedido={setNovoCodigoPedido}
        setNovaObservacao={setNovaObservacao}
        setModalEditar={setModalEditar}
        setEntregaSelecionada={setEntregaSelecionada}
        editarEntrega={editarEntrega}
      />
    </main>
  )
}