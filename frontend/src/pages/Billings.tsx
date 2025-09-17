"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceSummary from "@/components/billings/InvoiceSummary";
import InvoiceTable from "@/components/billings/InvoiceTable";
import InvoiceStatusChart from "@/components/billings/InvoiceStatusChart";
import PaymentReminder from "@/components/billings/PaymentReminder";
import RevenueChart from "@/components/billings/RevenueChart";
import ClientPaymentHistory from "@/components/billings/ClientPaymentHistory";

const Billings = () => {
  const [invoices, setInvoices] = useState([
    { 
      id: 1, 
      project: "Website Redesign", 
      client: "Acme Corporation", 
      amount: 25000,
      status: "paid",
      invoiceDate: "2023-10-15",
      dueDate: "2023-11-15",
      paymentDate: "2023-11-10",
      tasksCompleted: 12,
      totalTasks: 12,
      projectProgress: 100
    },
    { 
      id: 2, 
      project: "Product Launch", 
      client: "Globex Inc", 
      amount: 45000,
      status: "pending",
      invoiceDate: "2023-11-01",
      dueDate: "2023-12-01",
      paymentDate: null,
      tasksCompleted: 18,
      totalTasks: 20,
      projectProgress: 90
    },
    { 
      id: 3, 
      project: "Marketing Campaign", 
      client: "Wayne Enterprises", 
      amount: 15000,
      status: "overdue",
      invoiceDate: "2023-09-01",
      dueDate: "2023-10-01",
      paymentDate: null,
      tasksCompleted: 8,
      totalTasks: 8,
      projectProgress: 100
    },
    { 
      id: 4, 
      project: "Mobile App Development", 
      client: "Stark Industries", 
      amount: 75000,
      status: "draft",
      invoiceDate: null,
      dueDate: null,
      paymentDate: null,
      tasksCompleted: 5,
      totalTasks: 25,
      projectProgress: 20
    },
    { 
      id: 5, 
      project: "E-commerce Platform", 
      client: "Parker Industries", 
      amount: 60000,
      status: "sent",
      invoiceDate: "2023-11-10",
      dueDate: "2023-12-10",
      paymentDate: null,
      tasksCompleted: 15,
      totalTasks: 15,
      projectProgress: 100
    },
  ]);

  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter(invoice => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalOutstanding = invoices
    .filter(invoice => invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "sent")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices
    .filter(invoice => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidPercentage = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  const overdueInvoices = invoices.filter(invoice => invoice.status === "overdue").length;

  const handleSearch = (term: string) => {
    // In a real app, this would filter the invoices
    console.log("Searching for:", term);
  };

  const handleFilter = (filters: any) => {
    // In a real app, this would filter the invoices based on the filters
    console.log("Filtering with:", filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billings</h1>
          <p className="text-muted-foreground">
            Track project invoices and payments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <PaymentReminder 
        overdueInvoices={overdueInvoices} 
        totalOverdueAmount={overdueAmount} 
      />

      <InvoiceSummary 
        totalInvoiced={totalInvoiced}
        totalPaid={totalPaid}
        totalOutstanding={totalOutstanding}
        overdueAmount={overdueAmount}
        paidPercentage={paidPercentage}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InvoiceStatusChart />
        <RevenueChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>Track invoices, payments, and project status</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable 
            invoices={invoices} 
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </CardContent>
      </Card>

      <ClientPaymentHistory />
    </div>
  );
};

export default Billings;