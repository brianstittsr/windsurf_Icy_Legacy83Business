"use client";

import { useState } from "react";
import { BuiltInCalendar, type CalendarEventData } from "@/components/traction/built-in-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Plus,
  Mountain,
  ListTodo,
  Flag,
  Users,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

// Sample events for demonstration
const sampleEvents: CalendarEventData[] = [
  {
    id: "1",
    title: "Weekly L10 Meeting",
    description: "Weekly leadership team meeting",
    startDate: new Date(new Date().setHours(9, 0, 0, 0)),
    endDate: new Date(new Date().setHours(10, 30, 0, 0)),
    type: "meeting",
    color: "#3b82f6",
    attendees: ["Brian Stitt", "Sarah Chen", "Michael Rodriguez"],
    location: "Conference Room A",
  },
  {
    id: "2",
    title: "Q1 Rock: Launch New Website",
    description: "Complete website redesign and launch",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 31),
    allDay: true,
    type: "rock",
    color: "#8b5cf6",
  },
  {
    id: "3",
    title: "Review supplier contracts",
    description: "Review and update supplier agreements",
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: true,
    type: "todo",
    color: "#10b981",
  },
  {
    id: "4",
    title: "Client Presentation",
    description: "Present Q4 results to key client",
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: "meeting",
    color: "#3b82f6",
    attendees: ["Brian Stitt", "Client Team"],
  },
  {
    id: "5",
    title: "Issue: Server Performance",
    description: "Address server performance issues",
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: true,
    type: "issue",
    color: "#ef4444",
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEventData[]>(sampleEvents);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleEventCreate = (event: Omit<CalendarEventData, "id">) => {
    const newEvent: CalendarEventData = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleEventUpdate = (id: string, updates: Partial<CalendarEventData>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const handleEventDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const filteredEvents = filterType
    ? events.filter((e) => e.type === filterType)
    : events;

  // Stats
  const meetingCount = events.filter((e) => e.type === "meeting").length;
  const rockCount = events.filter((e) => e.type === "rock").length;
  const todoCount = events.filter((e) => e.type === "todo").length;
  const issueCount = events.filter((e) => e.type === "issue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendar
          </h1>
          <p className="text-muted-foreground">
            View and manage all your meetings, rocks, to-dos, and issues in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all ${filterType === "meeting" ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setFilterType(filterType === "meeting" ? null : "meeting")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Meetings</p>
                <p className="text-2xl font-bold text-blue-600">{meetingCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterType === "rock" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setFilterType(filterType === "rock" ? null : "rock")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rocks</p>
                <p className="text-2xl font-bold text-purple-600">{rockCount}</p>
              </div>
              <Mountain className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterType === "todo" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setFilterType(filterType === "todo" ? null : "todo")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To-Dos</p>
                <p className="text-2xl font-bold text-green-600">{todoCount}</p>
              </div>
              <ListTodo className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterType === "issue" ? "ring-2 ring-red-500" : ""}`}
          onClick={() => setFilterType(filterType === "issue" ? null : "issue")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-red-600">{issueCount}</p>
              </div>
              <Flag className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter indicator */}
      {filterType && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filtering by: {filterType}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => setFilterType(null)}>
            Clear filter
          </Button>
        </div>
      )}

      {/* Calendar */}
      <BuiltInCalendar
        events={filteredEvents}
        onEventCreate={handleEventCreate}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        showHeader={true}
        defaultView={view}
        className="min-h-[600px]"
      />

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">Rocks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">To-Dos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-sm">Custom Events</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
