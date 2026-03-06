import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-elevated transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}
