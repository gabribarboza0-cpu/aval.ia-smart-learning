import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Save, RotateCcw, BookOpen, Target, Clock,
  Shield, Bell, Palette, Database, Globe,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface ConfigGeral {
  nomeInstituicao: string;
  siglaCurso: string;
  emailSuporte: string;
  semestreAtual: string;
  mediaAprovacao: number;
  frequenciaMinima: number;
}

interface ConfigAvaliacao {
  tempoMaximoProva: number;
  tentativasMaximas: number;
  embaralharQuestoes: boolean;
  embaralharAlternativas: boolean;
  mostrarGabarito: boolean;
  notaCorte: number;
  pesoENADE: number;
}

interface ConfigNotificacao {
  emailAlunoRisco: boolean;
  emailProvaPublicada: boolean;
  emailResultadoDisponivel: boolean;
  alertaCoordenacao: boolean;
  digestSemanal: boolean;
}

const DEFAULTS_GERAL: ConfigGeral = {
  nomeInstituicao: "Universidade Federal de Direito",
  siglaCurso: "DIR",
  emailSuporte: "suporte@avalia.edu.br",
  semestreAtual: "2026.1",
  mediaAprovacao: 6.0,
  frequenciaMinima: 75,
};

const DEFAULTS_AVALIACAO: ConfigAvaliacao = {
  tempoMaximoProva: 120,
  tentativasMaximas: 2,
  embaralharQuestoes: true,
  embaralharAlternativas: true,
  mostrarGabarito: true,
  notaCorte: 5.0,
  pesoENADE: 70,
};

const DEFAULTS_NOTIFICACAO: ConfigNotificacao = {
  emailAlunoRisco: true,
  emailProvaPublicada: true,
  emailResultadoDisponivel: true,
  alertaCoordenacao: true,
  digestSemanal: false,
};

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

export default function AdminConfiguracoes() {
  const [geral, setGeral] = useState(DEFAULTS_GERAL);
  const [avaliacao, setAvaliacao] = useState(DEFAULTS_AVALIACAO);
  const [notificacao, setNotificacao] = useState(DEFAULTS_NOTIFICACAO);

  const salvar = () => toast({ title: "Configurações salvas com sucesso!" });
  const resetar = () => {
    setGeral(DEFAULTS_GERAL);
    setAvaliacao(DEFAULTS_AVALIACAO);
    setNotificacao(DEFAULTS_NOTIFICACAO);
    toast({ title: "Configurações restauradas ao padrão" });
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 text-accent" />
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Parâmetros gerais da plataforma</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetar} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Restaurar Padrão
            </Button>
            <Button onClick={salvar} className="gap-2">
              <Save className="h-4 w-4" /> Salvar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="geral" className="gap-1.5 text-xs"><Globe className="h-3.5 w-3.5" />Geral</TabsTrigger>
            <TabsTrigger value="avaliacao" className="gap-1.5 text-xs"><Target className="h-3.5 w-3.5" />Avaliações</TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-1.5 text-xs"><Bell className="h-3.5 w-3.5" />Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <SectionCard icon={<Globe className="h-4 w-4 text-primary" />} title="Dados da Instituição">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Nome da Instituição</Label>
                  <Input value={geral.nomeInstituicao} onChange={(e) => setGeral({ ...geral, nomeInstituicao: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Sigla do Curso</Label>
                  <Input value={geral.siglaCurso} onChange={(e) => setGeral({ ...geral, siglaCurso: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">E-mail de Suporte</Label>
                  <Input value={geral.emailSuporte} onChange={(e) => setGeral({ ...geral, emailSuporte: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Semestre Atual</Label>
                  <Select value={geral.semestreAtual} onValueChange={(v) => setGeral({ ...geral, semestreAtual: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025.2">2025.2</SelectItem>
                      <SelectItem value="2026.1">2026.1</SelectItem>
                      <SelectItem value="2026.2">2026.2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={<Shield className="h-4 w-4 text-accent" />} title="Parâmetros Acadêmicos">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Média mínima para aprovação</Label>
                  <Input type="number" step="0.5" min="0" max="10" value={geral.mediaAprovacao}
                    onChange={(e) => setGeral({ ...geral, mediaAprovacao: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label className="text-xs">Frequência mínima (%)</Label>
                  <Input type="number" min="0" max="100" value={geral.frequenciaMinima}
                    onChange={(e) => setGeral({ ...geral, frequenciaMinima: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="avaliacao" className="space-y-6">
            <SectionCard icon={<Clock className="h-4 w-4 text-primary" />} title="Tempo e Tentativas">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Tempo máximo de prova (minutos)</Label>
                  <Input type="number" min="10" max="300" value={avaliacao.tempoMaximoProva}
                    onChange={(e) => setAvaliacao({ ...avaliacao, tempoMaximoProva: parseInt(e.target.value) || 60 })} />
                </div>
                <div>
                  <Label className="text-xs">Máximo de tentativas por prova</Label>
                  <Input type="number" min="1" max="10" value={avaliacao.tentativasMaximas}
                    onChange={(e) => setAvaliacao({ ...avaliacao, tentativasMaximas: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label className="text-xs">Nota de corte</Label>
                  <Input type="number" step="0.5" min="0" max="10" value={avaliacao.notaCorte}
                    onChange={(e) => setAvaliacao({ ...avaliacao, notaCorte: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label className="text-xs">Peso aderência ENADE (%)</Label>
                  <Input type="number" min="0" max="100" value={avaliacao.pesoENADE}
                    onChange={(e) => setAvaliacao({ ...avaliacao, pesoENADE: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={<BookOpen className="h-4 w-4 text-accent" />} title="Comportamento da Prova">
              <div className="space-y-4">
                {[
                  { key: "embaralharQuestoes" as const, label: "Embaralhar ordem das questões", desc: "Cada aluno recebe as questões em ordem diferente" },
                  { key: "embaralharAlternativas" as const, label: "Embaralhar alternativas", desc: "As alternativas são reordenadas aleatoriamente" },
                  { key: "mostrarGabarito" as const, label: "Exibir gabarito após conclusão", desc: "Aluno pode ver as respostas corretas e justificativas" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={avaliacao[item.key]} onCheckedChange={(v) => setAvaliacao({ ...avaliacao, [item.key]: v })} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="notificacoes" className="space-y-6">
            <SectionCard icon={<Bell className="h-4 w-4 text-primary" />} title="Notificações por E-mail">
              <div className="space-y-4">
                {[
                  { key: "emailAlunoRisco" as const, label: "Alerta de aluno em risco", desc: "Notifica coordenação quando aluno entra em risco acadêmico" },
                  { key: "emailProvaPublicada" as const, label: "Prova publicada", desc: "Notifica alunos quando uma nova prova é disponibilizada" },
                  { key: "emailResultadoDisponivel" as const, label: "Resultado disponível", desc: "Avisa alunos quando o resultado da prova está liberado" },
                  { key: "alertaCoordenacao" as const, label: "Alertas para coordenação", desc: "Resumo de indicadores críticos para coordenadores" },
                  { key: "digestSemanal" as const, label: "Digest semanal", desc: "Resumo semanal consolidado para todos os perfis" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={notificacao[item.key]} onCheckedChange={(v) => setNotificacao({ ...notificacao, [item.key]: v })} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
