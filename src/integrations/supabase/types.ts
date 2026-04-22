export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      matchups: {
        Row: {
          created_at: string
          id: string
          opens_at: string
          parent_position: number | null
          phase: Database["public"]["Enums"]["bracket_phase"]
          position: number
          specialty_a: string | null
          specialty_b: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          opens_at: string
          parent_position?: number | null
          phase: Database["public"]["Enums"]["bracket_phase"]
          position: number
          specialty_a?: string | null
          specialty_b?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          opens_at?: string
          parent_position?: number | null
          phase?: Database["public"]["Enums"]["bracket_phase"]
          position?: number
          specialty_a?: string | null
          specialty_b?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          choice: string
          created_at: string
          id: string
          matchup_id: string
          user_id: string
        }
        Insert: {
          choice: string
          created_at?: string
          id?: string
          matchup_id: string
          user_id: string
        }
        Update: {
          choice?: string
          created_at?: string
          id?: string
          matchup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_matchup_id_fkey"
            columns: ["matchup_id"]
            isOneToOne: false
            referencedRelation: "matchups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bracket_phase: "round_of_16" | "quarter_finals" | "semi_finals" | "final"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
