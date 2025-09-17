"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
  status: "identified" | "mitigated" | "monitoring" | "resolved";
}

interface ProjectRiskAssessmentProps {
  risks: ProjectRisk[];
  onRisksChange: (risks: ProjectRisk[]) => void;
}

const ProjectRiskAssessment = ({ risks, onRisksChange }: ProjectRiskAssessmentProps) => {
  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    probability: "medium" as "low" | "medium" | "high",
    impact: "medium" as "low" | "medium" | "high",
    mitigation: "",
    status: "identified" as "identified" | "mitigated" | "monitoring" | "resolved"
  });

  const addRisk = () => {
    if (newRisk.title.trim()) {
      const risk: ProjectRisk = {
        id: Date.now().toString(),
        title: newRisk.title,
        description: newRisk.description,
        probability: newRisk.probability,
        impact: newRisk.impact,
        mitigation: newRisk.mitigation,
        status: newRisk.status
      };
      
      onRisksChange([...risks, risk]);
      setNewRisk({
        title: "",
        description: "",
        probability: "medium",
        impact: "medium",
        mitigation: "",
        status: "identified"
      });
    }
  };

  const removeRisk = (id: string) => {
    onRisksChange(risks.filter(risk => risk.id !== id));
  };

  const updateRisk = (id: string, field: keyof ProjectRisk, value: any) => {
    onRisksChange(
      risks.map(risk => 
        risk.id === id ? { ...risk, [field]: value } : risk
      )
    );
  };

  const getRiskLevel = (probability: string, impact: string) => {
    const levels: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const score = levels[probability] * levels[impact];
    
    if (score <= 2) return "low";
    if (score <= 4) return "medium";
    return "high";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "mitigated": return "bg-blue-100 text-blue-800";
      case "monitoring": return "bg-yellow-100 text-yellow-800";
      case "identified": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">Risk Assessment</h3>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setNewRisk({
            title: "",
            description: "",
            probability: "medium",
            impact: "medium",
            mitigation: "",
            status: "identified"
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>
      
      {newRisk.title !== "" && (
        <div className="border rounded-lg p-4 space-y-4">
          <div>
            <Label htmlFor="risk-title">Risk Title</Label>
            <Input
              id="risk-title"
              value={newRisk.title}
              onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
              placeholder="e.g., Resource shortage, Technical debt"
            />
          </div>
          
          <div>
            <Label htmlFor="risk-description">Description</Label>
            <Textarea
              id="risk-description"
              value={newRisk.description}
              onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
              placeholder="Describe the potential risk"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="risk-probability">Probability</Label>
              <Select 
                value={newRisk.probability} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  setNewRisk({ ...newRisk, probability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="risk-impact">Impact</Label>
              <Select 
                value={newRisk.impact} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  setNewRisk({ ...newRisk, impact: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="risk-mitigation">Mitigation Strategy</Label>
            <Textarea
              id="risk-mitigation"
              value={newRisk.mitigation}
              onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
              placeholder="How will you mitigate this risk?"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewRisk({
                title: "",
                description: "",
                probability: "medium",
                impact: "medium",
                mitigation: "",
                status: "identified"
              })}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addRisk}>
              Add Risk
            </Button>
          </div>
        </div>
      )}
      
      {risks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/20" />
          <p className="mt-2">No risks identified yet</p>
          <p className="text-sm mt-1">Identify potential risks to proactively manage them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {risks.map((risk) => {
            const riskLevel = getRiskLevel(risk.probability, risk.impact);
            return (
              <div key={risk.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{risk.title}</h4>
                      <Badge className={getRiskColor(riskLevel)}>
                        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                      </Badge>
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeRisk(risk.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Mitigation Strategy</Label>
                    <p className="text-sm mt-1">{risk.mitigation || "No mitigation strategy defined"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Status</Label>
                      <Select 
                        value={risk.status} 
                        onValueChange={(value: "identified" | "mitigated" | "monitoring" | "resolved") => 
                          updateRisk(risk.id, "status", value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="identified">Identified</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="mitigated">Mitigated</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Probability</Label>
                        <Select 
                          value={risk.probability} 
                          onValueChange={(value: "low" | "medium" | "high") => 
                            updateRisk(risk.id, "probability", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1">
                        <Label className="text-xs">Impact</Label>
                        <Select 
                          value={risk.impact} 
                          onValueChange={(value: "low" | "medium" | "high") => 
                            updateRisk(risk.id, "impact", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectRiskAssessment;