"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  trendValue
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && trendValue && (
            <span className={`ml-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trendValue}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;