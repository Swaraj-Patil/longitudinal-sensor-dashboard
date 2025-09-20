import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface DailySummaryTableProps {
  hasData: boolean;
  onDayClick: (date: string) => void;
}

export function DailySummaryTable({ hasData, onDayClick }: DailySummaryTableProps) {
  const dailyData = hasData ? [
    {
      date: "Mon, Sep 16",
      dateKey: "2024-09-16",
      activity: "6.2/10",
      activityMinutes: "4h 32m",
      phoneUsage: "3h 0m",
      sleepHours: "7h 30m",
      isAnomaly: false,
      dataQuality: "98%"
    },
    {
      date: "Tue, Sep 17",
      dateKey: "2024-09-17", 
      activity: "8.1/10",
      activityMinutes: "5h 45m",
      phoneUsage: "4h 5m",
      sleepHours: "6h 48m",
      isAnomaly: true,
      dataQuality: "94%"
    },
    {
      date: "Wed, Sep 18",
      dateKey: "2024-09-18",
      activity: "7.3/10", 
      activityMinutes: "4h 18m",
      phoneUsage: "3h 18m",
      sleepHours: "8h 12m",
      isAnomaly: false,
      dataQuality: "96%"
    },
    {
      date: "Thu, Sep 19",
      dateKey: "2024-09-19",
      activity: "5.8/10",
      activityMinutes: "3h 22m", 
      phoneUsage: "5h 12m",
      sleepHours: "6h 12m",
      isAnomaly: true,
      dataQuality: "89%"
    },
    {
      date: "Fri, Sep 20",
      dateKey: "2024-09-20",
      activity: "9.1/10",
      activityMinutes: "6h 15m",
      phoneUsage: "2h 36m", 
      sleepHours: "7h 54m",
      isAnomaly: false,
      dataQuality: "97%"
    },
    {
      date: "Sat, Sep 21", 
      dateKey: "2024-09-21",
      activity: "7.8/10",
      activityMinutes: "5h 8m",
      phoneUsage: "3h 23m",
      sleepHours: "8h 30m",
      isAnomaly: false,
      dataQuality: "95%"
    },
    {
      date: "Sun, Sep 22",
      dateKey: "2024-09-22",
      activity: "6.9/10",
      activityMinutes: "4h 42m", 
      phoneUsage: "2h 47m",
      sleepHours: "7h 42m",
      isAnomaly: false,
      dataQuality: "98%"
    }
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Activity Level</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Active Time</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Phone Usage</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Sleep Hours</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Data Quality</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((day, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      day.isAnomaly ? "bg-destructive/5" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {day.isAnomaly && (
                          <AlertTriangle className="size-4 text-destructive" />
                        )}
                        <span className="text-sm">{day.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm">{day.activity}</td>
                    <td className="py-4 px-2 text-sm">{day.activityMinutes}</td>
                    <td className="py-4 px-2 text-sm">{day.phoneUsage}</td>
                    <td className="py-4 px-2 text-sm">{day.sleepHours}</td>
                    <td className="py-4 px-2 text-sm">{day.dataQuality}</td>
                    <td className="py-4 px-2">
                      {day.isAnomaly ? (
                        <Badge variant="destructive" className="text-xs">
                          Anomaly
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Normal
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDayClick(day.dateKey)}
                        className="text-xs"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No daily summary data for selected period</p>
              <p className="text-sm mt-1">Select a participant and date range to view data</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}