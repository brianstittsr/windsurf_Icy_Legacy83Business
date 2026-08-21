"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Search, RefreshCw, Eye, Loader2, Workflow, Plug, Info, ExternalLink, Tags } from "lucide-react";

interface GHLIntegrationOption {
  id: string;
  name: string;
  isActive: boolean;
}

interface GHLContactRow {
  id: string;
  ghlContactId: string;
  integrationId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  tags?: string[];
  source?: string;
  workflowIds?: string[];
  lastSyncedAt?: string;
}

interface GHLWorkflowOption {
  id: string;
  name: string;
  status?: string;
}

export function GhlContactsTab() {
  const [integrations, setIntegrations] = useState<GHLIntegrationOption[]>([]);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");
  const [contacts, setContacts] = useState<GHLContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [tagFilter, setTagFilter] = useState<string>("");

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [workflows, setWorkflows] = useState<GHLWorkflowOption[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
  const [submittingWorkflow, setSubmittingWorkflow] = useState(false);

  const fetchIntegrations = useCallback(async () => {
    try {
      const response = await fetch("/api/gohighlevel/integrations");
      const data = await response.json();
      if (data.success) {
        const list: GHLIntegrationOption[] = (data.integrations || []).map(
          (i: GHLIntegrationOption) => ({ id: i.id, name: i.name, isActive: i.isActive })
        );
        setIntegrations(list);
        if (list.length > 0 && !selectedIntegrationId) {
          const active = list.find((i) => i.isActive) || list[0];
          setSelectedIntegrationId(active.id);
        }
      }
    } catch (error) {
      console.error("Error fetching GHL integrations:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = useCallback(async (integrationId: string) => {
    if (!integrationId) {
      setContacts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/gohighlevel/contacts?integrationId=${integrationId}`);
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error("Error fetching GHL contacts:", error);
      toast.error("Failed to load GHL contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  useEffect(() => {
    if (selectedIntegrationId) {
      fetchContacts(selectedIntegrationId);
      setSelectedIds(new Set());
    }
  }, [selectedIntegrationId, fetchContacts]);

  const handleSync = async () => {
    if (!selectedIntegrationId) return;
    setSyncing(true);
    try {
      const response = await fetch(`/api/gohighlevel/sync/${selectedIntegrationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncType: "contacts" }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Synced ${data.summary?.contactsUpdated ?? 0} contacts from GoHighLevel`);
        await fetchContacts(selectedIntegrationId);
      } else {
        toast.error(data.error || "Contacts sync failed");
      }
    } catch (error) {
      console.error("Error syncing GHL contacts:", error);
      toast.error("Contacts sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.companyName || "").toLowerCase().includes(q)
    );
  });

  const allSelected = filteredContacts.length > 0 && filteredContacts.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // All distinct tags across the currently synced contacts, for quick "select by tag"
  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags || []))).sort();

  const selectByTag = (tag: string) => {
    setTagFilter(tag);
    if (!tag) return;
    const matchingIds = contacts.filter((c) => (c.tags || []).includes(tag)).map((c) => c.id);
    setSelectedIds(new Set(matchingIds));
  };

  const openWorkflowDialog = async () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one contact or tag first");
      return;
    }
    setWorkflowDialogOpen(true);
    setLoadingWorkflows(true);
    try {
      const response = await fetch(`/api/gohighlevel/workflows?integrationId=${selectedIntegrationId}`);
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
    if (!selectedWorkflowId) {
      toast.error("Select a workflow automation");
      return;
    }
    setSubmittingWorkflow(true);
    try {
      const response = await fetch("/api/gohighlevel/contacts/add-to-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrationId: selectedIntegrationId,
          workflowId: selectedWorkflowId,
          contactIds: Array.from(selectedIds),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Added ${data.summary?.succeeded ?? 0} contact(s) to workflow`);
        setWorkflowDialogOpen(false);
        setSelectedWorkflowId("");
        setSelectedIds(new Set());
        await fetchContacts(selectedIntegrationId);
      } else {
        toast.error(
          `Added ${data.summary?.succeeded ?? 0}, failed ${data.summary?.failed ?? 0}: ${data.results?.find((r: { error?: string }) => r.error)?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding contacts to workflow:", error);
      toast.error("Failed to add contacts to workflow");
    } finally {
      setSubmittingWorkflow(false);
    }
  };

  if (integrations.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Plug className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-1">No GoHighLevel integration configured yet.</p>
          <Link href="/portal/gohighlevel" className="text-primary hover:underline text-sm">
            Set up a GoHighLevel integration
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Total GHL Contacts</h3>
        <Badge variant="secondary">{contacts.length}</Badge>
        {searchQuery && (
          <span className="text-xs text-muted-foreground">
            ({filteredContacts.length} matching &quot;{searchQuery}&quot;)
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {integrations.length > 1 && (
            <Select value={selectedIntegrationId} onValueChange={setSelectedIntegrationId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select integration" />
              </SelectTrigger>
              <SelectContent>
                {integrations.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search GHL contacts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {allTags.length > 0 && (
            <Select value={tagFilter} onValueChange={selectByTag}>
              <SelectTrigger className="w-[180px]">
                <Tags className="mr-1 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select by tag" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="secondary" onClick={openWorkflowDialog}>
              <Workflow className="mr-2 h-4 w-4" />
              Add to Workflow ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" onClick={handleSync} disabled={syncing || !selectedIntegrationId}>
            {syncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync Contacts
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Workflows</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No GHL contacts found. Click &quot;Sync Contacts&quot; to pull contacts from GoHighLevel.
                    </TableCell>
                  </TableRow>
                )}
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleOne(contact.id)}
                        aria-label={`Select ${contact.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/portal/customers/ghl/${contact.id}`}
                        className="font-medium hover:underline"
                      >
                        {contact.name || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contact.email || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contact.phone || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contact.companyName || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags || []).slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(contact.tags?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(contact.tags?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(contact.workflowIds?.length || 0) > 0 ? contact.workflowIds?.length : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/portal/customers/ghl/${contact.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Workflow Automation</DialogTitle>
            <DialogDescription>
              Add {selectedIds.size} selected contact(s) to a GoHighLevel workflow automation.
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
