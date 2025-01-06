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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          rate: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          rate: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          rate?: number
        }
        Relationships: []
      }
      jobs: {
        Row: {
          approved_by: string | null
          company_name: string
          contact_info: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          location: string
          phone_number: string
          status: string | null
          title: string
        }
        Insert: {
          approved_by?: string | null
          company_name: string
          contact_info: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          location: string
          phone_number: string
          status?: string | null
          title: string
        }
        Update: {
          approved_by?: string | null
          company_name?: string
          contact_info?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          location?: string
          phone_number?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      rentals: {
        Row: {
          address: string
          approved_by: string | null
          contact_info: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          phone_number: string
          price: number
          status: string | null
          title: string
        }
        Insert: {
          address: string
          approved_by?: string | null
          contact_info: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          phone_number: string
          price: number
          status?: string | null
          title: string
        }
        Update: {
          address?: string
          approved_by?: string | null
          contact_info?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          phone_number?: string
          price?: number
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      shipping_details: {
        Row: {
          cost: number
          created_at: string
          created_by: string | null
          customer_name: string
          id: string
          notes: string | null
          phone: string
          shipping_date: string
          status: Database["public"]["Enums"]["shipping_status"] | null
          updated_at: string
          weight: number
          weight_unit: string
        }
        Insert: {
          cost: number
          created_at?: string
          created_by?: string | null
          customer_name: string
          id?: string
          notes?: string | null
          phone: string
          shipping_date: string
          status?: Database["public"]["Enums"]["shipping_status"] | null
          updated_at?: string
          weight: number
          weight_unit: string
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string | null
          customer_name?: string
          id?: string
          notes?: string | null
          phone?: string
          shipping_date?: string
          status?: Database["public"]["Enums"]["shipping_status"] | null
          updated_at?: string
          weight?: number
          weight_unit?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_job: {
        Args: {
          job_id: string
          admin_id: string
          action: string
        }
        Returns: undefined
      }
      approve_rental: {
        Args: {
          rental_id: string
          admin_id: string
          action: string
        }
        Returns: undefined
      }
    }
    Enums: {
      shipping_status: "pending" | "in_progress" | "completed" | "cancelled"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
