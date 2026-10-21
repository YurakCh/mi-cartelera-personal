export type TipoContenido = 'pelicula' | 'serie'
export type EstadoContenido = 'por_ver' | 'viendo' | 'vista'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      mi_lista: {
        Row: {
          id: number
          user_id: string
          tmdb_id: number
          titulo: string
          poster_url: string | null
          tipo_contenido: TipoContenido
          estado: EstadoContenido
          calificacion_personal: number | null
          comentario: string | null
          fecha_agregado: string
        }
        Insert: {
          id?: never
          user_id?: string
          tmdb_id: number
          titulo: string
          poster_url?: string | null
          tipo_contenido: TipoContenido
          estado?: EstadoContenido
          calificacion_personal?: number | null
          comentario?: string | null
          fecha_agregado?: string
        }
        Update: {
          id?: never
          user_id?: string
          tmdb_id?: number
          titulo?: string
          poster_url?: string | null
          tipo_contenido?: TipoContenido
          estado?: EstadoContenido
          calificacion_personal?: number | null
          comentario?: string | null
          fecha_agregado?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_contenido: TipoContenido
      estado_contenido: EstadoContenido
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
