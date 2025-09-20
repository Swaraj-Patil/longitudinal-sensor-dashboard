import { Activity, Clock, Smartphone, AlertTriangle, Moon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  hasData: boolean;
}

function MetricCard({ title, value, icon, trend, trendValue, hasData }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl mt-1">{hasData ? value : "—"}</p>
            </div>
          </div>
          {hasData && trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-500"
            }`}>
              {trend === "up" ? 
                <TrendingUp className="size-4" /> : 
                <TrendingDown className="size-4" />
              }
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryCardsProps {
  hasData: boolean;
}

export function SummaryCards({ hasData }: SummaryCardsProps) {
  const metrics = [
    {
      title: "Active Time",
      value: "4h 32m",
      icon: <Activity className="size-5 text-chart-1" />,
      trend: "up" as const,
      trendValue: "+12%"
    },
    {
      title: "Avg Activity Level",
      value: "7.2/10",
      icon: <TrendingUp className="size-5 text-chart-2" />,
      trend: "down" as const,
      trendValue: "-3%"
    },
    {
      title: "Sleep Hours",
      value: "7h 45m",
      icon: <Moon className="size-5 text-chart-3" />,
      trend: "up" as const,
      trendValue: "+8%"
    },
    {
      title: "Screen Time",
      value: "3h 18m",
      icon: <Smartphone className="size-5 text-chart-4" />,
      trend: "down" as const,
      trendValue: "-15%"
    },
    {
      title: "Anomaly Days",
      value: "2",
      icon: <AlertTriangle className="size-5 text-destructive" />,
      trend: "down" as const,
      trendValue: "-1"
    },
    {
      title: "Data Quality",
      value: "94%",
      icon: <Clock className="size-5 text-chart-5" />,
      trend: "up" as const,
      trendValue: "+2%"
    }
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          trend={metric.trend}
          trendValue={metric.trendValue}
          hasData={hasData}
        />
      ))}
    </div>
  );
}