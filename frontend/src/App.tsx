import { useEffect, useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { SummaryCards } from "./components/SummaryCards";
import { TimelineChart } from "./components/TimelineChart";
import { DailySummaryTable } from "./components/DailySummaryTable";
import { FiltersSidebar } from "./components/FiltersSidebar";
import { DashboardFooter } from "./components/DashboardFooter";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { getParticipants } from "./api";

export interface Participant {
  id: number,
  subject_id: string,
}

export default function App() {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant>({id: 0, subject_id: ''});
  const [selectedDateRange, setSelectedDateRange] = useState("7d");
  const [showFilters, setShowFilters] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const [filters, setFilters] = useState({
    showActivity: true,
    showPhoneUsage: true,
    showSleep: true,
    showAnomalies: true,
    activityThreshold: [5.0],
    phoneUsageThreshold: [4.0]
  });

  // Determine if we have data based on selections
  const hasData = selectedParticipant.id !== 0 && selectedDateRange !== "";

  const handleRefresh = () => {
    toast.success("Dashboard refreshed successfully");
  };

  const handleDayClick = (date: string) => {
    toast.info(`Viewing detailed data for ${date}`);
    // In a real app, this would open a modal or navigate to a detail view
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    async function load() {
      try {
        const list = await getParticipants()
        setParticipants(list?.data)
        setSelectedParticipant(list?.data[0] || {id: 0, subject_id: ''})
      } catch (e: unknown) {
        console.error(e)
        if (e instanceof Error) {
          setError(e.message || 'Failed');
        } else {
          setError('Failed');
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader
        participants={participants}
        selectedParticipant={selectedParticipant}
        setSelectedParticipant={setSelectedParticipant}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        onRefresh={handleRefresh}
      />

      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <SummaryCards hasData={hasData} />

          {/* Main Content Area */}
          <div className="flex gap-6">
            {/* Charts and Table */}
            <div className="flex-1 space-y-6">
              <TimelineChart hasData={hasData} />
              <DailySummaryTable hasData={hasData} onDayClick={handleDayClick} />
            </div>

            {/* Filters Sidebar */}
            {showFilters && (
              <FiltersSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
      <Toaster />
    </div>
  );
}