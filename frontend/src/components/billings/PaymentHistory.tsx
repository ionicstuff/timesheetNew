"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PaymentHistory = () => {
  const payments = [
    {
      id: 1,
      client: "Acme Corporation",
      project: "Website Redesign",
      amount: 25000,
      date: "2023-11-10",
      method: "Bank Transfer",
      status: "completed",
      invoiceId: "INV-001"
    },
    {
      id: 2,
      client: "Wayne Enterprises",
      project: "Marketing Campaign",
      amount: 15000,
      date: "2023-10-25",
      method: "Credit Card",
      status: "completed",
      invoiceId: "INV-003"
    },
    {
      id: 3,
      client: "Globex Inc",
      project: "Product Launch",
      amount: 20000,
      date: "2023-11-05",
      method: "Bank Transfer",
      status: "completed",
      invoiceId: "INV-002"
    },
    {
      id: 4,
      client: "Stark Industries",
      project: "Mobile App Development",
      amount: 30000,
      date: "2023-10-15",
      method: "Check",
      status: "completed",
      invoiceId: "INV-004"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment History</span>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
        <CardDescription>Recent payments received from clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">{formatCurrency(totalPayments)}</div>
          <div className="text-sm text-muted-foreground">Total payments received</div>
        </div>
        
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{payment.client}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.project} • {payment.invoiceId}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(payment.amount)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
                
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
                
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Payment Tracking Tips</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Follow up on overdue invoices within 7 days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Send payment reminders 3 days before due date</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Record all payments immediately upon receipt</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;