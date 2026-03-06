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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          aderencia_enade: boolean
          created_at: string
          data_aplicacao: string | null
          descricao: string
          disciplina_predominante: string
          disciplinas_secundarias: Json
          estilo_prova: Database["public"]["Enums"]["estilo_prova"]
          gabarito: Json
          grau_interdisciplinaridade: string
          id: string
          modo_aplicacao: Database["public"]["Enums"]["modo_aplicacao"]
          nivel_dificuldade: Database["public"]["Enums"]["nivel_dificuldade"]
          nota_total: number
          numero_questoes: number
          perfil_turma: string
          pontuacao_por_questao: Json
          professor_id: string | null
          questao_ids: Json
          repertorio_contemporaneo: boolean
          status: Database["public"]["Enums"]["status_avaliacao"]
          temas_desejados: Json
          tempo_prova: number
          tipo_avaliacao: Database["public"]["Enums"]["tipo_avaliacao"]
          titulo: string
          turma_codigo: string
          updated_at: string
        }
        Insert: {
          aderencia_enade?: boolean
          created_at?: string
          data_aplicacao?: string | null
          descricao?: string
          disciplina_predominante?: string
          disciplinas_secundarias?: Json
          estilo_prova?: Database["public"]["Enums"]["estilo_prova"]
          gabarito?: Json
          grau_interdisciplinaridade?: string
          id?: string
          modo_aplicacao?: Database["public"]["Enums"]["modo_aplicacao"]
          nivel_dificuldade?: Database["public"]["Enums"]["nivel_dificuldade"]
          nota_total?: number
          numero_questoes?: number
          perfil_turma?: string
          pontuacao_por_questao?: Json
          professor_id?: string | null
          questao_ids?: Json
          repertorio_contemporaneo?: boolean
          status?: Database["public"]["Enums"]["status_avaliacao"]
          temas_desejados?: Json
          tempo_prova?: number
          tipo_avaliacao?: Database["public"]["Enums"]["tipo_avaliacao"]
          titulo: string
          turma_codigo?: string
          updated_at?: string
        }
        Update: {
          aderencia_enade?: boolean
          created_at?: string
          data_aplicacao?: string | null
          descricao?: string
          disciplina_predominante?: string
          disciplinas_secundarias?: Json
          estilo_prova?: Database["public"]["Enums"]["estilo_prova"]
          gabarito?: Json
          grau_interdisciplinaridade?: string
          id?: string
          modo_aplicacao?: Database["public"]["Enums"]["modo_aplicacao"]
          nivel_dificuldade?: Database["public"]["Enums"]["nivel_dificuldade"]
          nota_total?: number
          numero_questoes?: number
          perfil_turma?: string
          pontuacao_por_questao?: Json
          professor_id?: string | null
          questao_ids?: Json
          repertorio_contemporaneo?: boolean
          status?: Database["public"]["Enums"]["status_avaliacao"]
          temas_desejados?: Json
          tempo_prova?: number
          tipo_avaliacao?: Database["public"]["Enums"]["tipo_avaliacao"]
          titulo?: string
          turma_codigo?: string
          updated_at?: string
        }
        Relationships: []
      }
      disciplina_turmas: {
        Row: {
          created_at: string
          disciplina_id: string
          id: string
          turma_id: string
        }
        Insert: {
          created_at?: string
          disciplina_id: string
          id?: string
          turma_id: string
        }
        Update: {
          created_at?: string
          disciplina_id?: string
          id?: string
          turma_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciplina_turmas_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciplina_turmas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinas: {
        Row: {
          carga_horaria: number
          codigo: string
          created_at: string
          id: string
          nome: string
          periodo: string
          professor_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          carga_horaria?: number
          codigo: string
          created_at?: string
          id?: string
          nome: string
          periodo?: string
          professor_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          carga_horaria?: number
          codigo?: string
          created_at?: string
          id?: string
          nome?: string
          periodo?: string
          professor_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questoes: {
        Row: {
          alternativas: Json
          competencias: Json
          created_at: string
          disciplina_predominante: string
          disciplinas_secundarias: Json
          enunciado: string
          gabarito: number
          historico_uso: number
          id: string
          indice_dificuldade_observado: number
          justificativa: string
          nivel_dificuldade: Database["public"]["Enums"]["nivel_dificuldade"]
          nivel_interdisciplinaridade: string
          origem_questao: string
          perfil_turma: string
          poder_discriminacao: number
          professor_id: string | null
          repertorio_contemporaneo: string
          status_validacao: Database["public"]["Enums"]["status_validacao"]
          subtema: string
          taxa_acerto: number
          taxa_erro: number
          tema: string
          tipo_questao: Database["public"]["Enums"]["tipo_questao"]
          updated_at: string
        }
        Insert: {
          alternativas?: Json
          competencias?: Json
          created_at?: string
          disciplina_predominante?: string
          disciplinas_secundarias?: Json
          enunciado: string
          gabarito?: number
          historico_uso?: number
          id?: string
          indice_dificuldade_observado?: number
          justificativa?: string
          nivel_dificuldade?: Database["public"]["Enums"]["nivel_dificuldade"]
          nivel_interdisciplinaridade?: string
          origem_questao?: string
          perfil_turma?: string
          poder_discriminacao?: number
          professor_id?: string | null
          repertorio_contemporaneo?: string
          status_validacao?: Database["public"]["Enums"]["status_validacao"]
          subtema?: string
          taxa_acerto?: number
          taxa_erro?: number
          tema?: string
          tipo_questao?: Database["public"]["Enums"]["tipo_questao"]
          updated_at?: string
        }
        Update: {
          alternativas?: Json
          competencias?: Json
          created_at?: string
          disciplina_predominante?: string
          disciplinas_secundarias?: Json
          enunciado?: string
          gabarito?: number
          historico_uso?: number
          id?: string
          indice_dificuldade_observado?: number
          justificativa?: string
          nivel_dificuldade?: Database["public"]["Enums"]["nivel_dificuldade"]
          nivel_interdisciplinaridade?: string
          origem_questao?: string
          perfil_turma?: string
          poder_discriminacao?: number
          professor_id?: string | null
          repertorio_contemporaneo?: string
          status_validacao?: Database["public"]["Enums"]["status_validacao"]
          subtema?: string
          taxa_acerto?: number
          taxa_erro?: number
          tema?: string
          tipo_questao?: Database["public"]["Enums"]["tipo_questao"]
          updated_at?: string
        }
        Relationships: []
      }
      turma_alunos: {
        Row: {
          aluno_id: string
          created_at: string
          id: string
          turma_id: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          id?: string
          turma_id: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          id?: string
          turma_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turma_alunos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          codigo: string
          created_at: string
          id: string
          nome: string
          periodo: string
          status: string
          turno: Database["public"]["Enums"]["turno_tipo"]
          updated_at: string
        }
        Insert: {
          codigo: string
          created_at?: string
          id?: string
          nome: string
          periodo?: string
          status?: string
          turno?: Database["public"]["Enums"]["turno_tipo"]
          updated_at?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: string
          nome?: string
          periodo?: string
          status?: string
          turno?: Database["public"]["Enums"]["turno_tipo"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coordenador" | "professor" | "aluno"
      estilo_prova:
        | "Tradicional"
        | "Interdisciplinar"
        | "Caso Prático"
        | "Mista"
      modo_aplicacao: "Presencial" | "Digital" | "Híbrido"
      nivel_dificuldade: "Fácil" | "Médio" | "Difícil" | "Muito Difícil"
      status_avaliacao:
        | "Rascunho"
        | "Configurada"
        | "Agendada"
        | "Em Aplicação"
        | "Encerrada"
        | "Corrigida"
      status_validacao: "Rascunho" | "Em Revisão" | "Validada" | "Arquivada"
      tipo_avaliacao:
        | "AV1"
        | "AV2"
        | "AV3"
        | "Simulado"
        | "Quiz"
        | "Diagnóstica"
        | "Recuperação"
      tipo_questao:
        | "Múltipla Escolha"
        | "Verdadeiro/Falso"
        | "Dissertativa"
        | "Caso Prático"
      turno_tipo: "Matutino" | "Vespertino" | "Noturno"
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
      app_role: ["admin", "coordenador", "professor", "aluno"],
      estilo_prova: [
        "Tradicional",
        "Interdisciplinar",
        "Caso Prático",
        "Mista",
      ],
      modo_aplicacao: ["Presencial", "Digital", "Híbrido"],
      nivel_dificuldade: ["Fácil", "Médio", "Difícil", "Muito Difícil"],
      status_avaliacao: [
        "Rascunho",
        "Configurada",
        "Agendada",
        "Em Aplicação",
        "Encerrada",
        "Corrigida",
      ],
      status_validacao: ["Rascunho", "Em Revisão", "Validada", "Arquivada"],
      tipo_avaliacao: [
        "AV1",
        "AV2",
        "AV3",
        "Simulado",
        "Quiz",
        "Diagnóstica",
        "Recuperação",
      ],
      tipo_questao: [
        "Múltipla Escolha",
        "Verdadeiro/Falso",
        "Dissertativa",
        "Caso Prático",
      ],
      turno_tipo: ["Matutino", "Vespertino", "Noturno"],
    },
  },
} as const
