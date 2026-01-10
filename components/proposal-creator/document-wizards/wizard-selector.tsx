"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Shield,
  FileQuestion,
  FileSignature,
  Handshake,
  Building2,
  Factory,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GrantWizard, type GrantData } from "./grant-wizard";
import { NDAWizard, type NDAData } from "./nda-wizard";
import { RFPResponseWizard, type RFPResponseData } from "./rfp-response-wizard";
import { ContractWizard, type ContractData } from "./contract-wizard";
import { AgreementWizard, type AgreementData } from "./agreement-wizard";
import { MOUWizard, type MOUData } from "./mou-wizard";
import { OEMSupplierWizard, type OEMSupplierData } from "./oem-supplier-wizard";

export type DocumentType = "grant" | "nda" | "rfp_response" | "contract" | "agreement" | "mou" | "oem_supplier_readiness";

export type WizardData = GrantData | NDAData | RFPResponseData | ContractData | AgreementData | MOUData | OEMSupplierData;

interface DocumentWizardSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (type: DocumentType, data: WizardData) => void;
}

const documentTypes = [
  {
    type: "grant" as DocumentType,
    title: "Grant Application",
    description: "Create a comprehensive grant proposal with objectives, methodology, budget, entities, milestones, and data collection plans.",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    type: "nda" as DocumentType,
    title: "Non-Disclosure Agreement",
    description: "Create an NDA to protect confidential information shared between parties.",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    type: "rfp_response" as DocumentType,
    title: "RFP Response",
    description: "Create a compelling response to a Request for Proposal with executive summary, approach, and pricing.",
    icon: FileQuestion,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    type: "contract" as DocumentType,
    title: "Contract",
    description: "Create a service or project contract with scope, deliverables, payment terms, and legal provisions.",
    icon: FileSignature,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    type: "agreement" as DocumentType,
    title: "Agreement",
    description: "Create a general agreement between parties with terms, responsibilities, and dispute resolution.",
    icon: Handshake,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    type: "mou" as DocumentType,
    title: "Memorandum of Understanding",
    description: "Create an MOU to formalize a partnership with shared objectives, commitments, and governance.",
    icon: Building2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    type: "oem_supplier_readiness" as DocumentType,
    title: "OEM Supplier Readiness",
    description: "Assess supplier readiness with capabilities, quality systems, compliance, and supply chain management.",
    icon: Factory,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export function DocumentWizardSelector({ open, onOpenChange, onComplete }: DocumentWizardSelectorProps) {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const handleComplete = (data: WizardData) => {
    if (selectedType) {
      onComplete(selectedType, data);
      setSelectedType(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
  };

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-[95vw] !w-[1200px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {!selectedType ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Create New Document
              </DialogTitle>
              <DialogDescription>
                Select a document type to start the AI-enhanced wizard
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <Card
                      key={doc.type}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                        "group"
                      )}
                      onClick={() => setSelectedType(doc.type)}
                    >
                      <CardHeader className="pb-2">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", doc.bgColor)}>
                          <Icon className={cn("h-5 w-5", doc.color)} />
                        </div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {doc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">
                          {doc.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="flex justify-end px-6 py-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[85vh]">
            {selectedType === "grant" && (
              <GrantWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "nda" && (
              <NDAWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "rfp_response" && (
              <RFPResponseWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "contract" && (
              <ContractWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "agreement" && (
              <AgreementWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "mou" && (
              <MOUWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
            {selectedType === "oem_supplier_readiness" && (
              <OEMSupplierWizard onComplete={handleComplete} onCancel={handleCancel} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
