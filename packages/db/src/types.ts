export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      community_comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          likes: number | null;
          post_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          likes?: number | null;
          post_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          likes?: number | null;
          post_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_posts: {
        Row: {
          category: string;
          comment_count: number | null;
          content: string;
          created_at: string | null;
          id: string;
          is_reported: boolean | null;
          likes: number | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category: string;
          comment_count?: number | null;
          content: string;
          created_at?: string | null;
          id?: string;
          is_reported?: boolean | null;
          likes?: number | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category?: string;
          comment_count?: number | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          is_reported?: boolean | null;
          likes?: number | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          status: string | null;
          subject: string;
          type: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          status?: string | null;
          subject: string;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          status?: string | null;
          subject?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      gym_checkins: {
        Row: {
          auto_checkout_duration: number | null;
          check_in_time: string;
          check_out_time: string | null;
          created_at: string | null;
          gym_id: string;
          id: string;
          is_auto_checkout: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          auto_checkout_duration?: number | null;
          check_in_time?: string;
          check_out_time?: string | null;
          created_at?: string | null;
          gym_id: string;
          id?: string;
          is_auto_checkout?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          auto_checkout_duration?: number | null;
          check_in_time?: string;
          check_out_time?: string | null;
          created_at?: string | null;
          gym_id?: string;
          id?: string;
          is_auto_checkout?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gym_checkins_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
        ];
      };
      gym_edit_suggestion_votes: {
        Row: {
          created_at: string | null;
          id: string;
          suggestion_id: string;
          user_id: string;
          vote_type: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          suggestion_id: string;
          user_id: string;
          vote_type: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          suggestion_id?: string;
          user_id?: string;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gym_edit_suggestion_votes_suggestion_id_fkey";
            columns: ["suggestion_id"];
            isOneToOne: false;
            referencedRelation: "gym_edit_suggestions";
            referencedColumns: ["id"];
          },
        ];
      };
      gym_edit_suggestions: {
        Row: {
          admin_note: string | null;
          created_at: string | null;
          current_value: string | null;
          downvotes: number | null;
          field_name: string;
          gym_id: string;
          id: string;
          reason: string | null;
          status: string | null;
          suggested_value: string;
          updated_at: string | null;
          upvotes: number | null;
          user_id: string;
        };
        Insert: {
          admin_note?: string | null;
          created_at?: string | null;
          current_value?: string | null;
          downvotes?: number | null;
          field_name: string;
          gym_id: string;
          id?: string;
          reason?: string | null;
          status?: string | null;
          suggested_value: string;
          updated_at?: string | null;
          upvotes?: number | null;
          user_id: string;
        };
        Update: {
          admin_note?: string | null;
          created_at?: string | null;
          current_value?: string | null;
          downvotes?: number | null;
          field_name?: string;
          gym_id?: string;
          id?: string;
          reason?: string | null;
          status?: string | null;
          suggested_value?: string;
          updated_at?: string | null;
          upvotes?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gym_edit_suggestions_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
        ];
      };
      gym_reviews: {
        Row: {
          content: string;
          created_at: string | null;
          gym_id: string;
          id: string;
          likes: number | null;
          rating: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          gym_id: string;
          id?: string;
          likes?: number | null;
          rating: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          gym_id?: string;
          id?: string;
          likes?: number | null;
          rating?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gym_reviews_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
        ];
      };
      gym_sectors: {
        Row: {
          created_at: string | null;
          gym_id: string;
          id: string;
          name: string;
          route_count: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          gym_id: string;
          id?: string;
          name: string;
          route_count?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          gym_id?: string;
          id?: string;
          name?: string;
          route_count?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gym_sectors_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
        ];
      };
      gyms: {
        Row: {
          address: string;
          city: Database["public"]["Enums"]["gym_city_enum"];
          created_at: string | null;
          district: string;
          floors: number | null;
          has_cafe: boolean | null;
          has_endurance: boolean | null;
          has_footbath: boolean | null;
          has_lead: boolean | null;
          has_locker: boolean | null;
          has_parking: boolean | null;
          has_shop: boolean | null;
          has_shower: boolean | null;
          id: string;
          monthly_price: number | null;
          name: string;
          operating_hours: string | null;
          phone: string | null;
          problem_types:
            | Database["public"]["Enums"]["problem_type_enum"][]
            | null;
          rating: number | null;
          review_count: number | null;
          single_price: number | null;
          size_sqm: number | null;
          status: Database["public"]["Enums"]["gym_status_enum"];
          ten_times_price: number | null;
          updated_at: string | null;
          weekday_end: string | null;
          weekday_start: string | null;
          weekend_end: string | null;
          weekend_start: string | null;
        };
        Insert: {
          address: string;
          city: Database["public"]["Enums"]["gym_city_enum"];
          created_at?: string | null;
          district: string;
          floors?: number | null;
          has_cafe?: boolean | null;
          has_endurance?: boolean | null;
          has_footbath?: boolean | null;
          has_lead?: boolean | null;
          has_locker?: boolean | null;
          has_parking?: boolean | null;
          has_shop?: boolean | null;
          has_shower?: boolean | null;
          id?: string;
          monthly_price?: number | null;
          name: string;
          operating_hours?: string | null;
          phone?: string | null;
          problem_types?:
            | Database["public"]["Enums"]["problem_type_enum"][]
            | null;
          rating?: number | null;
          review_count?: number | null;
          single_price?: number | null;
          size_sqm?: number | null;
          status?: Database["public"]["Enums"]["gym_status_enum"];
          ten_times_price?: number | null;
          updated_at?: string | null;
          weekday_end?: string | null;
          weekday_start?: string | null;
          weekend_end?: string | null;
          weekend_start?: string | null;
        };
        Update: {
          address?: string;
          city?: Database["public"]["Enums"]["gym_city_enum"];
          created_at?: string | null;
          district?: string;
          floors?: number | null;
          has_cafe?: boolean | null;
          has_endurance?: boolean | null;
          has_footbath?: boolean | null;
          has_lead?: boolean | null;
          has_locker?: boolean | null;
          has_parking?: boolean | null;
          has_shop?: boolean | null;
          has_shower?: boolean | null;
          id?: string;
          monthly_price?: number | null;
          name?: string;
          operating_hours?: string | null;
          phone?: string | null;
          problem_types?:
            | Database["public"]["Enums"]["problem_type_enum"][]
            | null;
          rating?: number | null;
          review_count?: number | null;
          single_price?: number | null;
          size_sqm?: number | null;
          status?: Database["public"]["Enums"]["gym_status_enum"];
          ten_times_price?: number | null;
          updated_at?: string | null;
          weekday_end?: string | null;
          weekday_start?: string | null;
          weekend_end?: string | null;
          weekend_start?: string | null;
        };
        Relationships: [];
      };
      passes: {
        Row: {
          created_at: string | null;
          end_date: string | null;
          gym_id: string;
          id: string;
          name: string;
          remaining_count: number | null;
          start_date: string;
          total_count: number | null;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          end_date?: string | null;
          gym_id: string;
          id?: string;
          name: string;
          remaining_count?: number | null;
          start_date: string;
          total_count?: number | null;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          end_date?: string | null;
          gym_id?: string;
          id?: string;
          name?: string;
          remaining_count?: number | null;
          start_date?: string;
          total_count?: number | null;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "passes_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          default_checkout_duration: number | null;
          facebook: string | null;
          id: string;
          instagram: string | null;
          nickname: string;
          region: string | null;
          tiktok: string | null;
          twitter: string | null;
          updated_at: string | null;
          website: string | null;
          youtube: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          default_checkout_duration?: number | null;
          facebook?: string | null;
          id: string;
          instagram?: string | null;
          nickname: string;
          region?: string | null;
          tiktok?: string | null;
          twitter?: string | null;
          updated_at?: string | null;
          website?: string | null;
          youtube?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          default_checkout_duration?: number | null;
          facebook?: string | null;
          id?: string;
          instagram?: string | null;
          nickname?: string;
          region?: string | null;
          tiktok?: string | null;
          twitter?: string | null;
          updated_at?: string | null;
          website?: string | null;
          youtube?: string | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          admin_note: string | null;
          category: string;
          created_at: string | null;
          description: string | null;
          id: string;
          reason: string;
          reporter_id: string;
          status: string;
          target_id: string;
          target_type: string;
          updated_at: string | null;
        };
        Insert: {
          admin_note?: string | null;
          category: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason: string;
          reporter_id: string;
          status?: string;
          target_id: string;
          target_type: string;
          updated_at?: string | null;
        };
        Update: {
          admin_note?: string | null;
          category?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason?: string;
          reporter_id?: string;
          status?: string;
          target_id?: string;
          target_type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      session_media: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          media_type: string;
          media_url: string;
          session_id: string;
          thumbnail_url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          media_type: string;
          media_url: string;
          session_id: string;
          thumbnail_url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          media_type?: string;
          media_url?: string;
          session_id?: string;
          thumbnail_url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_media_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          attempt_count: number | null;
          completed_count: number | null;
          condition: string | null;
          created_at: string | null;
          date: string;
          gym_id: string;
          id: string;
          max_grade: string | null;
          memo: string | null;
          pass_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          attempt_count?: number | null;
          completed_count?: number | null;
          condition?: string | null;
          created_at?: string | null;
          date: string;
          gym_id: string;
          id?: string;
          max_grade?: string | null;
          memo?: string | null;
          pass_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          attempt_count?: number | null;
          completed_count?: number | null;
          condition?: string | null;
          created_at?: string | null;
          date?: string;
          gym_id?: string;
          id?: string;
          max_grade?: string | null;
          memo?: string | null;
          pass_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_gym_id_fkey";
            columns: ["gym_id"];
            isOneToOne: false;
            referencedRelation: "gyms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sessions_pass_id_fkey";
            columns: ["pass_id"];
            isOneToOne: false;
            referencedRelation: "passes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      community_post_category_enum: "question" | "tip" | "crew";
      contact_message_status_enum: "pending" | "resolved";
      contact_message_type_enum: "bug" | "info" | "feature" | "other";
      gym_city_enum:
        | "seoul"
        | "busan"
        | "daegu"
        | "incheon"
        | "daejeon"
        | "gwangju"
        | "ulsan"
        | "gyeonggi"
        | "gangwon"
        | "chungbuk"
        | "chungnam"
        | "jeonbuk"
        | "jeonnam"
        | "gyeongbuk"
        | "gyeongnam"
        | "jeju";
      gym_edit_suggestion_status_enum: "pending" | "approved" | "rejected";
      gym_status_enum: "pending" | "active" | "rejected" | "inactive";
      pass_type_enum: "count" | "period" | "daily";
      problem_type_enum:
        | "dyno"
        | "crimpy"
        | "balance"
        | "slab"
        | "overhang"
        | "roof"
        | "crack"
        | "pinch"
        | "compression"
        | "technical"
        | "power"
        | "endurance"
        | "mixed";
      report_category_enum:
        | "spam"
        | "inappropriate"
        | "fake"
        | "harassment"
        | "copyright"
        | "other";
      report_status_enum: "pending" | "reviewed" | "resolved" | "rejected";
      report_target_type_enum: "user" | "community_post" | "gym";
      session_condition_enum: "good" | "normal" | "bad";
      session_media_type_enum: "image" | "video";
      vote_type_enum: "upvote" | "downvote";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      community_post_category_enum: ["question", "tip", "crew"],
      contact_message_status_enum: ["pending", "resolved"],
      contact_message_type_enum: ["bug", "info", "feature", "other"],
      gym_city_enum: [
        "seoul",
        "busan",
        "daegu",
        "incheon",
        "daejeon",
        "gwangju",
        "ulsan",
        "gyeonggi",
        "gangwon",
        "chungbuk",
        "chungnam",
        "jeonbuk",
        "jeonnam",
        "gyeongbuk",
        "gyeongnam",
        "jeju",
      ],
      gym_edit_suggestion_status_enum: ["pending", "approved", "rejected"],
      gym_status_enum: ["pending", "active", "rejected", "inactive"],
      pass_type_enum: ["count", "period", "daily"],
      problem_type_enum: [
        "dyno",
        "crimpy",
        "balance",
        "slab",
        "overhang",
        "roof",
        "crack",
        "pinch",
        "compression",
        "technical",
        "power",
        "endurance",
        "mixed",
      ],
      report_category_enum: [
        "spam",
        "inappropriate",
        "fake",
        "harassment",
        "copyright",
        "other",
      ],
      report_status_enum: ["pending", "reviewed", "resolved", "rejected"],
      report_target_type_enum: ["user", "community_post", "gym"],
      session_condition_enum: ["good", "normal", "bad"],
      session_media_type_enum: ["image", "video"],
      vote_type_enum: ["upvote", "downvote"],
    },
  },
} as const;
