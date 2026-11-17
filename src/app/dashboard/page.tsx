
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
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
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [codigoPedido, setCodigoPedido] = useState('')
  const [observacao, setObservacao] = useState('')
  const [arquivoVenda, setArquivoVenda] = useState<File | null>(null)

  const [entregas, setEntregas] = useState<any[]>([])
  const [pesquisa, setPesquisa] = useState('')

  const [modalNovaEntrega, setModalNovaEntrega] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(false)

  const [entregaSelecionada, setEntregaSelecionada] = useState<any>(null)

  const [novoCliente, setNovoCliente] = useState('')
  const [novoEndereco, setNovoEndereco] = useState('')
  const [novoProduto, setNovoProduto] = useState('')
  const [novoCodigoPedido, setNovoCodigoPedido] = useState('')
  const [novaObservacao, setNovaObservacao] = useState('')

  useEffect(() => {
    let ativo = true
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    async function carregarDados(userId: string) {
      const { data } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single()

      if (!ativo) return

      setPerfil(data)
      await buscarEntregas()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!ativo) return

      if (!session?.user) {
        setUsuario(null)
        setPerfil(null)
        setEntregas([])
        router.push('/login')
        return
      }

      setUsuario(session.user)

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (timeoutId) clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
          if (!ativo) return
          void carregarDados(session.user.id)
        }, 0)
      }
    })

    return () => {
      ativo = false

      if (timeoutId) clearTimeout(timeoutId)

      subscription.unsubscribe()
    }
  }, [router])

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
  if (!cliente.trim() || !endereco.trim()) {
    toast.error('Informe o nome do cliente e o endereço')
    return
  }

  if (arquivoVenda) {
    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]

    if (!tiposPermitidos.includes(arquivoVenda.type)) {
      toast.error('Formato inválido. Envie PDF, JPG ou PNG.')
      return
    }

    if (arquivoVenda.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10 MB.')
      return
    }
  }

  const caminhoArquivo = arquivoVenda
    ? `${crypto.randomUUID()}-${arquivoVenda.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    : null

  const { data, error } = await supabase
    .from('entregas')
    .insert({
      cliente,
      telefone,
      endereco,
      codigo_pedido: codigoPedido,
      observacao,
      status: 'Pendente',
      arquivo_venda_path: caminhoArquivo,
      arquivo_venda_nome: arquivoVenda?.name ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Erro ao cadastrar entrega:', error)
    toast.error('Erro ao cadastrar entrega')
    return
  }

  if (arquivoVenda && caminhoArquivo) {
    const { error: erroUpload } = await supabase.storage
      .from('arquivos-vendas')
      .upload(caminhoArquivo, arquivoVenda, {
        contentType: arquivoVenda.type,
        upsert: false,
      })

    if (erroUpload) {
      console.error('Erro ao enviar arquivo:', erroUpload)

      await supabase
        .from('entregas')
        .update({
          arquivo_venda_path: null,
          arquivo_venda_nome: null,
        })
        .eq('id', data.id)

      toast.error('Entrega cadastrada, mas houve erro ao enviar o arquivo.')
    } else {
      toast.success('Entrega e arquivo cadastrados!')
    }
  } else {
    toast.success('Entrega cadastrada!')
  }

  setCliente('')
  setTelefone('')
  setEndereco('')
  setCodigoPedido('')
  setObservacao('')
  setArquivoVenda(null)

  setModalNovaEntrega(false)

  await buscarEntregas()
}

  // Atualiza o status e registra a justificativa, quando informada
  async function atualizarStatus(
    id: number,
    status: string,
    justificativa: string = ''
  ) {
    const motivo = justificativa.trim()

    if (
      ['Não entregue', 'Cancelado'].includes(status) &&
      !motivo
    ) {
      toast.error('Informe a justificativa para esta situação')
      return
    }

    const { error } = await supabase
      .from('entregas')
      .update({
        status,
        justificativa_status: motivo || null,
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error(error.message || 'Erro ao atualizar status')
      return
    }

    toast.success('Status atualizado com sucesso!')

    await buscarEntregas()
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
    <main className="min-h-screen bg-zinc-900 text-white">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold md:text-5xl">
              4RP Entregas 🚚
            </h1>

            <p className="mt-2 text-zinc-400">
              Cargo: {perfil?.cargo}
            </p>
          </div>

          {perfil?.cargo !== 'entregador' && (
            <button
              onClick={() => setModalNovaEntrega(true)}
              className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
            >
              + Nova entrega
            </button>
          )}
        </div>

        <CardsDashboard entregas={entregas} />

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

      {modalNovaEntrega && perfil?.cargo !== 'entregador' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalNovaEntrega(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalNovaEntrega(false)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-bold text-white hover:bg-zinc-600"
            >
              ✕ Fechar
            </button>

            <FormEntrega
              cliente={cliente}
              telefone={telefone}
              endereco={endereco}
              codigoPedido={codigoPedido}
              observacao={observacao}
              arquivoVenda={arquivoVenda}
              setCliente={setCliente}
              setTelefone={setTelefone}
              setEndereco={setEndereco}
              setCodigoPedido={setCodigoPedido}
              setObservacao={setObservacao}
              setArquivoVenda={setArquivoVenda}
              cadastrarEntrega={cadastrarEntrega}
            />
          </div>
        </div>
      )}

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
