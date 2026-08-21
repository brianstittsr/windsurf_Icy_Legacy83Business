"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Tag,
  Calendar,
  Ban,
  Loader2,
  Workflow,
  RefreshCw,
  Info,
  ExternalLink,
} from "lucide-react";

interface GHLContactDetail {
  id: string;
  ghlContactId: string;
  integrationId: string;
  locationId: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  companyName?: string;
  website?: string;
  tags?: string[];
  source?: string;
  dnd?: boolean;
  dateOfBirth?: string;
  customFields?: Array<{ id: string; value: string }>;
  workflowIds?: string[];
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GHLWorkflowOption {
  id: string;
  name: string;
  status?: string;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function GhlContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<GHLContactDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [workflows, setWorkflows] = useState<GHLWorkflowOption[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
  const [submittingWorkflow, setSubmittingWorkflow] = useState(false);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gohighlevel/contacts/${id}`);
      const data = await response.json();
      if (data.success) {
        setContact(data.contact);
      } else {
        toast.error(data.error || "Contact not found");
      }
    } catch (error) {
      console.error("Error fetching GHL contact:", error);
      toast.error("Failed to load contact");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchContact();
  }, [id, fetchContact]);

  const openWorkflowDialog = async () => {
    if (!contact) return;
    setWorkflowDialogOpen(true);
    setLoadingWorkflows(true);
    try {
      const response = await fetch(`/api/gohighlevel/workflows?integrationId=${contact.integrationId}`);
      const data = await response.json();
      if (data.success) {
        setWorkflows(data.workflows || []);
      } else {
        toast.error(data.error || "Failed to load workflow automations");
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      toast.error("Failed to load workflow automations");
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const handleAddToWorkflow = async () => {
    if (!contact || !selectedWorkflowId) {
      toast.error("Select a workflow automation");
      return;
    }
    setSubmittingWorkflow(true);
    try {
      const response = await fetch("/api/gohighlevel/contacts/add-to-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrationId: contact.integrationId,
          workflowId: selectedWorkflowId,
          contactIds: [contact.id],
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Contact added to workflow");
        setWorkflowDialogOpen(false);
        setSelectedWorkflowId("");
        await fetchContact();
      } else {
        toast.error(data.results?.[0]?.error || "Failed to add contact to workflow");
      }
    } catch (error) {
      console.error("Error adding contact to workflow:", error);
      toast.error("Failed to add contact to workflow");
    } finally {
      setSubmittingWorkflow(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/portal/customers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <p className="text-muted-foreground">Contact not found.</p>
      </div>
    );
  }

  const displayName = contact.name || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed Contact";
  const address = [contact.address1, contact.city, contact.state, contact.postalCode, contact.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/portal/customers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchContact}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={openWorkflowDialog}>
            <Workflow className="mr-2 h-4 w-4" />
            Add to Workflow
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <CardDescription>{contact.companyName || "GoHighLevel Contact"}</CardDescription>
            </div>
            {contact.dnd && (
              <Badge variant="destructive">
                <Ban className="mr-1 h-3 w-3" />
                Do Not Disturb
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={contact.email} />
            <InfoRow icon={Phone} label="Phone" value={contact.phone} />
            <InfoRow icon={Building} label="Company" value={contact.companyName} />
            <InfoRow icon={Globe} label="Website" value={contact.website} />
            <InfoRow icon={MapPin} label="Address" value={address} />
            <InfoRow icon={Tag} label="Source" value={contact.source} />
            <InfoRow icon={Calendar} label="Date of Birth" value={contact.dateOfBirth} />
          </div>

          {(contact.tags?.length || 0) > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {contact.tags!.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {(contact.customFields?.length || 0) > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Custom Fields</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {contact.customFields!.map((field) => (
                    <div key={field.id} className="text-sm">
                      <span className="text-muted-foreground">{field.id}:</span>{" "}
                      <span className="font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(contact.workflowIds?.length || 0) > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Active Workflows</p>
                <div className="flex flex-wrap gap-2">
                  {contact.workflowIds!.map((workflowId) => (
                    <Badge key={workflowId} variant="secondary">
                      <Workflow className="mr-1 h-3 w-3" />
                      {workflowId}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">GHL Contact ID:</span> {contact.ghlContactId}
            </div>
            <div>
              <span className="font-medium">Location ID:</span> {contact.locationId}
            </div>
            <div>
              <span className="font-medium">Last Synced:</span>{" "}
              {contact.lastSyncedAt ? new Date(contact.lastSyncedAt).toLocaleString() : "-"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Workflow Automation</DialogTitle>
            <DialogDescription>
              Add {displayName} to a GoHighLevel workflow automation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {loadingWorkflows ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No workflow automations found for this location. Create one in GoHighLevel, then reopen this dialog.
                </p>
                <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-2">
                  <p className="font-medium flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    How to create a workflow automation in GoHighLevel
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Log in to your GoHighLevel account for this sub-account/location.</li>
                    <li>In the left sidebar, go to <strong>Automation → Workflows</strong>.</li>
                    <li>Click <strong>+ Create Workflow</strong>, give it a name, and choose a trigger (e.g. &quot;Manual&quot;, &quot;Contact Tag&quot;).</li>
                    <li>Add your action steps (email, SMS, tags, etc.).</li>
                    <li>Click <strong>Publish</strong> to activate it.</li>
                    <li>Come back here and reopen &quot;Add to Workflow&quot; — it will appear in the list.</li>
                  </ol>
                  <a
                    href="https://app.gohighlevel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                  >
                    Open GoHighLevel <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((w) => (
                    <SelectItem key={w.id} value={w.id!}>
                      {w.name} {w.status ? `(${w.status})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToWorkflow}
              disabled={submittingWorkflow || !selectedWorkflowId || workflows.length === 0}
            >
              {submittingWorkflow && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
