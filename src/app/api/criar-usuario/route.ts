
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // 1. Verifica a sessão enviada pelo navegador
    const authorization = req.headers.get('Authorization')

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Acesso não autorizado.' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada.' },
        { status: 401 }
      )
    }

    // 2. Verifica o perfil do usuário que está fazendo o cadastro
    const { data: perfilMaster, error: perfilError } =
      await supabaseAdmin
        .from('perfis')
        .select('id, cargo, ativo, empresa_id')
        .eq('id', user.id)
        .single()

    if (
      perfilError ||
      !perfilMaster ||
      perfilMaster.cargo !== 'master' ||
      !perfilMaster.ativo ||
      !perfilMaster.empresa_id
    ) {
      return NextResponse.json(
        { error: 'Você não tem permissão para cadastrar usuários.' },
        { status: 403 }
      )
    }

    // 3. Verifica se a empresa do master está ativa
    const { data: empresa, error: empresaError } =
      await supabaseAdmin
        .from('empresas')
        .select('id, ativo')
        .eq('id', perfilMaster.empresa_id)
        .single()

    if (empresaError || !empresa || !empresa.ativo) {
      return NextResponse.json(
        { error: 'A empresa não está ativa.' },
        { status: 403 }
      )
    }

    // 4. Recebe e valida os dados do novo usuário
    const body = await req.json()

    const nome = String(body.nome || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const senha = String(body.senha || '')
    const cargo = body.cargo

    if (!nome || !email || !senha || !cargo) {
      return NextResponse.json(
        { error: 'Preencha todos os campos.' },
        { status: 400 }
      )
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    // Master só pode criar vendedor ou entregador
    if (!['vendedor', 'entregador'].includes(cargo)) {
      return NextResponse.json(
        { error: 'Cargo não permitido para este cadastro.' },
        { status: 403 }
      )
    }

    // 5. Cria o usuário no Authentication
    const {
      data: authData,
      error: createError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (createError) {
      console.error('Erro ao criar usuário:', createError)

      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      )
    }

    const novoUsuario = authData.user

    if (!novoUsuario) {
      return NextResponse.json(
        { error: 'Usuário não retornado pelo Authentication.' },
        { status: 400 }
      )
    }

    // 6. Cria o perfil vinculado à mesma empresa do master
    const { data: perfilData, error: perfilNovoError } =
      await supabaseAdmin
        .from('perfis')
        .insert({
          id: novoUsuario.id,
          nome,
          email,
          cargo,
          ativo: true,
          empresa_id: perfilMaster.empresa_id,
        })
        .select()
        .single()

    if (perfilNovoError) {
      console.error('Erro ao inserir perfil:', perfilNovoError)

      // Remove o usuário do Authentication se o perfil falhar
      const { error: deleteError } =
        await supabaseAdmin.auth.admin.deleteUser(novoUsuario.id)

      if (deleteError) {
        console.error(
          'Erro ao remover usuário órfão:',
          deleteError
        )
      }

      return NextResponse.json(
        { error: 'Não foi possível criar o perfil do usuário.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      perfil: perfilData,
    })
  } catch (error) {
    console.error('Erro interno:', error)

    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
