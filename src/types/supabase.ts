export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "[Test] cash_flows_duplicate": {
        Row: {
          category_id: string | null
          created_at: string | null
          deleted_at: string | null
          flow_amount: number | null
          flow_items: string | null
          flow_Qty: number | null
          flow_transaction_date: string | null
          flow_type: string | null
          flow_Unit: string | null
          group_id: string | null
          id: string
          image_url: string | null
          trans_ref: number | null
          updated_at: string | null
          user_id: string | null
          voice_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          flow_amount?: number | null
          flow_items?: string | null
          flow_Qty?: number | null
          flow_transaction_date?: string | null
          flow_type?: string | null
          flow_Unit?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          trans_ref?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          flow_amount?: number | null
          flow_items?: string | null
          flow_Qty?: number | null
          flow_transaction_date?: string | null
          flow_type?: string | null
          flow_Unit?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          trans_ref?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_url?: string | null
        }
        Relationships: []
      }
      "[Test] chat": {
        Row: {
          channel_id: string
          chat_id: number | null
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          channel_id: string
          chat_id?: number | null
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          chat_id?: number | null
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_active_channel_name_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_active_group_name_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      activation_codes: {
        Row: {
          channel_id: string | null
          chat_id: string | null
          claimed_by: string | null
          code: string
          created_at: string | null
          deleted_at: string | null
          expired_at: string | null
          group_id: string | null
          id: string
          is_used: boolean | null
          package_id: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          chat_id?: string | null
          claimed_by?: string | null
          code: string
          created_at?: string | null
          deleted_at?: string | null
          expired_at?: string | null
          group_id?: string | null
          id?: string
          is_used?: boolean | null
          package_id?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          chat_id?: string | null
          claimed_by?: string | null
          code?: string
          created_at?: string | null
          deleted_at?: string | null
          expired_at?: string | null
          group_id?: string | null
          id?: string
          is_used?: boolean | null
          package_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activation_codes_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activation_codes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activation_codes_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      billing_plans: {
        Row: {
          billing_cycle: string
          created_at: string | null
          deleted_at: string | null
          duration_days: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          package_id: string | null
          price: number | null
          token_limit: number | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle: string
          created_at?: string | null
          deleted_at?: string | null
          duration_days?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          package_id?: string | null
          price?: number | null
          token_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string
          created_at?: string | null
          deleted_at?: string | null
          duration_days?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          package_id?: string | null
          price?: number | null
          token_limit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_plans_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow_edits: {
        Row: {
          cash_flow_id: string | null
          created_at: string | null
          deleted_at: string | null
          edit_reason: string | null
          id: string
          new_amount: number | null
          old_amount: number | null
          updated_at: string | null
        }
        Insert: {
          cash_flow_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edit_reason?: string | null
          id?: string
          new_amount?: number | null
          old_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          cash_flow_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edit_reason?: string | null
          id?: string
          new_amount?: number | null
          old_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_edits_cash_flow_id_fkey"
            columns: ["cash_flow_id"]
            isOneToOne: false
            referencedRelation: "cash_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_edits_cash_flow_id_fkey"
            columns: ["cash_flow_id"]
            isOneToOne: false
            referencedRelation: "cash_flows_completeview"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flows: {
        Row: {
          category_id: string | null
          created_at: string | null
          deleted_at: string | null
          flow_amount: number | null
          flow_items: string | null
          flow_merchant: string | null
          flow_qty: number | null
          flow_transaction_date: string | null
          flow_type: string | null
          flow_unit: string | null
          group_id: string | null
          id: string
          image_url: string | null
          trans_ref: number | null
          updated_at: string | null
          user_id: string | null
          voice_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          flow_amount?: number | null
          flow_items?: string | null
          flow_merchant?: string | null
          flow_qty?: number | null
          flow_transaction_date?: string | null
          flow_type?: string | null
          flow_unit?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          trans_ref?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          flow_amount?: number | null
          flow_items?: string | null
          flow_merchant?: string | null
          flow_qty?: number | null
          flow_transaction_date?: string | null
          flow_type?: string | null
          flow_unit?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          trans_ref?: number | null
          updated_at?: string | null
          user_id?: string | null
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flows_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "list_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flows_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          group_id: string | null
          id: string
          is_global: boolean | null
          name: string
          popularity_score: number | null
          promoted_to_global: boolean | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          is_global?: boolean | null
          name: string
          popularity_score?: number | null
          promoted_to_global?: boolean | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          is_global?: boolean | null
          name?: string
          popularity_score?: number | null
          promoted_to_global?: boolean | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          group_id: string | null
          id: string
          initial_stock: number
          min_stock_alert: number | null
          name: string
          quantity: number
          sku: string | null
          unit: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          initial_stock?: number
          min_stock_alert?: number | null
          name: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          initial_stock?: number
          min_stock_alert?: number | null
          name?: string
          quantity?: number
          sku?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventories_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      list_categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          group_id: string | null
          id: string
          name: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          name?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          group_id?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "list_categories_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          included_channels: string[] | null
          is_paid: boolean | null
          name: string | null
          price: number | null
          token_limit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          included_channels?: string[] | null
          is_paid?: boolean | null
          name?: string | null
          price?: number | null
          token_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          included_channels?: string[] | null
          is_paid?: boolean | null
          name?: string | null
          price?: number | null
          token_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          deleted_at: string | null
          external_ref: string | null
          id: string
          paid_at: string | null
          payment_method: string
          payment_status: string | null
          transaction_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          deleted_at?: string | null
          external_ref?: string | null
          id?: string
          paid_at?: string | null
          payment_method: string
          payment_status?: string | null
          transaction_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          deleted_at?: string | null
          external_ref?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string
          payment_status?: string | null
          transaction_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      transaction_details: {
        Row: {
          created_at: string | null
          expired_at: string | null
          gateway: string
          id: string
          invoice_url: string | null
          order_id: string | null
          payment_code: string | null
          response_payload: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expired_at?: string | null
          gateway: string
          id?: string
          invoice_url?: string | null
          order_id?: string | null
          payment_code?: string | null
          response_payload?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expired_at?: string | null
          gateway?: string
          id?: string
          invoice_url?: string | null
          order_id?: string | null
          payment_code?: string | null
          response_payload?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          billing_plan_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          billing_plan_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_plan_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_billing_plan_id_fkey"
            columns: ["billing_plan_id"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activated_at: string | null
          created_at: string | null
          current_package_id: string | null
          date_of_birth: string | null
          deleted_at: string | null
          full_name: string | null
          gender: string | null
          group_id: string | null
          id: string
          phone_number: string | null
          photo_url: string | null
          primary_channel_id: string | null
          terms_accepted: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          current_package_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          full_name?: string | null
          gender?: string | null
          group_id?: string | null
          id?: string
          phone_number?: string | null
          photo_url?: string | null
          primary_channel_id?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          current_package_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          full_name?: string | null
          gender?: string | null
          group_id?: string | null
          id?: string
          phone_number?: string | null
          photo_url?: string | null
          primary_channel_id?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_current_package_id_fkey"
            columns: ["current_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_primary_channel_id_fkey"
            columns: ["primary_channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          end_date: string
          id: string
          payment_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          end_date: string
          id?: string
          payment_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          end_date?: string
          id?: string
          payment_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cash_flows_completeview: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          date: string | null
          group_name: string | null
          id: string | null
          items: string | null
          merchant: string | null
          qty: number | null
          reference: number | null
          type: string | null
          unit: string | null
          user_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_category_id: {
        Args: { p_category_name: string }
        Returns: string
      }
      insert_cash_flow_by_category_name: {
        Args:
          | {
              p_category_name: string
              p_flow_qty: number
              p_flow_unit: string
              p_flow_amount: number
              p_flow_items: string
              p_flow_transaction_date: string
              p_flow_type: string
              p_group_id: string
              p_flow_merchant: string
              p_user_id: string
            }
          | {
              p_category_name: string
              p_flow_qty: number
              p_flow_unit: string
              p_flow_amount: number
              p_flow_items: string
              p_flow_transaction_date: string
              p_flow_type: string
              p_group_id: string
              p_merchant: string
              p_user_id: string
            }
          | {
              p_user_id: string
              p_category_name: string
              p_flow_qty: number
              p_flow_unit: string
              p_flow_amount: number
              p_flow_items: string
              p_flow_transaction_date: string
              p_flow_type: string
              p_merchant: string
              p_group_id?: string
            }
        Returns: Json
      }
      insert_cash_flow_v2: {
        Args: {
          p_category_name: string
          p_flow_qty: number
          p_flow_unit: string
          p_flow_amount: number
          p_flow_items: string
          p_flow_transaction_date: string
          p_flow_type: string
          p_group_id: string
          p_flow_merchant: string
          p_user_id: string
        }
        Returns: string
      }
      insert_cash_flow_with_category: {
        Args: {
          p_transaction_date: string
          p_amount: number
          p_category_name: string
        }
        Returns: undefined
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      test_function: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
