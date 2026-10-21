import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './useAuth'
import type { WatchlistItem, WatchStatus, MediaType } from '@/types/domain'

export function useWatchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchErr } = await supabase
        .from('mi_lista')
        .select('*')
        .order('fecha_agregado', { ascending: false })

      if (fetchErr) {
        throw fetchErr
      }

      setItems(data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar tu lista.'
      setError(msg)
      console.error('Error fetching watchlist:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const isItemInWatchlist = useCallback(
    (tmdbId: number, type: MediaType): WatchlistItem | undefined => {
      return items.find(
        (item) => item.tmdb_id === tmdbId && item.tipo_contenido === type
      )
    },
    [items]
  )

  const addItem = async ({
    tmdbId,
    title,
    posterUrl,
    type,
    status = 'por_ver',
  }: {
    tmdbId: number
    title: string
    posterUrl: string | null
    type: MediaType
    status?: WatchStatus
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      const { data, error: insertErr } = await supabase
        .from('mi_lista')
        .insert({
          user_id: user.id,
          tmdb_id: tmdbId,
          titulo: title,
          poster_url: posterUrl,
          tipo_contenido: type,
          estado: status,
        })
        .select()
        .single()

      if (insertErr) {
        console.error('Supabase insert error:', insertErr)
        if (insertErr.code === '23505') {
          return { success: false, error: 'Este contenido ya está en tu lista.' }
        }
        return { success: false, error: insertErr.message || 'Error de permisos o base de datos.' }
      }

      if (data) {
        setItems((prev) => [data, ...prev])
      }
      return { success: true }
    } catch (err: unknown) {
      console.error('Unexpected addItem error:', err)
      const msg =
        err instanceof Error ? err.message : 'Error al agregar a tu lista.'
      return { success: false, error: msg }
    }
  }

  const updateStatus = async (
    id: number,
    newStatus: WatchStatus
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateErr } = await supabase
        .from('mi_lista')
        .update({ estado: newStatus })
        .eq('id', id)

      if (updateErr) throw updateErr

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, estado: newStatus } : item
        )
      )
      return { success: true }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar estado.'
      return { success: false, error: msg }
    }
  }

  const updateDetails = async (
    id: number,
    updates: {
      estado?: WatchStatus
      calificacion_personal?: number | null
      comentario?: string | null
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateErr } = await supabase
        .from('mi_lista')
        .update(updates)
        .eq('id', id)

      if (updateErr) throw updateErr

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      )
      return { success: true }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar detalles.'
      return { success: false, error: msg }
    }
  }

  const removeItem = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: deleteErr } = await supabase
        .from('mi_lista')
        .delete()
        .eq('id', id)

      if (deleteErr) throw deleteErr

      setItems((prev) => prev.filter((item) => item.id !== id))
      return { success: true }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al eliminar de tu lista.'
      return { success: false, error: msg }
    }
  }

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    addItem,
    updateStatus,
    updateDetails,
    removeItem,
    isItemInWatchlist,
  }
}
