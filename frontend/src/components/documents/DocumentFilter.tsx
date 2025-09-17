"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Calendar,
  FileText,
  Folder
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const DocumentFilter = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    folder: "all" as "all" | "design" | "research" | "client" | "finance",
    date: "all" as "all" | "today" | "week" | "month" | "year"
  });

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const documentTypes = [
    { value: "doc", label: "Documents" },
    { value: "sheet", label: "Spreadsheets" },
    { value: "slide", label: "Presentations" },
    { value: "pdf", label: "PDFs" },
    { value: "txt", label: "Text Files" }
  ];

  const folders = [
    { value: "all", label: "All Folders" },
    { value: "design", label: "Design Assets" },
    { value: "research", label: "Research" },
    { value: "client", label: "Client Docs" },
    { value: "finance", label: "Financial" }
  ];

  const dates = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium">Filter Documents</h3>
          <p className="text-sm text-muted-foreground">Refine your document list</p>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold">Document Type</Label>
            <div className="mt-2 space-y-2">
              {documentTypes.map(type => (
                <div key={type.value} className="flex items-center">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type.includes(type.value)}
                    onCheckedChange={() => toggleType(type.value)}
                  />
                  <Label
                    htmlFor={`type-${type.value}`}
                    className="ml-2 text-sm"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-semibold">Folder</Label>
            <div className="mt-2">
              <Select 
                value={filters.folder} 
                onValueChange={(value: "all" | "design" | "research" | "client" | "finance") => 
                  setFilters(prev => ({ ...prev, folder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map(folder => (
                    <SelectItem key={folder.value} value={folder.value}>
                      {folder.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-semibold">Date Modified</Label>
            <div className="mt-2">
              <Select 
                value={filters.date} 
                onValueChange={(value: "all" | "today" | "week" | "month" | "year") => 
                  setFilters(prev => ({ ...prev, date: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map(date => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilters({
              type: [],
              folder: "all",
              date: "all"
            })}
          >
            Reset
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DocumentFilter;