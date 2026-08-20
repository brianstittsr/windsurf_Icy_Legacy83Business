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
import { Search, RefreshCw, Eye, Loader2, Megaphone, Plug } from "lucide-react";

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
  campaignIds?: string[];
  lastSyncedAt?: string;
}

interface GHLCampaignOption {
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

  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<GHLCampaignOption[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [submittingCampaign, setSubmittingCampaign] = useState(false);

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

  const openCampaignDialog = async () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one contact first");
      return;
    }
    setCampaignDialogOpen(true);
    setLoadingCampaigns(true);
    try {
      const response = await fetch(`/api/gohighlevel/campaigns?integrationId=${selectedIntegrationId}`);
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
      } else {
        toast.error(data.error || "Failed to load campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleAddToCampaign = async () => {
    if (!selectedCampaignId) {
      toast.error("Select a campaign");
      return;
    }
    setSubmittingCampaign(true);
    try {
      const response = await fetch("/api/gohighlevel/contacts/add-to-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrationId: selectedIntegrationId,
          campaignId: selectedCampaignId,
          contactIds: Array.from(selectedIds),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Added ${data.summary?.succeeded ?? 0} contact(s) to campaign`);
        setCampaignDialogOpen(false);
        setSelectedCampaignId("");
        setSelectedIds(new Set());
        await fetchContacts(selectedIntegrationId);
      } else {
        toast.error(
          `Added ${data.summary?.succeeded ?? 0}, failed ${data.summary?.failed ?? 0}: ${data.results?.find((r: { error?: string }) => r.error)?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding contacts to campaign:", error);
      toast.error("Failed to add contacts to campaign");
    } finally {
      setSubmittingCampaign(false);
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
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="secondary" onClick={openCampaignDialog}>
              <Megaphone className="mr-2 h-4 w-4" />
              Add to Campaign ({selectedIds.size})
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
                  <TableHead>Campaigns</TableHead>
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
                      {(contact.campaignIds?.length || 0) > 0 ? contact.campaignIds?.length : "-"}
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

      <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Marketing Campaign</DialogTitle>
            <DialogDescription>
              Add {selectedIds.size} selected contact(s) to a GoHighLevel marketing campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {loadingCampaigns ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No campaigns found for this location. Create a campaign in GoHighLevel first.
              </p>
            ) : (
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id!}>
                      {c.name} {c.status ? `(${c.status})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampaignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToCampaign}
              disabled={submittingCampaign || !selectedCampaignId || campaigns.length === 0}
            >
              {submittingCampaign && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
