
'use client'

import { useEffect, useState } from 'react'

type Tema = 'dark' | 'light'
type TamanhoFonte = 'normal' | 'grande' | 'muito-grande'

export default function Acessibilidade() {
  const [tema, setTema] = useState<Tema>('dark')
  const [negrito, setNegrito] = useState(false)
  const [tamanhoFonte, setTamanhoFonte] = useState<TamanhoFonte>('normal')
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const temaSalvo = localStorage.getItem('4rp-tema')
    const negritoSalvo = localStorage.getItem('4rp-negrito')
    const tamanhoSalvo = localStorage.getItem('4rp-tamanho-fonte')

    const temaInicial: Tema = temaSalvo === 'light' ? 'light' : 'dark'
    const negritoInicial = negritoSalvo === 'true'

    const tamanhoInicial: TamanhoFonte =
      tamanhoSalvo === 'grande' || tamanhoSalvo === 'muito-grande'
        ? tamanhoSalvo
        : 'normal'

    setTema(temaInicial)
    setNegrito(negritoInicial)
    setTamanhoFonte(tamanhoInicial)

    document.documentElement.dataset.theme = temaInicial
    document.documentElement.dataset.bold = String(negritoInicial)
    document.documentElement.dataset.fontSize = tamanhoInicial
  }, [])

  function alterarTema(novoTema: Tema) {
    setTema(novoTema)
    document.documentElement.dataset.theme = novoTema
    localStorage.setItem('4rp-tema', novoTema)
  }

  function alterarNegrito(ativado: boolean) {
    setNegrito(ativado)
    document.documentElement.dataset.bold = String(ativado)
    localStorage.setItem('4rp-negrito', String(ativado))
  }

  function alterarTamanhoFonte(tamanho: TamanhoFonte) {
    setTamanhoFonte(tamanho)
    document.documentElement.dataset.fontSize = tamanho
    localStorage.setItem('4rp-tamanho-fonte', tamanho)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      {aberto && (
        <div className="mb-3 w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white shadow-2xl">
          <h3 className="mb-4 text-base font-bold">
            Acessibilidade
          </h3>

          <p className="mb-2 text-sm text-zinc-400">
            Tema da interface
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => alterarTema('dark')}
              aria-pressed={tema === 'dark'}
              className={`rounded-lg border p-3 text-sm ${
                tema === 'dark'
                  ? 'border-blue-500 bg-blue-600'
                  : 'border-zinc-700 bg-zinc-800'
              }`}
            >
              🌙 Escuro
            </button>

            <button
              type="button"
              onClick={() => alterarTema('light')}
              aria-pressed={tema === 'light'}
              className={`rounded-lg border p-3 text-sm ${
                tema === 'light'
                  ? 'border-blue-500 bg-blue-600'
                  : 'border-zinc-700 bg-zinc-800'
              }`}
            >
              ☀️ Claro
            </button>
          </div>

          <div className="mt-4 border-t border-zinc-700 pt-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold">
                Texto em negrito
              </span>

              <input
                type="checkbox"
                checked={negrito}
                onChange={(e) => alterarNegrito(e.target.checked)}
                className="h-5 w-5 accent-blue-500"
              />
            </label>
          </div>

          <div className="mt-4 border-t border-zinc-700 pt-4">
            <p className="mb-3 text-sm font-semibold">
              Tamanho do texto
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => alterarTamanhoFonte('normal')}
                aria-pressed={tamanhoFonte === 'normal'}
                className={`rounded-lg border p-2 text-xs ${
                  tamanhoFonte === 'normal'
                    ? 'border-blue-500 bg-blue-600'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                Normal
              </button>

              <button
                type="button"
                onClick={() => alterarTamanhoFonte('grande')}
                aria-pressed={tamanhoFonte === 'grande'}
                className={`rounded-lg border p-2 text-sm ${
                  tamanhoFonte === 'grande'
                    ? 'border-blue-500 bg-blue-600'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                Grande
              </button>

              <button
                type="button"
                onClick={() => alterarTamanhoFonte('muito-grande')}
                aria-pressed={tamanhoFonte === 'muito-grande'}
                className={`rounded-lg border p-2 text-base ${
                  tamanhoFonte === 'muito-grande'
                    ? 'border-blue-500 bg-blue-600'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                Maior
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={aberto}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-xl transition hover:bg-blue-700"
      >
        ♿
      </button>
    </div>
  )
}
