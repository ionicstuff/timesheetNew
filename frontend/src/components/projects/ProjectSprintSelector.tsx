"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectSprintSelectorProps {
  onSprintChange: (sprintData: { 
    numberOfSprints: number; 
    sprintDuration: number;
    startDate: Date | undefined;
  }) => void;
}

const ProjectSprintSelector = ({ onSprintChange }: ProjectSprintSelectorProps) => {
  const [numberOfSprints, setNumberOfSprints] = useState<number>(1);
  const [sprintDuration, setSprintDuration] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());

  const sprintDurations = [
    { value: 0.5, label: "30 minutes" },
    { value: 1, label: "1 hour" },
    { value: 1.5, label: "1.5 hours" },
    { value: 2, label: "2 hours" },
    { value: 2.5, label: "2.5 hours" },
    { value: 3, label: "3 hours" },
  ];

  const handleNumberOfSprintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setNumberOfSprints(value);
    onSprintChange({ numberOfSprints: value, sprintDuration, startDate });
  };

  const handleSprintDurationChange = (value: string) => {
    const newDuration = parseFloat(value);
    setSprintDuration(newDuration);
    onSprintChange({ numberOfSprints, sprintDuration: newDuration, startDate });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onSprintChange({ numberOfSprints, sprintDuration, startDate: date });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="number-of-sprints">Number of Sprints</Label>
        <Input
          id="number-of-sprints"
          type="number"
          min="1"
          value={numberOfSprints}
          onChange={handleNumberOfSprintsChange}
        />
      </div>
      
      <div>
        <Label htmlFor="sprint-duration">Sprint Duration</Label>
        <Select 
          value={sprintDuration.toString()} 
          onValueChange={handleSprintDurationChange}
        >
          <SelectTrigger id="sprint-duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {sprintDurations.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="sprint-start">Project Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ProjectSprintSelector;