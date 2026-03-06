import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Scale, ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch role to redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const role = roleData?.role || "aluno";
        const routes: Record<string, string> = {
          aluno: "/aluno",
          professor: "/professor",
          coordenador: "/coordenacao",
          admin: "/admin",
        };
        toast({ title: "Login realizado!", description: "Bem-vindo(a) ao AVAL.IA" });
        navigate(routes[role] || "/");
      }
    } catch (error: any) {
      toast({ title: "Erro de autenticação", description: error.message || "E-mail ou senha inválidos.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: "E-mail enviado", description: "Verifique sua caixa de entrada para redefinir a senha." });
      setShowRecovery(false);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-navy relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gold/20"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Scale className="h-10 w-10 text-gold" />
            <h1 className="text-4xl font-display text-primary-foreground tracking-tight">
              AVAL<span className="text-gradient-gold">.IA</span>
            </h1>
          </div>
          <p className="text-lg text-sidebar-foreground/80 leading-relaxed mb-6">
            Plataforma de avaliação inteligente para cursos de Direito
          </p>
          <div className="space-y-3 text-sm text-sidebar-foreground/60">
            <p>✦ Geração inteligente de avaliações</p>
            <p>✦ Diagnóstico acadêmico automatizado</p>
            <p>✦ Recomendação personalizada de estudo</p>
          </div>
        </motion.div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Scale className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-display text-foreground">
              AVAL<span className="text-gradient-gold">.IA</span>
            </h1>
          </div>

          {!showRecovery ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-1">Entrar na plataforma</h2>
                <p className="text-muted-foreground text-sm">Insira suas credenciais para acessar o sistema</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10 h-11 bg-card border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 bg-card border-border"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-sm text-accent hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Entrar <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Para começar, crie um usuário admin na aba Cloud → Users.</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-1">Recuperar senha</h2>
                <p className="text-muted-foreground text-sm">Enviaremos instruções para seu e-mail</p>
              </div>
              <form onSubmit={handleRecovery} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="recovery-email" className="text-sm font-medium text-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recovery-email"
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10 h-11 bg-card border-border"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 gradient-gold text-accent-foreground font-semibold hover:opacity-90">
                  Enviar link de recuperação
                </Button>
                <button
                  type="button"
                  onClick={() => setShowRecovery(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Voltar ao login
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
