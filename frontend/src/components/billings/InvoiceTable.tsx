"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InvoiceFilter from "./InvoiceFilter";

interface Invoice {
  id: number;
  project: string;
  client: string;
  amount: number;
  status: string;
  invoiceDate: string;
  dueDate: string;
  paymentDate: string | null;
  tasksCompleted: number;
  totalTasks: number;
  projectProgress: number;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onSearch: (term: string) => void;
  onFilter: (filters: any) => void;
}

const InvoiceTable = ({ invoices, onSearch, onFilter }: InvoiceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "sent": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-blue-500" />;
      case "overdue": return <Clock className="h-4 w-4 text-red-500" />;
      case "draft": return <FileText className="h-4 w-4 text-gray-500" />;
      case "sent": return <FileText className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects or clients..."
            className="pl-8 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <InvoiceFilter onFilterChange={onFilter} />
      </div>

      <div className="border rounded-lg">
        <div className="border-b p-4 font-medium">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Client</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        <div className="divide-y">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 hover:bg-muted/50">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <div className="font-medium">{invoice.project}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.invoiceDate ? `Invoiced: ${new Date(invoice.invoiceDate).toLocaleDateString()}` : "Not invoiced"}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {invoice.client.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{invoice.client}</span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                  {invoice.dueDate && (
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invoice.status)}
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Progress value={invoice.projectProgress} className="w-full" />
                    <span className="text-xs w-10">{invoice.projectProgress}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {invoice.tasksCompleted}/{invoice.totalTasks} tasks
                  </div>
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;