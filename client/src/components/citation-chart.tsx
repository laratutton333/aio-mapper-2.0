import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CitationDistribution {
  type: string;
  count: number;
  percentage: number;
}

interface CitationDonutChartProps {
  data: CitationDistribution[];
  title: string;
  className?: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
];

const formatLabel = (type: string) =>
  type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

export function CitationDonutChart({ data, title, className }: CitationDonutChartProps) {
  const chartData = data.map((d) => ({
    name: formatLabel(d.type),
    value: d.count,
    percentage: d.percentage,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="hsl(var(--foreground))"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {`${percentage.toFixed(0)}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value} citations`,
                  name,
                ]}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span className="text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
