
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import StatusEntrega from './StatusEntrega'

type Props = {
  entregas: any[]
  pesquisa: string
  setPesquisa: (value: string) => void
  perfil: any
  atualizarStatus: (id: number, status: string) => Promise<void>
  editarEntrega: (entrega: any) => void
  excluirEntrega: (entrega: any) => void
}

export default function ListaEntregas({
  entregas,
  pesquisa,
  setPesquisa,
  perfil,
  atualizarStatus,
  editarEntrega,
  excluirEntrega,
}: Props) {
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [entregaSelecionada, setEntregaSelecionada] = useState<any>(null)

  const [historico, setHistorico] = useState<any[]>([])
  const [usuariosHistorico, setUsuariosHistorico] = useState<any[]>([])
  const [carregandoHistorico, setCarregandoHistorico] = useState(false)
  const [erroHistorico, setErroHistorico] = useState(false)

  // Mantém os dados da entrega selecionada atualizados
  useEffect(() => {
    if (!entregaSelecionada) return

    const atualizada = entregas.find(
      (item) => item.id === entregaSelecionada.id
    )

    if (atualizada) {
      setEntregaSelecionada(atualizada)
    } else {
      setEntregaSelecionada(null)
    }
  }, [entregas, entregaSelecionada?.id])

  // Busca o histórico da entrega selecionada
  useEffect(() => {
    if (!entregaSelecionada) {
      setHistorico([])
      setUsuariosHistorico([])
      return
    }

    let ativo = true

    async function carregarHistorico() {
      setCarregandoHistorico(true)
      setErroHistorico(false)
      setHistorico([])
      setUsuariosHistorico([])

      const { data, error } = await supabase
        .from('historico_entregas')
        .select('*')
        .eq('entrega_id', entregaSelecionada.id)
        .order('alterado_em', { ascending: false })

      if (error) {
        console.error('Erro ao buscar histórico:', error)

        if (ativo) {
          setErroHistorico(true)
          setCarregandoHistorico(false)
        }

        return
      }

      const registros = data || []

      const idsUsuarios = [
        ...new Set(
          registros
            .map((item) => item.alterado_por)
            .filter(Boolean)
        ),
      ]

      let perfis: any[] = []

      if (idsUsuarios.length > 0) {
        const { data: dadosPerfis, error: erroPerfis } = await supabase
          .from('perfis')
          .select('id, nome, cargo')
          .in('id', idsUsuarios)

        if (erroPerfis) {
          console.error('Erro ao buscar usuários:', erroPerfis)
        } else {
          perfis = dadosPerfis || []
        }
      }

      if (ativo) {
        setHistorico(registros)
        setUsuariosHistorico(perfis)
        setCarregandoHistorico(false)
      }
    }

    carregarHistorico()

    return () => {
      ativo = false
    }
  }, [entregaSelecionada?.id])

  const entregasFiltradas = entregas.filter((entrega) => {
    const termo = pesquisa.toLowerCase().trim()

    const correspondePesquisa =
      entrega.cliente?.toLowerCase().includes(termo) ||
      String(entrega.codigo_pedido || '').toLowerCase().includes(termo)

    const correspondeStatus =
      filtroStatus === 'Todos' || entrega.status === filtroStatus

    return correspondePesquisa && correspondeStatus
  })

  // Tela de detalhes da entrega
  if (entregaSelecionada) {
    const entrega = entregaSelecionada

    return (
      <section className="min-w-0 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-xl sm:p-6">
        <button
          onClick={() => setEntregaSelecionada(null)}
          className="mb-6 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          ← Voltar para entregas
        </button>

        <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">Detalhes da entrega</h2>

            <p className="mt-1 break-words text-sm text-zinc-400 [overflow-wrap:anywhere]">
              Venda: {entrega.codigo_pedido || 'Sem código'}
            </p>
          </div>

          <StatusEntrega status={entrega.status} />
        </div>

        {/* Informações da entrega */}
        <div className="grid min-w-0 grid-cols-1 gap-5 rounded-xl border border-zinc-700 bg-zinc-900 p-4 sm:grid-cols-2 sm:p-5">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">Cliente</p>
            <p className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">
              {entrega.cliente || '—'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-zinc-400">Código da venda</p>
            <p className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">
              {entrega.codigo_pedido || '—'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-zinc-400">Endereço de entrega</p>
            <p className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">
              {entrega.endereco || '—'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-zinc-400">Produto</p>
            <p className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">
              {entrega.produto || '—'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-zinc-400">
              Data e hora do cadastro
            </p>
            <p className="mt-1 font-semibold">
              {entrega.created_at
                ? new Date(entrega.created_at).toLocaleString('pt-BR')
                : '—'}
            </p>
          </div>

          <div className="min-w-0 sm:col-span-2">
            <p className="text-xs text-zinc-400">Observação</p>
            <p className="mt-1 break-words font-semibold [overflow-wrap:anywhere]">
              {entrega.observacao || 'Nenhuma observação'}
            </p>
          </div>
        </div>

        {/* Histórico em linha do tempo */}
        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-900 p-4 sm:p-5">
          <h3 className="mb-5 text-lg font-bold">
            Histórico de movimentações
          </h3>

          {carregandoHistorico ? (
            <p className="text-sm text-zinc-400">
              Carregando histórico...
            </p>
          ) : erroHistorico ? (
            <p className="text-sm text-red-400">
              Não foi possível carregar o histórico. Tente novamente.
            </p>
          ) : historico.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            <div className="relative ml-2 flex flex-col">
              {historico.map((item, index) => {
                const usuario = usuariosHistorico.find(
                  (p) => p.id === item.alterado_por
                )

                const corStatus =
                  item.status_novo === 'Entregue'
                    ? 'bg-green-500'
                    : item.status_novo === 'Em rota'
                      ? 'bg-blue-500'
                      : item.status_novo === 'Não entregue'
                        ? 'bg-red-500'
                        : item.status_novo === 'Cancelado'
                          ? 'bg-zinc-500'
                          : 'bg-yellow-500'

                return (
                  <div
                    key={item.id}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`z-10 mt-1 h-3 w-3 shrink-0 rounded-full ${corStatus} ring-4 ring-zinc-900`}
                      />

                      {index !== historico.length - 1 && (
                        <span className="absolute top-4 h-full w-px bg-zinc-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold text-white">
                        {item.status_anterior || 'Cadastro'} → {item.status_novo}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {new Date(item.alterado_em).toLocaleString('pt-BR')}
                      </p>

                      <p className="mt-2 text-sm text-zinc-300">
                        Responsável:{' '}
                        {usuario?.nome || 'Usuário não identificado'}
                      </p>

                      {usuario?.cargo && (
                        <span className="mt-1 inline-block rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                          {usuario.cargo}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Botões de atualização de situação */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-zinc-300">
            Atualizar situação
          </p>

          <div className="flex flex-wrap gap-2">
            {['Em rota', 'Entregue', 'Não entregue'].map((status) => (
              <button
                key={status}
                onClick={() => atualizarStatus(entrega.id, status)}
                disabled={entrega.status === status}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Ações conforme o perfil */}
        {perfil?.cargo !== 'entregador' && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-700 pt-5">
            <button
              onClick={() => editarEntrega(entrega)}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold transition hover:bg-yellow-700"
            >
              Editar entrega
            </button>

            {perfil?.cargo === 'master' && (
              <button
                onClick={() => excluirEntrega(entrega)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
              >
                Excluir entrega
              </button>
            )}
          </div>
        )}
      </section>
    )
  }

  // Lista de entregas
  return (
    <section className="min-w-0 w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-xl sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Entregas cadastradas</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Consulte e acompanhe os pedidos.
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 px-4 py-3">
          <p className="text-xs text-zinc-400">Total de entregas</p>
          <p className="text-2xl font-bold">{entregas.length}</p>
        </div>
      </div>

      {/* Pesquisa e filtro */}
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative min-w-0">
          <input
            type="text"
            placeholder="Pesquisar por nome do cliente ou código da venda..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {pesquisa && (
            <button
              type="button"
              onClick={() => setPesquisa('')}
              aria-label="Limpar pesquisa"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="Todos">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em rota">Em rota</option>
          <option value="Entregue">Entregue</option>
          <option value="Não entregue">Não entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {entregasFiltradas.length} resultado(s)
        </p>
      </div>

      {/* Cartões das entregas */}
      <div className="flex max-h-[650px] flex-col gap-3 overflow-y-auto pr-1">
        {entregasFiltradas.map((entrega) => (
          <button
            key={entrega.id}
            onClick={() => setEntregaSelecionada(entrega)}
            className="w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-left transition hover:border-blue-500 hover:bg-zinc-900/70"
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Cliente
                </p>

                <p className="mt-1 break-words font-bold text-white [overflow-wrap:anywhere]">
                  {entrega.cliente || 'Cliente não informado'}
                </p>

                <p className="mt-1 break-words text-sm text-zinc-400 [overflow-wrap:anywhere]">
                  {entrega.produto || 'Produto não informado'}
                </p>

                {entrega.created_at && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Cadastro:{' '}
                    {new Date(entrega.created_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              <StatusEntrega status={entrega.status} />
            </div>

            <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3">
              <p className="min-w-0 break-words text-sm text-zinc-400 [overflow-wrap:anywhere]">
                Venda:{' '}
                <span className="font-semibold text-zinc-200">
                  {entrega.codigo_pedido || 'Sem código'}
                </span>
              </p>

              <span className="shrink-0 text-sm font-semibold text-blue-400">
                Ver detalhes →
              </span>
            </div>
          </button>
        ))}

        {entregasFiltradas.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
            <p className="font-semibold text-zinc-300">
              Nenhuma entrega encontrada
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Tente alterar a pesquisa ou o filtro de status.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
