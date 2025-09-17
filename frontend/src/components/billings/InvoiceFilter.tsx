"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

interface InvoiceFilterProps {
  onFilterChange: (filters: {
    status: string[];
    dateRange: DateRange | undefined;
  }) => void;
}

const InvoiceFilter = ({ onFilterChange }: InvoiceFilterProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: {
      from: addDays(new Date(), -30),
      to: new Date(),
    } as DateRange | undefined
  });

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      dateRange: {
        from: addDays(new Date(), -30),
        to: new Date(),
      } as DateRange | undefined
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const statuses = [
    { value: "paid", label: "Paid", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
    { value: "pending", label: "Pending", icon: <Clock className="h-4 w-4 text-blue-500" /> },
    { value: "overdue", label: "Overdue", icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
    { value: "draft", label: "Draft", icon: <FileText className="h-4 w-4 text-gray-500" /> },
    { value: "sent", label: "Sent", icon: <FileText className="h-4 w-4 text-yellow-500" /> }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {(filters.status.length > 0) && (
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium">Filter Invoices</h3>
          <p className="text-sm text-muted-foreground">Refine your invoice list</p>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold">Status</Label>
            <div className="mt-2 space-y-2">
              {statuses.map(status => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => toggleStatus(status.value)}
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="ml-2 text-sm flex items-center gap-2"
                  >
                    {status.icon}
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-semibold">Date Range</Label>
            <div className="mt-2 text-sm text-muted-foreground">
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                "Select a date range"
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InvoiceFilter;