"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ClientPaymentHistory = () => {
  const clients = [
    {
      id: 1,
      name: "Acme Corporation",
      totalInvoiced: 75000,
      totalPaid: 75000,
      outstanding: 0,
      lastPayment: "2023-11-10",
      paymentHistory: [
        { date: "2023-11-10", amount: 25000, status: "paid" },
        { date: "2023-10-15", amount: 25000, status: "paid" },
        { date: "2023-09-20", amount: 25000, status: "paid" }
      ]
    },
    {
      id: 2,
      name: "Globex Inc",
      totalInvoiced: 65000,
      totalPaid: 45000,
      outstanding: 20000,
      lastPayment: "2023-11-05",
      paymentHistory: [
        { date: "2023-11-05", amount: 20000, status: "paid" },
        { date: "2023-10-20", amount: 25000, status: "paid" },
        { date: "2023-09-15", amount: 20000, status: "pending" }
      ]
    },
    {
      id: 3,
      name: "Wayne Enterprises",
      totalInvoiced: 30000,
      totalPaid: 15000,
      outstanding: 15000,
      lastPayment: "2023-10-25",
      paymentHistory: [
        { date: "2023-10-25", amount: 15000, status: "paid" },
        { date: "2023-09-30", amount: 15000, status: "overdue" }
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Payment History</CardTitle>
        <CardDescription>Payment trends by client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {clients.map((client) => {
            const paymentPercentage = client.totalInvoiced > 0 
              ? Math.round((client.totalPaid / client.totalInvoiced) * 100) 
              : 0;
              
            return (
              <div key={client.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Last payment: {new Date(client.lastPayment).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoiced</p>
                    <p className="font-medium">{formatCurrency(client.totalInvoiced)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium text-green-600">{formatCurrency(client.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className={`font-medium ${client.outstanding > 0 ? 'text-red-600' : ''}`}>
                      {formatCurrency(client.outstanding)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment Progress</span>
                    <span>{paymentPercentage}%</span>
                  </div>
                  <Progress value={paymentPercentage} className="h-2" />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Recent Payments</p>
                  <div className="space-y-2">
                    {client.paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientPaymentHistory;