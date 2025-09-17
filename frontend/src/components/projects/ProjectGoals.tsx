"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Target } from "lucide-react";

interface ProjectGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

interface ProjectGoalsProps {
  goals: ProjectGoal[];
  onGoalsChange: (goals: ProjectGoal[]) => void;
}

const ProjectGoals = ({ goals, onGoalsChange }: ProjectGoalsProps) => {
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: 0,
    currentValue: 0,
    unit: ""
  });

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: ProjectGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        targetValue: newGoal.targetValue,
        currentValue: newGoal.currentValue,
        unit: newGoal.unit
      };
      
      onGoalsChange([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        targetValue: 0,
        currentValue: 0,
        unit: ""
      });
    }
  };

  const removeGoal = (id: string) => {
    onGoalsChange(goals.filter(goal => goal.id !== id));
  };

  const updateCurrentValue = (id: string, value: number) => {
    onGoalsChange(
      goals.map(goal => 
        goal.id === id 
          ? { ...goal, currentValue: Math.max(0, Math.min(goal.targetValue, value)) } 
          : goal
      )
    );
  };

  const getProgressPercentage = (goal: ProjectGoal) => {
    return goal.targetValue > 0 
      ? Math.round((goal.currentValue / goal.targetValue) * 100) 
      : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">Project Goals</h3>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setNewGoal({
            title: "",
            description: "",
            targetValue: 0,
            currentValue: 0,
            unit: ""
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
      
      {newGoal.title !== "" && (
        <div className="border rounded-lg p-4 space-y-4">
          <div>
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input
              id="goal-title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g., Increase user engagement"
            />
          </div>
          
          <div>
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Describe your goal in detail"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-value">Current Value</Label>
              <Input
                id="current-value"
                type="number"
                min="0"
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: Number(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="target-value">Target Value</Label>
              <Input
                id="target-value"
                type="number"
                min="0"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                placeholder="e.g., %, users, $"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewGoal({
                title: "",
                description: "",
                targetValue: 0,
                currentValue: 0,
                unit: ""
              })}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addGoal}>
              Add Goal
            </Button>
          </div>
        </div>
      )}
      
      {goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto text-muted-foreground/20" />
          <p className="mt-2">No goals set yet</p>
          <p className="text-sm mt-1">Define measurable goals to track project success</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {goal.currentValue} {goal.unit} / {goal.targetValue} {goal.unit}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Update progress:</span>
                  <Input
                    type="number"
                    min="0"
                    max={goal.targetValue}
                    value={goal.currentValue}
                    onChange={(e) => updateCurrentValue(goal.id, Number(e.target.value))}
                    className="h-8 w-24"
                  />
                  <span className="text-sm">{goal.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectGoals;