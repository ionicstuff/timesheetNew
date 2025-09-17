"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Plus,
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

const ProjectRisks = () => {
  const risks = [
    { 
      id: 1, 
      title: "Resource Shortage", 
      level: "high",
      status: "mitigated",
      description: "Potential shortage of developers during peak development phase",
      mitigation: "Hire 2 additional freelancers for the critical period"
    },
    { 
      id: 2, 
      title: "Scope Creep", 
      level: "medium",
      status: "monitoring",
      description: "Client keeps adding new features to the project scope",
      mitigation: "Implement formal change request process with client approval"
    },
    { 
      id: 3, 
      title: "Technical Debt", 
      level: "low",
      status: "identified",
      description: "Legacy code may require more time to integrate with new features",
      mitigation: "Allocate 2 days per sprint for refactoring tasks"
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "mitigated":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "monitoring":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Management
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </CardTitle>
        <CardDescription>Potential issues and mitigation strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getRiskColor(risk.level)}`}>
                    {getStatusIcon(risk.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{risk.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {risk.description}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Risk</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Mitigation Plan</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    risk.level === "high" ? "bg-red-100 text-red-800" :
                    risk.level === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {risk.mitigation}
                </p>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Status</span>
                  <span className="capitalize">
                    {risk.status}
                  </span>
                </div>
                <Progress 
                  value={risk.status === "mitigated" ? 100 : risk.status === "monitoring" ? 50 : 25} 
                  className="h-2" 
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Risk Management Tips</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Regularly review and update risk assessments</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Assign risk owners for each identified risk</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Track risk mitigation progress in weekly meetings</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectRisks;