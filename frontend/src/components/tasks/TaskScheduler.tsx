"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const TaskScheduler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  const tasks = [
    { id: 1, title: "Design homepage", project: "Website Redesign", dueDate: "2023-12-15", priority: "High" },
    { id: 2, title: "Meeting with client", project: "Product Launch", dueDate: "2023-12-10", priority: "Medium" },
    { id: 3, title: "Update documentation", project: "Marketing Campaign", dueDate: "2023-12-20", priority: "Low" },
    { id: 4, title: "Research competitors", project: "Product Launch", dueDate: "2023-12-12", priority: "Medium" },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Task analysis complete",
        description: "We've optimized your task priorities based on deadlines and project importance."
      });
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Task Scheduler
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Let our AI optimize your task priorities and scheduling
          </p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || analysisComplete}
          variant={analysisComplete ? "outline" : "default"}
        >
          {isAnalyzing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : analysisComplete ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Analysis Complete
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Optimize Schedule
            </>
          )}
        </Button>
      </div>
      
      {isAnalyzing && (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <p className="mt-2 font-medium">Analyzing your tasks...</p>
              <p className="text-sm text-muted-foreground">Our AI is optimizing your schedule</p>
            </div>
          </div>
          <Progress value={75} className="w-full" />
        </div>
      )}
      
      {analysisComplete && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Schedule Optimized!</p>
                <p className="text-sm text-green-700 mt-1">
                  Based on your deadlines and project priorities, we recommend the following task order:
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Meeting with client</p>
                  <p className="text-sm text-muted-foreground">Product Launch • Due Dec 10</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor("High")}`}>
                High Priority
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Research competitors</p>
                  <p className="text-sm text-muted-foreground">Product Launch • Due Dec 12</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor("Medium")}`}>
                Medium Priority
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Design homepage</p>
                  <p className="text-sm text-muted-foreground">Website Redesign • Due Dec 15</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor("High")}`}>
                High Priority
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Update documentation</p>
                  <p className="text-sm text-muted-foreground">Marketing Campaign • Due Dec 20</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor("Low")}`}>
                Low Priority
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Pro Tip</p>
                <p className="text-sm text-blue-700 mt-1">
                  Start with the client meeting as it's time-sensitive. Complete the competitor research 
                  before the design work to inform your decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isAnalyzing && !analysisComplete && (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">How It Works</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Analyzes your task deadlines and project priorities</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Recommends optimal task order to maximize efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Identifies potential scheduling conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Provides personalized productivity tips</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">AI-Powered Insights</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Our machine learning algorithms analyze thousands of task completion patterns to 
                  provide you with the most effective scheduling recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskScheduler;