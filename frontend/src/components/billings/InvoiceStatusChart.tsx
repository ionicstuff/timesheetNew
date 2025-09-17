"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const InvoiceStatusChart = () => {
  const statusData = [
    { name: "Paid", value: 12, color: "#10b981" },
    { name: "Pending", value: 5, color: "#3b82f6" },
    { name: "Overdue", value: 3, color: "#ef4444" },
    { name: "Draft", value: 2, color: "#94a3b8" },
    { name: "Sent", value: 8, color: "#f59e0b" },
  ];

  const totalInvoices = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Status Overview
        </CardTitle>
        <CardDescription>Distribution of invoices by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="border rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Paid</div>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-muted-foreground">Draft</div>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <FileText className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-muted-foreground">Sent</div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Invoices']}
                labelFormatter={(name) => `${name} Invoices`}
              />
              <Bar dataKey="value" name="Invoices">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total Invoices: <span className="font-medium">{totalInvoices}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatusChart;