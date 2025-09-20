import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TimelineChartProps {
  hasData: boolean;
}

export function TimelineChart({ hasData }: TimelineChartProps) {
  // Mock data for 7 days
  const timelineData = hasData ? [
    {
      date: "Mon 16",
      time: "2024-09-16",
      activity: 6.2,
      phoneUsage: 180,
      sleepHours: 7.5,
      isAnomaly: false
    },
    {
      date: "Tue 17", 
      time: "2024-09-17",
      activity: 8.1,
      phoneUsage: 245,
      sleepHours: 6.8,
      isAnomaly: true
    },
    {
      date: "Wed 18",
      time: "2024-09-18", 
      activity: 7.3,
      phoneUsage: 198,
      sleepHours: 8.2,
      isAnomaly: false
    },
    {
      date: "Thu 19",
      time: "2024-09-19",
      activity: 5.8,
      phoneUsage: 312,
      sleepHours: 6.2,
      isAnomaly: true
    },
    {
      date: "Fri 20",
      time: "2024-09-20",
      activity: 9.1,
      phoneUsage: 156,
      sleepHours: 7.9,
      isAnomaly: false
    },
    {
      date: "Sat 21",
      time: "2024-09-21",
      activity: 7.8,
      phoneUsage: 203,
      sleepHours: 8.5,
      isAnomaly: false
    },
    {
      date: "Sun 22",
      time: "2024-09-22",
      activity: 6.9,
      phoneUsage: 167,
      sleepHours: 7.7,
      isAnomaly: false
    }
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === "Activity" && "/10"}
              {entry.name === "Phone Usage" && " min"}
              {entry.name === "Sleep Hours" && " hrs"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Activity Level Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Activity Level
            <span className="text-sm text-muted-foreground">(0-10 scale)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="var(--color-chart-1)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                  name="Activity"
                />
                {/* Highlight anomaly days */}
                {timelineData.map((entry, index) => 
                  entry.isAnomaly && (
                    <rect
                      key={index}
                      x={`${(index / (timelineData.length - 1)) * 100}%`}
                      y="0"
                      width="14%"
                      height="100%"
                      fill="var(--color-destructive)"
                      opacity="0.1"
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No activity data for selected period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Usage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Usage
            <span className="text-sm text-muted-foreground">(minutes per day)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="phoneUsage" name="Phone Usage">
                  {timelineData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.isAnomaly ? "var(--color-destructive)" : "var(--color-chart-4)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No phone usage data for selected period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sleep Hours
            <span className="text-sm text-muted-foreground">(estimated from low activity)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[0, 12]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="sleepHours" 
                  stroke="var(--color-chart-3)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-chart-3)", strokeWidth: 2, r: 4 }}
                  name="Sleep Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No sleep data for selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}