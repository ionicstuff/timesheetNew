"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApproveInvoice, useInvoices, useSendInvoice } from "@/hooks/useFinance";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Download, Mail, CheckCircle2, Search, MoreHorizontal, Eye } from "lucide-react";
import { getInvoicePdfUrl } from "@/services/finance";

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    generated: "bg-gray-100 text-gray-800",
    approved: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800",
  };
  return (
    <Badge className={map[status] || "bg-gray-100 text-gray-800"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const InvoiceList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: invoices, isLoading, isError } = useInvoices(statusFilter || undefined);
  const { mutateAsync: approve, isPending: approving } = useApproveInvoice();
  const { mutateAsync: send, isPending: sending } = useSendInvoice();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (invoices || []).filter((inv) => {
      if (!term) return true;
      return (
        inv.invoiceNumber?.toLowerCase().includes(term) ||
        inv.projectName?.toLowerCase().includes(term) ||
        inv.clientName?.toLowerCase().includes(term)
      );
    });
  }, [search, invoices]);

  const doApprove = async (id: number) => {
    try {
      await approve(id);
      toast({ title: "Approved", description: `Invoice ${id} approved.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to approve", variant: "destructive" });
    }
  };

  const doSend = async (id: number) => {
    try {
      await send(id);
      toast({ title: "Sent", description: `Invoice ${id} sent to client (if SMTP configured).` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to send", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 text-sm text-muted-foreground">Loading invoices…</div>
    );
  }
  if (isError) {
    return (
      <div className="border rounded-lg p-4 text-sm text-red-600">Failed to load invoices.</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice #, project or client…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="generated">Generated</option>
          <option value="approved">Approved</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-3 border-b text-sm font-medium">
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y">
          {filtered.map((inv) => (
            <div key={inv.id} className="grid grid-cols-12 gap-4 p-3 items-center">
              <div className="col-span-2">
                <button
                  className="text-left text-blue-600 hover:underline"
                  onClick={() => navigate(`/billings/${inv.id}`)}
                  title="View invoice"
                >
                  {inv.invoiceNumber || `INV-${inv.id}`}
                </button>
                <div className="text-xs text-muted-foreground">
                  Issued {new Date(inv.issueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="col-span-3">
                <div className="font-medium">{inv.projectName || `#${inv.projectId}`}</div>
                <div className="text-xs text-muted-foreground">Due {new Date(inv.dueDate).toLocaleDateString()}</div>
              </div>
              <div className="col-span-2">{Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency || 'USD' }).format(inv.total || 0)}</div>
              <div className="col-span-2">
                <StatusBadge status={inv.status} />
              </div>
              <div className="col-span-1 flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" title="View" onClick={() => navigate(`/billings/${inv.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <a href={getInvoicePdfUrl(inv.id)} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" title="Download PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button 
                  variant="ghost" size="icon" 
                  title={inv.status === 'sent' ? 'Already sent' : 'Approve'}
                  onClick={() => doApprove(inv.id)}
                  disabled={inv.status === 'sent' || approving}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" size="icon" 
                  title="Send"
                  onClick={() => doSend(inv.id)}
                  disabled={sending}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No invoices found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;