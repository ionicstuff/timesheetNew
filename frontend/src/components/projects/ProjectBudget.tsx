"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectBudget = () => {
  const budgetData = {
    total: 50000,
    spent: 32500,
    remaining: 17500,
    currency: "USD"
  };

  const expenses = [
    { id: 1, category: "Design", amount: 8000, budget: 10000 },
    { id: 2, category: "Development", amount: 18000, budget: 20000 },
    { id: 3, category: "Marketing", amount: 5000, budget: 7000 },
    { id: 4, category: "Testing", amount: 1500, budget: 3000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBudgetColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Tracking
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Project financials and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(budgetData.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(budgetData.spent)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round((budgetData.spent / budgetData.total) * 100)}%</span>
              </div>
              <Progress value={(budgetData.spent / budgetData.total) * 100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Remaining</span>
              <span className={budgetData.remaining < 0 ? "text-red-500" : ""}>
                {formatCurrency(budgetData.remaining)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Expense Breakdown</h3>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{expense.category}</span>
                    <span className="font-medium">
                      {formatCurrency(expense.amount)} / {formatCurrency(expense.budget)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spent</span>
                      <span>{Math.round((expense.amount / expense.budget) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(expense.amount / expense.budget) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Budget Status</p>
              <p className="font-medium">On Track</p>
            </div>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Add Expense
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBudget;