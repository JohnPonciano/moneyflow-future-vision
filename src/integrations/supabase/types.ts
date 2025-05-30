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
      credit_card_purchases: {
        Row: {
          amount: number
          card_id: string
          category: string
          created_at: string
          description: string
          id: string
          installments: number
          purchase_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          card_id: string
          category: string
          created_at?: string
          description: string
          id?: string
          installments?: number
          purchase_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          card_id?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          installments?: number
          purchase_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_purchases_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_card_subscriptions: {
        Row: {
          amount: number
          card_id: string
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          start_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          card_id: string
          category: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          start_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          card_id?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_subscriptions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          closing_day: number
          color: string
          created_at: string
          due_day: number
          id: string
          limit_amount: number
          name: string
          updated_at: string
        }
        Insert: {
          closing_day: number
          color: string
          created_at?: string
          due_day: number
          id?: string
          limit_amount: number
          name: string
          updated_at?: string
        }
        Update: {
          closing_day?: number
          color?: string
          created_at?: string
          due_day?: number
          id?: string
          limit_amount?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          created_at: string
          id: string
          installments_left: number
          interest_rate: number
          monthly_payment: number
          name: string
          remaining_amount: number
          total_amount: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          installments_left: number
          interest_rate: number
          monthly_payment: number
          name: string
          remaining_amount: number
          total_amount: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          installments_left?: number
          interest_rate?: number
          monthly_payment?: number
          name?: string
          remaining_amount?: number
          total_amount?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          deadline: string
          id: string
          priority: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_amount?: number
          deadline: string
          id?: string
          priority: string
          target_amount: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string
          id?: string
          priority?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      planned_purchases: {
        Row: {
          can_install: boolean
          category: string
          created_at: string
          estimated_price: number
          id: string
          item: string
          max_installments: number | null
          notes: string | null
          updated_at: string
          urgency: string
        }
        Insert: {
          can_install?: boolean
          category: string
          created_at?: string
          estimated_price: number
          id?: string
          item: string
          max_installments?: number | null
          notes?: string | null
          updated_at?: string
          urgency: string
        }
        Update: {
          can_install?: boolean
          category?: string
          created_at?: string
          estimated_price?: number
          id?: string
          item?: string
          max_installments?: number | null
          notes?: string | null
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_recurring: boolean
          recurring_pattern: string | null
          tags: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_recurring?: boolean
          recurring_pattern?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean
          recurring_pattern?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
