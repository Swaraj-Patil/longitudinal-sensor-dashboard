import { Settings2, Info, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface FiltersSidebarProps {
  filters: {
    showActivity: boolean;
    showPhoneUsage: boolean;
    showSleep: boolean;
    showAnomalies: boolean;
    activityThreshold: number[];
    phoneUsageThreshold: number[];
  };
  onFiltersChange: (filters: any) => void;
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="w-80 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="size-5" />
            Filters & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Sources Toggle */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground">Data Sources</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="activity-toggle" className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                Activity Level
              </Label>
              <Switch
                id="activity-toggle"
                checked={filters.showActivity}
                onCheckedChange={(checked) => updateFilter('showActivity', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="phone-toggle" className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                Phone Usage
              </Label>
              <Switch
                id="phone-toggle"
                checked={filters.showPhoneUsage}
                onCheckedChange={(checked) => updateFilter('showPhoneUsage', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sleep-toggle" className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                Sleep Proxy
              </Label>
              <Switch
                id="sleep-toggle"
                checked={filters.showSleep}
                onCheckedChange={(checked) => updateFilter('showSleep', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="anomaly-toggle" className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                Anomaly Highlights
              </Label>
              <Switch
                id="anomaly-toggle"
                checked={filters.showAnomalies}
                onCheckedChange={(checked) => updateFilter('showAnomalies', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Thresholds */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground">Thresholds</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Activity Level (0-10)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum activity level to consider as "active"</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={filters.activityThreshold}
                onValueChange={(value) => updateFilter('activityThreshold', value)}
                max={10}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Threshold: {filters.activityThreshold[0].toFixed(1)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Phone Usage (hours)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Daily phone usage threshold for anomaly detection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={filters.phoneUsageThreshold}
                onValueChange={(value) => updateFilter('phoneUsageThreshold', value)}
                max={8}
                min={0}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Threshold: {filters.phoneUsageThreshold[0]}h
              </p>
            </div>
          </div>

          <Separator />

          {/* Legend */}
          <div className="space-y-3">
            <h4 className="text-sm text-muted-foreground">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                <span>Activity Level (0-10 scale)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                <span>Phone Usage (minutes)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                <span>Sleep Hours (estimated)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive"></div>
                <span>Anomaly Day</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="size-5" />
            Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <h4 className="text-foreground mb-1">Sleep Proxy</h4>
            <p>Estimated sleep hours based on low activity periods, typically between 10 PM and 8 AM.</p>
          </div>
          <div>
            <h4 className="text-foreground mb-1">Anomaly Detection</h4>
            <p>Days with unusual patterns in activity, phone usage, or sleep that deviate significantly from baseline.</p>
          </div>
          <div>
            <h4 className="text-foreground mb-1">Data Quality</h4>
            <p>Percentage of expected data points received for each day.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}