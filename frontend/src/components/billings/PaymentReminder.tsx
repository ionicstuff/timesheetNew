"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Send, 
  Calendar,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PaymentReminderProps {
  overdueInvoices: number;
  totalOverdueAmount: number;
}

const PaymentReminder = ({ overdueInvoices, totalOverdueAmount }: PaymentReminderProps) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSendReminders = () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Payment Reminders Sent",
        description: `Sent ${overdueInvoices} payment reminders to clients with overdue invoices.`,
      });
    }, 1000);
  };

  if (overdueInvoices === 0) return null;

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Bell className="h-5 w-5" />
          Payment Reminders
        </CardTitle>
        <CardDescription>
          You have overdue invoices that require attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">
              {overdueInvoices} overdue invoice{overdueInvoices > 1 ? 's' : ''}
            </p>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalOverdueAmount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Total overdue amount
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSendReminders}
              disabled={isSending}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send Reminders"}
            </Button>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last reminder sent 3 days ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentReminder;