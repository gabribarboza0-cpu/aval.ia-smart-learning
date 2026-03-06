import { motion } from "framer-motion";
import { Users, Shield, Settings, BarChart3, Database, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";

const usuarios = [
  { nome: "Maria Silva", email: "maria@uni.edu.br", perfil: "Aluno", status: "Ativo" },
  { nome: "Dr. João Santos", email: "joao@uni.edu.br", perfil: "Professor", status: "Ativo" },
  { nome: "Dra. Ana Oliveira", email: "ana@uni.edu.br", perfil: "Coordenador", status: "Ativo" },
  { nome: "Carlos Admin", email: "carlos@uni.edu.br", perfil: "Admin", status: "Ativo" },
  { nome: "Fernanda Lima", email: "fernanda@uni.edu.br", perfil: "Aluno", status: "Inativo" },
];

export default function AdminDashboard() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerenciamento geral da plataforma</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Usuários Totais" value="456" icon={<Users className="h-5 w-5" />} subtitle="384 alunos, 28 professores" />
          <StatCard title="Questões no Banco" value="1.247" icon={<Database className="h-5 w-5" />} trend={{ value: "+82 este mês", positive: true }} />
          <StatCard title="Provas Aplicadas" value="186" icon={<BarChart3 className="h-5 w-5" />} subtitle="Este semestre" />
          <StatCard title="Uptime" value="99.8%" icon={<Activity className="h-5 w-5" />} subtitle="Últimos 30 dias" />
        </div>

        {/* Users table */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Usuários Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Nome</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">E-mail</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Perfil</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{u.nome}</td>
                    <td className="py-2.5 text-muted-foreground">{u.email}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        u.perfil === "Admin" ? "bg-primary/10 text-primary" :
                        u.perfil === "Professor" ? "bg-accent/10 text-accent-foreground" :
                        u.perfil === "Coordenador" ? "bg-info/10 text-info" :
                        "bg-muted text-muted-foreground"
                      }`}>{u.perfil}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs ${u.status === "Ativo" ? "text-success" : "text-muted-foreground"}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
