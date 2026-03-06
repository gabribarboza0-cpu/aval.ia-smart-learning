-- ==============================
-- 1. Enum types
-- ==============================
CREATE TYPE public.app_role AS ENUM ('admin', 'coordenador', 'professor', 'aluno');
CREATE TYPE public.turno_tipo AS ENUM ('Matutino', 'Vespertino', 'Noturno');
CREATE TYPE public.nivel_dificuldade AS ENUM ('Fácil', 'Médio', 'Difícil', 'Muito Difícil');
CREATE TYPE public.tipo_questao AS ENUM ('Múltipla Escolha', 'Verdadeiro/Falso', 'Dissertativa', 'Caso Prático');
CREATE TYPE public.status_validacao AS ENUM ('Rascunho', 'Em Revisão', 'Validada', 'Arquivada');
CREATE TYPE public.status_avaliacao AS ENUM ('Rascunho', 'Configurada', 'Agendada', 'Em Aplicação', 'Encerrada', 'Corrigida');
CREATE TYPE public.modo_aplicacao AS ENUM ('Presencial', 'Digital', 'Híbrido');
CREATE TYPE public.estilo_prova AS ENUM ('Tradicional', 'Interdisciplinar', 'Caso Prático', 'Mista');
CREATE TYPE public.tipo_avaliacao AS ENUM ('AV1', 'AV2', 'AV3', 'Simulado', 'Quiz', 'Diagnóstica', 'Recuperação');

-- ==============================
-- 2. Timestamp trigger function
-- ==============================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==============================
-- 3. Profiles table
-- ==============================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================
-- 4. User roles table
-- ==============================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ==============================
-- 5. Security definer function for role checks
-- ==============================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- ==============================
-- 6. Turmas table
-- ==============================
CREATE TABLE public.turmas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  periodo TEXT NOT NULL DEFAULT '1º',
  turno turno_tipo NOT NULL DEFAULT 'Matutino',
  status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Inativa')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_turmas_updated_at BEFORE UPDATE ON public.turmas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================
-- 7. Disciplinas table
-- ==============================
CREATE TABLE public.disciplinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL DEFAULT 60,
  periodo TEXT NOT NULL DEFAULT '1º',
  status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Inativa')),
  professor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_disciplinas_updated_at BEFORE UPDATE ON public.disciplinas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================
-- 8. Junction: turma_alunos
-- ==============================
CREATE TABLE public.turma_alunos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(turma_id, aluno_id)
);
ALTER TABLE public.turma_alunos ENABLE ROW LEVEL SECURITY;

-- ==============================
-- 9. Junction: disciplina_turmas
-- ==============================
CREATE TABLE public.disciplina_turmas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(disciplina_id, turma_id)
);
ALTER TABLE public.disciplina_turmas ENABLE ROW LEVEL SECURITY;

-- ==============================
-- 10. Questoes table
-- ==============================
CREATE TABLE public.questoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enunciado TEXT NOT NULL,
  alternativas JSONB NOT NULL DEFAULT '[]',
  gabarito INTEGER NOT NULL DEFAULT 0,
  justificativa TEXT NOT NULL DEFAULT '',
  disciplina_predominante TEXT NOT NULL DEFAULT '',
  disciplinas_secundarias JSONB NOT NULL DEFAULT '[]',
  nivel_dificuldade nivel_dificuldade NOT NULL DEFAULT 'Médio',
  tipo_questao tipo_questao NOT NULL DEFAULT 'Múltipla Escolha',
  competencias JSONB NOT NULL DEFAULT '[]',
  tema TEXT NOT NULL DEFAULT '',
  subtema TEXT NOT NULL DEFAULT '',
  repertorio_contemporaneo TEXT NOT NULL DEFAULT '',
  nivel_interdisciplinaridade TEXT NOT NULL DEFAULT 'Baixo' CHECK (nivel_interdisciplinaridade IN ('Baixo', 'Médio', 'Alto')),
  perfil_turma TEXT NOT NULL DEFAULT '',
  origem_questao TEXT NOT NULL DEFAULT '',
  professor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status_validacao status_validacao NOT NULL DEFAULT 'Rascunho',
  historico_uso INTEGER NOT NULL DEFAULT 0,
  taxa_acerto NUMERIC NOT NULL DEFAULT 0,
  taxa_erro NUMERIC NOT NULL DEFAULT 0,
  indice_dificuldade_observado NUMERIC NOT NULL DEFAULT 0,
  poder_discriminacao NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_questoes_updated_at BEFORE UPDATE ON public.questoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================
-- 11. Avaliacoes table
-- ==============================
CREATE TABLE public.avaliacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  tipo_avaliacao tipo_avaliacao NOT NULL DEFAULT 'AV1',
  numero_questoes INTEGER NOT NULL DEFAULT 10,
  disciplina_predominante TEXT NOT NULL DEFAULT '',
  disciplinas_secundarias JSONB NOT NULL DEFAULT '[]',
  grau_interdisciplinaridade TEXT NOT NULL DEFAULT 'Baixo',
  nivel_dificuldade nivel_dificuldade NOT NULL DEFAULT 'Médio',
  perfil_turma TEXT NOT NULL DEFAULT '',
  temas_desejados JSONB NOT NULL DEFAULT '[]',
  estilo_prova estilo_prova NOT NULL DEFAULT 'Tradicional',
  aderencia_enade BOOLEAN NOT NULL DEFAULT false,
  repertorio_contemporaneo BOOLEAN NOT NULL DEFAULT false,
  data_aplicacao TIMESTAMPTZ,
  tempo_prova INTEGER NOT NULL DEFAULT 120,
  modo_aplicacao modo_aplicacao NOT NULL DEFAULT 'Digital',
  turma_codigo TEXT NOT NULL DEFAULT '',
  questao_ids JSONB NOT NULL DEFAULT '[]',
  status status_avaliacao NOT NULL DEFAULT 'Rascunho',
  professor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  gabarito JSONB NOT NULL DEFAULT '[]',
  pontuacao_por_questao JSONB NOT NULL DEFAULT '[]',
  nota_total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_avaliacoes_updated_at BEFORE UPDATE ON public.avaliacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================
-- 12. RLS Policies
-- ==============================

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: only admins manage, users can read own
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Turmas: authenticated can read, admins/coordenadores can manage
CREATE POLICY "Authenticated can view turmas" ON public.turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage turmas" ON public.turmas FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador'));

-- Disciplinas: authenticated can read, admins/coordenadores can manage
CREATE POLICY "Authenticated can view disciplinas" ON public.disciplinas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage disciplinas" ON public.disciplinas FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador'));

-- Turma alunos: authenticated can read, admins can manage
CREATE POLICY "Authenticated can view turma_alunos" ON public.turma_alunos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage turma_alunos" ON public.turma_alunos FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador'));

-- Disciplina turmas: authenticated can read, admins can manage
CREATE POLICY "Authenticated can view disciplina_turmas" ON public.disciplina_turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage disciplina_turmas" ON public.disciplina_turmas FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador'));

-- Questoes: authenticated can read, professors/admins can manage
CREATE POLICY "Authenticated can view questoes" ON public.questoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Professors can manage own questoes" ON public.questoes FOR ALL USING (
  auth.uid() = professor_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador')
);

-- Avaliacoes: authenticated can read, professors/admins can manage
CREATE POLICY "Authenticated can view avaliacoes" ON public.avaliacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Professors can manage own avaliacoes" ON public.avaliacoes FOR ALL USING (
  auth.uid() = professor_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'coordenador')
);

-- ==============================
-- 13. Auto-create profile + role on signup
-- ==============================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'aluno'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();