"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceStatusChart from "@/components/billings/InvoiceStatusChart";
import RevenueChart from "@/components/billings/RevenueChart";
import ReadyToInvoice from "@/components/billings/ReadyToInvoice";
import InvoiceList from "@/components/billings/InvoiceList";
import { useInvoices } from "@/hooks/useFinance";
import { useMe } from "@/hooks/useMe";

const Billings = () => {
// Resolve current user's role to gate Finance features
  const { data: me, isLoading: loadingMe } = useMe();
  const u = (me?.user || me) as any;
  const roleName = String(u?.role || u?.roleName || u?.role_master?.roleName || u?.roleMaster?.roleName || '').toLowerCase();
  const roleCode = String(u?.roleCode || u?.role_master?.roleCode || u?.roleMaster?.roleCode || '').toUpperCase();
  const isFinance = roleName === 'finance' || ['FIN','FINANCE'].includes(roleCode);

  // Load invoices only if Finance
  const { data: invoices } = useInvoices(undefined, { enabled: isFinance });

  const totalInvoiced = isFinance ? (invoices || []).reduce((sum, inv) => sum + (inv.total || 0), 0) : 0;
  const totalSent = isFinance ? (invoices || []).filter(i => i.status === 'sent').reduce((s, i) => s + (i.total || 0), 0) : 0;
  const totalPending = totalInvoiced - totalSent;
  const paidPercentage = totalInvoiced > 0 ? Math.round((totalSent / totalInvoiced) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billings</h1>
          <p className="text-muted-foreground">Generate, approve, and send invoices</p>
        </div>
        <Button disabled title="Invoices are generated from closed projects">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

{/* Ready projects panel (Finance only) */}
      {isFinance && <ReadyToInvoice />}

      {/* Simple charts (still static for now) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <InvoiceStatusChart />
        <RevenueChart />
      </div>

{/* Invoices list (Finance only) */}
      {isFinance ? (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Browse and manage invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceList />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>Only Finance users can view and manage invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You do not have permission to access this section.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Billings;
