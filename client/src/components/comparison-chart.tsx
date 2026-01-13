import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComparisonData } from "@shared/schema";

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title: string;
  className?: string;
}

export function ComparisonBarChart({ data, title, className }: ComparisonBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.brand,
    "Presence Rate": d.presenceRate * 100,
    "Citation Rate": d.citationRate * 100,
    "Recommendation Rate": d.recommendationRate * 100,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} className="text-xs" />
              <YAxis type="category" dataKey="name" className="text-xs" width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(var(--popover-foreground))",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
                itemStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="Presence Rate" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Citation Rate" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Recommendation Rate" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface TrendData {
  date: string;
  score: number;
}

interface TrendChartProps {
  data: TrendData[];
  title: string;
  className?: string;
}

export function TrendChart({ data, title, className }: TrendChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(var(--popover-foreground))",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
                itemStyle={{
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
