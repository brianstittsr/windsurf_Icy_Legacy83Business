"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
  Calendar,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs, query, orderBy } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

interface ProjectForm {
  name: string;
  description: string;
  organizationName: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: string;
  milestonesCompleted: string;
  milestonesTotal: string;
}

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "at-risk", label: "At Risk" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    organizationName: "",
    status: "active",
    startDate: "",
    endDate: "",
    progress: "0",
    milestonesCompleted: "0",
    milestonesTotal: "0",
  });

  useEffect(() => {
    async function fetchData() {
      if (!db || !projectId) return;
      
      try {
        // Fetch project
        const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (projectSnap.exists()) {
          const data = projectSnap.data();
          
          const startDate = data.startDate instanceof Timestamp 
            ? data.startDate.toDate().toISOString().split("T")[0]
            : data.startDate || "";
          const endDate = data.endDate instanceof Timestamp 
            ? data.endDate.toDate().toISOString().split("T")[0]
            : data.endDate || "";
          
          setForm({
            name: data.name || "",
            description: data.description || "",
            organizationName: data.organizationName || data.client || "",
            status: data.status || "active",
            startDate,
            endDate,
            progress: String(data.progress || 0),
            milestonesCompleted: String(data.milestonesCompleted || 0),
            milestonesTotal: String(data.milestonesTotal || 0),
          });
        } else {
          toast.error("Project not found");
          router.push("/portal/projects");
          return;
        }

        // Fetch organizations for autocomplete
        const orgsRef = collection(db, COLLECTIONS.ORGANIZATIONS);
        const orgsQuery = query(orgsRef, orderBy("name"));
        const orgsSnapshot = await getDocs(orgsQuery);
        const orgList = orgsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unnamed Organization",
        }));
        setOrganizations(orgList);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [projectId, router]);

  const updateField = (field: keyof ProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    if (!db || !projectId) {
      toast.error("Database not initialized");
      return;
    }

    setIsSaving(true);
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      
      const updateData: Record<string, any> = {
        name: form.name,
        description: form.description,
        organizationName: form.organizationName,
        status: form.status,
        progress: parseInt(form.progress) || 0,
        milestonesCompleted: parseInt(form.milestonesCompleted) || 0,
        milestonesTotal: parseInt(form.milestonesTotal) || 0,
        updatedAt: Timestamp.now(),
      };

      if (form.startDate) {
        updateData.startDate = Timestamp.fromDate(new Date(form.startDate));
      }
      if (form.endDate) {
        updateData.endDate = Timestamp.fromDate(new Date(form.endDate));
      }

      await updateDoc(projectRef, updateData);
      toast.success("Project updated successfully");
      router.push(`/portal/projects/${projectId}`);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/portal/projects/${projectId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
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
                Timeline & Progress
              </CardTitle>
              <CardDescription>Project schedule and completion status</CardDescription>
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
                <Label htmlFor="progress">Progress (%)</Label>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="milestonesCompleted">Milestones Completed</Label>
                  <Input
                    id="milestonesCompleted"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.milestonesCompleted}
                    onChange={(e) => updateField("milestonesCompleted", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestonesTotal">Total Milestones</Label>
                  <Input
                    id="milestonesTotal"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.milestonesTotal}
                    onChange={(e) => updateField("milestonesTotal", e.target.value)}
                  />
                </div>
              </div>
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
                Save Changes
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/portal/projects/${projectId}`}>Cancel</Link>
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
                <span className="font-medium capitalize">{form.status.replace("-", " ")}</span>
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
                  {form.milestonesCompleted || 0} / {form.milestonesTotal || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
