"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock,
  User,
  Building2,
  Calendar,
  Download,
  Send,
  Edit,
  MoreHorizontal,
  Printer
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const BillingDetail = () => {
  const [invoiceStatus, setInvoiceStatus] = useState("sent");

  const invoice = {
    id: "INV-001",
    client: "Acme Corporation",
    project: "Website Redesign",
    amount: 25000,
    status: "paid",
    invoiceDate: "2023-10-15",
    dueDate: "2023-11-15",
    paymentDate: "2023-11-10",
    notes: "Thank you for your business. Payment due within 30 days.",
    items: [
      { id: 1, description: "Website Design", quantity: 1, rate: 15000, amount: 15000 },
      { id: 2, description: "Frontend Development", quantity: 1, rate: 10000, amount: 10000 }
    ]
  };

  const client = {
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, San Francisco, CA 94107"
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleStatusChange = (newStatus: string) => {
    setInvoiceStatus(newStatus);
    // In a real app, you would update the invoice status in the database
    console.log(`Invoice status changed to: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
              <p className="text-muted-foreground">{invoice.project}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(invoiceStatus)}>
              {invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Issued: {new Date(invoice.invoiceDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Invoice #{invoice.id} for {invoice.project}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-sm font-medium">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Amount</div>
                </div>
                
                <div className="divide-y">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-6">{item.description}</div>
                      <div className="col-span-2">{item.quantity}</div>
                      <div className="col-span-2">{formatCurrency(item.rate)}</div>
                      <div className="col-span-2">{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span>Subtotal</span>
                        <span>{formatCurrency(invoice.amount)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Tax (0%)</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(invoice.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of payments for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Payment Received</div>
                      <div className="text-sm text-muted-foreground">
                        Transaction ID: TXN-001
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.paymentDate!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Details about the client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {client.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.contact}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{client.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{client.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="hover:underline">
                    {client.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Invoice Actions</CardTitle>
              <CardDescription>Manage this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </Button>
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Invoice
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button className="w-full text-red-600" variant="outline">
                  Delete Invoice
                </Button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Change Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant={invoiceStatus === "draft" ? "default" : "outline"}
                    onClick={() => handleStatusChange("draft")}
                  >
                    Draft
                  </Button>
                  <Button 
                    size="sm" 
                    variant={invoiceStatus === "sent" ? "default" : "outline"}
                    onClick={() => handleStatusChange("sent")}
                  >
                    Sent
                  </Button>
                  <Button 
                    size="sm" 
                    variant={invoiceStatus === "paid" ? "default" : "outline"}
                    onClick={() => handleStatusChange("paid")}
                  >
                    Paid
                  </Button>
                  <Button 
                    size="sm" 
                    variant={invoiceStatus === "overdue" ? "default" : "outline"}
                    onClick={() => handleStatusChange("overdue")}
                  >
                    Overdue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Timeline</CardTitle>
              <CardDescription>Key dates for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="h-full w-0.5 bg-muted mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Invoice Issued</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="h-full w-0.5 bg-muted mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Payment Due</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Payment Received</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.paymentDate!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingDetail;