"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  FolderKanban,
  Building,
  Calendar,
  Users,
  Loader2,
  Plus,
  X,
  Flag,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, getDocs, query, orderBy } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

interface ProjectForm {
  name: string;
  description: string;
  organizationName: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: string;
}

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    organizationName: "",
    status: "planning",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    progress: "0",
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({ name: "", dueDate: "" });

  const addMilestone = () => {
    if (!newMilestone.name.trim()) {
      toast.error("Please enter a milestone name");
      return;
    }
    const milestone: Milestone = {
      id: crypto.randomUUID(),
      name: newMilestone.name.trim(),
      dueDate: newMilestone.dueDate,
      completed: false,
    };
    setMilestones((prev) => [...prev, milestone]);
    setNewMilestone({ name: "", dueDate: "" });
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMilestoneComplete = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  useEffect(() => {
    async function fetchOrganizations() {
      if (!db) return;
      try {
        const orgsRef = collection(db, COLLECTIONS.ORGANIZATIONS);
        const orgsQuery = query(orgsRef, orderBy("name"));
        const snapshot = await getDocs(orgsQuery);
        const orgList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unnamed Organization",
        }));
        setOrganizations(orgList);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    }
    fetchOrganizations();
  }, []);

  const updateField = (field: keyof ProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    if (!db) {
      toast.error("Database not initialized");
      return;
    }

    setIsSaving(true);
    try {
      const completedMilestones = milestones.filter((m) => m.completed).length;
      const projectData = {
        name: form.name,
        description: form.description,
        organizationName: form.organizationName,
        status: form.status,
        startDate: form.startDate ? Timestamp.fromDate(new Date(form.startDate)) : Timestamp.now(),
        endDate: form.endDate ? Timestamp.fromDate(new Date(form.endDate)) : null,
        progress: parseInt(form.progress) || 0,
        teamIds: [],
        milestones: milestones.map((m) => ({
          id: m.id,
          name: m.name,
          dueDate: m.dueDate ? Timestamp.fromDate(new Date(m.dueDate)) : null,
          completed: m.completed,
        })),
        milestonesCompleted: completedMilestones,
        milestonesTotal: milestones.length,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.PROJECTS), projectData);
      toast.success("Project created successfully");
      router.push("/portal/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/portal/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-muted-foreground">Create a new client project</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Project Details
              </CardTitle>
              <CardDescription>Basic information about the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., ISO Implementation for ABC Corp"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project scope and objectives..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organization">Client / Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Enter client name"
                    value={form.organizationName}
                    onChange={(e) => updateField("organizationName", e.target.value)}
                    list="organizations"
                  />
                  <datalist id="organizations">
                    {organizations.map((org) => (
                      <option key={org.id} value={org.name} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
              <CardDescription>Project schedule and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Target End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Initial Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={form.progress}
                  onChange={(e) => updateField("progress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Milestones
              </CardTitle>
              <CardDescription>Add key milestones and deliverables for this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Milestones */}
              {milestones.length > 0 && (
                <div className="space-y-2">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg group"
                    >
                      <Checkbox
                        checked={milestone.completed}
                        onCheckedChange={() => toggleMilestoneComplete(milestone.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                          {milestone.name}
                        </p>
                        {milestone.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => removeMilestone(milestone.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Milestone */}
              <div className="flex flex-col gap-3 p-4 border border-dashed rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Add New Milestone</div>
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <Input
                    placeholder="Milestone name..."
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone((prev) => ({ ...prev, name: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addMilestone();
                      }
                    }}
                  />
                  <Input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-auto"
                  />
                  <Button type="button" onClick={addMilestone} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {milestones.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No milestones added yet. Add milestones to track project progress.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Create Project
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/portal/projects">Cancel</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{form.status}</span>
              </div>
              {form.startDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {new Date(form.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {form.endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {new Date(form.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{form.progress || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Milestones</span>
                <span className="font-medium">
                  {milestones.filter((m) => m.completed).length}/{milestones.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
