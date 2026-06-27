import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      nome,
      email,
      senha,
      cargo,
    } = body

    // Cria usuário no Authentication
    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)

      return NextResponse.json(
        {
          error: authError.message,
        },
        {
          status: 400,
        }
      )
    }

    const user = authData.user

    if (!user) {
      return NextResponse.json(
        {
          error: 'Usuário não retornado pelo Authentication',
        },
        {
          status: 400,
        }
      )
    }

    // Insere na tabela perfis
    const {
      data: perfilData,
      error: perfilError,
    } = await supabaseAdmin
      .from('perfis')
      .insert([
        {
          id: user.id,
          nome,
          email,
          cargo,
          ativo: true,
        },
      ])
      .select()

    if (perfilError) {
      console.error(
        'Erro ao inserir perfil:',
        perfilError
      )

      // Remove o usuário criado no Auth para não ficar órfão
      await supabaseAdmin.auth.admin.deleteUser(user.id)

      return NextResponse.json(
        {
          error: perfilError.message,
          details: perfilError,
        },
        {
          status: 400,
        }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      perfil: perfilData,
    })
  } catch (error) {
    console.error('Erro interno:', error)

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      {
        status: 500,
      }
    )
  }
}