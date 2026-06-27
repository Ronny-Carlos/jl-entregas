import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useEntregas() {
  async function buscarEntregas() {
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      toast.error('Erro ao buscar entregas')
      return []
    }

    return data || []
  }

  return {
    buscarEntregas,
  }
}