import { Calendar, RefreshCw, User } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { getParticipants } from "../api";
import { Participant } from "../App";

interface DashboardHeaderProps {
  participants: Participant[];
  selectedParticipant: Participant;
  setSelectedParticipant: (value: Participant) => void;
  selectedDateRange: string;
  setSelectedDateRange: (value: string) => void;
  onRefresh: () => void;
}

export function DashboardHeader({
  participants,
  selectedParticipant,
  setSelectedParticipant,
  selectedDateRange,
  setSelectedDateRange,
  onRefresh
}: DashboardHeaderProps) {
  // const participants = [
  //   "P001 - John Smith",
  //   "P002 - Sarah Johnson", 
  //   "P003 - Michael Brown",
  //   "P004 - Emily Davis",
  //   "P005 - Robert Wilson"
  // ];

  const dateRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "custom", label: "Custom range" }
  ];



  return (
    <header className="bg-card border-b border-border px-6 py-4 bg-red-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl text-foreground">Longitudinal Sensor Dashboard</h1>

          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {participants?.map((participant) => (
                  <SelectItem key={participant.id} value={participant}>
                    {participant.subject_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
    </header>
  );
}