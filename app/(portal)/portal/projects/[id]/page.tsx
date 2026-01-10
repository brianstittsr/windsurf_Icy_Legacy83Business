"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Building,
  Clock,
  Users,
  FolderKanban,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  organizationName: string;
  status: string;
  progress: number;
  startDate: Date | null;
  endDate: Date | null;
  teamIds: string[];
  milestonesCompleted: number;
  milestonesTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "at-risk":
      return <Badge className="bg-orange-100 text-orange-800">At Risk</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    case "on-hold":
      return <Badge className="bg-gray-100 text-gray-800">On Hold</Badge>;
    case "planning":
      return <Badge className="bg-purple-100 text-purple-800">Planning</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "Not set";
  return date.toLocaleDateString("en-US", { 
    year: "numeric",
    month: "long", 
    day: "numeric" 
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!db || !projectId) return;
      
      try {
        const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (projectSnap.exists()) {
          const data = projectSnap.data();
          setProject({
            id: projectSnap.id,
            name: data.name || "Untitled Project",
            description: data.description || "",
            organizationName: data.organizationName || data.client || "",
            status: data.status || "active",
            progress: data.progress || 0,
            startDate: data.startDate instanceof Timestamp 
              ? data.startDate.toDate() 
              : data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate instanceof Timestamp 
              ? data.endDate.toDate() 
              : data.endDate ? new Date(data.endDate) : null,
            teamIds: data.teamIds || [],
            milestonesCompleted: data.milestonesCompleted || 0,
            milestonesTotal: data.milestonesTotal || 0,
            createdAt: data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp 
              ? data.updatedAt.toDate() 
              : new Date(),
          });
        } else {
          toast.error("Project not found");
          router.push("/portal/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProject();
  }, [projectId, router]);

  const handleDelete = async () => {
    if (!db || !projectId) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, projectId));
      toast.success("Project deleted successfully");
      router.push("/portal/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button asChild>
          <Link href="/portal/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-muted-foreground">
              {project.organizationName || "No client assigned"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/portal/projects/${projectId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Milestones</p>
                    <p className="font-medium">
                      {project.milestonesCompleted} / {project.milestonesTotal} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="font-medium">{project.teamIds.length} assigned</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {project.description ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Team members assigned to this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.teamIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.teamIds.map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          T{i + 1}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Team Member {i + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No team members assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.organizationName || "Not assigned"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Target End Date</p>
                  <p className="font-medium">{formatDate(project.endDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(project.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/portal/projects/${projectId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
