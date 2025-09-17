"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  TrendingUp,
  DollarSign
} from "lucide-react";

const RevenueChart = () => {
  const revenueData = [
    { month: "Jan", revenue: 45000, invoices: 12 },
    { month: "Feb", revenue: 52000, invoices: 15 },
    { month: "Mar", revenue: 48000, invoices: 14 },
    { month: "Apr", revenue: 61000, invoices: 18 },
    { month: "May", revenue: 55000, invoices: 16 },
    { month: "Jun", revenue: 67000, invoices: 20 },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / revenueData.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Overview
        </CardTitle>
        <CardDescription>Monthly revenue and invoice trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">This year</p>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Monthly</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formatCurrency(avgRevenue)}</p>
            <p className="text-xs text-muted-foreground">6 months</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                labelFormatter={(name) => `Month: ${name}`}
              />
              <Bar dataKey="revenue" name="Revenue">
                {revenueData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === revenueData.length - 1 ? "#3b82f6" : "#94a3b8"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing revenue data for the last 6 months
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;