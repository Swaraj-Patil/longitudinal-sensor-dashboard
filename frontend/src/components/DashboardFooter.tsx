import { Clock, HelpCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function DashboardFooter() {
  const lastUpdated = new Date().toLocaleString();

  return (
    <footer className="bg-card border-t border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>Longitudinal Sensor Dashboard v1.2.0</span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <HelpCircle className="size-4 mr-2" />
                Help
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Dashboard Help & Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2">Data Sources</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Activity Level:</strong> Measured on a 0-10 scale based on accelerometer and gyroscope data</li>
                    <li><strong>Phone Usage:</strong> Screen time and app interaction data collected passively</li>
                    <li><strong>Sleep Proxy:</strong> Estimated sleep periods based on low activity and phone usage patterns</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="mb-2">Anomaly Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Anomalies are automatically detected using statistical methods that identify days with significant deviations from the participant's baseline patterns across multiple data sources.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2">Data Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    All data is anonymized and aggregated. Individual events or specific app usage is not stored or displayed. Data retention follows institutional guidelines.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2">Technical Support</h4>
                  <p className="text-sm text-muted-foreground">
                    For technical issues or questions about data interpretation, contact the research team at sensor-support@institution.edu
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Info className="size-4 mr-2" />
                About
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Sensor Dashboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Longitudinal Sensor Dashboard is designed to help clinicians and researchers visualize passive sensing data collected from study participants over time.
                </p>
                
                <div className="space-y-2">
                  <h4>Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Multi-source timeline visualization</li>
                    <li>Automated anomaly detection</li>
                    <li>Daily summary analytics</li>
                    <li>Configurable filters and thresholds</li>
                    <li>Data quality monitoring</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                  Version 1.2.0 • Built for longitudinal health monitoring research
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}