export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          base_rate: number
          client_email: string | null
          client_id: string
          client_name: string
          client_phone: string
          created_at: string
          delivery_address: string
          duration_hours: number
          end_time: string
          equipment_id: string
          id: string
          notes: string | null
          operator_fee: number | null
          operator_id: string
          pickup_address: string
          special_requirements: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          transport_fee: number | null
          updated_at: string
        }
        Insert: {
          base_rate: number
          client_email?: string | null
          client_id: string
          client_name: string
          client_phone: string
          created_at?: string
          delivery_address: string
          duration_hours: number
          end_time: string
          equipment_id: string
          id?: string
          notes?: string | null
          operator_fee?: number | null
          operator_id: string
          pickup_address: string
          special_requirements?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          transport_fee?: number | null
          updated_at?: string
        }
        Update: {
          base_rate?: number
          client_email?: string | null
          client_id?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          delivery_address?: string
          duration_hours?: number
          end_time?: string
          equipment_id?: string
          id?: string
          notes?: string | null
          operator_fee?: number | null
          operator_id?: string
          pickup_address?: string
          special_requirements?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          transport_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_quotes: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          created_at: string
          duration: string
          email: string
          equipment_type: string
          id: string
          location: string
          name: string
          phone: string
          project_description: string
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          duration: string
          email: string
          equipment_type: string
          id?: string
          location: string
          name: string
          phone: string
          project_description: string
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          duration?: string
          email?: string
          equipment_type?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          project_description?: string
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_quotes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          available_from: string | null
          available_until: string | null
          category: string
          city: string
          created_at: string
          daily_rate: number
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          min_rental_period: number | null
          monthly_rate: number | null
          name: string
          owner_id: string
          specifications: Json | null
          status: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at: string
          weekly_rate: number | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          category: string
          city: string
          created_at?: string
          daily_rate: number
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          min_rental_period?: number | null
          monthly_rate?: number | null
          name: string
          owner_id: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at?: string
          weekly_rate?: number | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          category?: string
          city?: string
          created_at?: string
          daily_rate?: number
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          min_rental_period?: number | null
          monthly_rate?: number | null
          name?: string
          owner_id?: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type?: string
          updated_at?: string
          weekly_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          rating: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_booking_overlap: {
        Args: {
          p_end_time: string
          p_equipment_id: string
          p_exclude_booking_id?: string
          p_start_time: string
        }
        Returns: boolean
      }
      get_user_profile_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_client: { Args: { _user_id: string }; Returns: boolean }
      is_operator: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "client" | "operator"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      equipment_status: "available" | "rented" | "maintenance" | "unavailable"
      notification_type:
        | "booking_request"
        | "booking_confirmed"
        | "payment_success"
        | "booking_cancelled"
        | "booking_completed"
        | "booking_active"
        | "status_updated"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      quote_status: "new" | "assigned" | "contacted" | "converted" | "closed"
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
    Enums: {
      app_role: ["admin", "client", "operator"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      equipment_status: ["available", "rented", "maintenance", "unavailable"],
      notification_type: [
        "booking_request",
        "booking_confirmed",
        "payment_success",
        "booking_cancelled",
        "booking_completed",
        "booking_active",
        "status_updated",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      quote_status: ["new", "assigned", "contacted", "converted", "closed"],
    },
  },
} as const
