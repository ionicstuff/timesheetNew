"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, GitGraph } from "lucide-react";

interface Project {
  id: number;
  name: string;
}

interface ProjectDependenciesProps {
  dependencies: number[];
  projects: Project[];
  onDependenciesChange: (dependencies: number[]) => void;
}

const ProjectDependencies = ({ dependencies, projects, onDependenciesChange }: ProjectDependenciesProps) => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const addDependency = () => {
    if (selectedProject && !dependencies.includes(selectedProject)) {
      onDependenciesChange([...dependencies, selectedProject]);
      setSelectedProject(null);
    }
  };

  const removeDependency = (projectId: number) => {
    onDependenciesChange(dependencies.filter(id => id !== projectId));
  };

  const getProjectName = (id: number) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : "Unknown Project";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitGraph className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-medium">Dependencies</h3>
      </div>
      
      <div className="flex gap-2">
        <Select 
          value={selectedProject?.toString() || ""} 
          onValueChange={(value) => setSelectedProject(Number(value))}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select project dependency" />
          </SelectTrigger>
          <SelectContent>
            {projects
              .filter(project => !dependencies.includes(project.id))
              .map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          onClick={addDependency}
          disabled={!selectedProject}
        >
          Add
        </Button>
      </div>
      
      {dependencies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {dependencies.map((projectId) => (
            <Badge key={projectId} variant="secondary" className="flex items-center gap-1">
              {getProjectName(projectId)}
              <button 
                type="button" 
                onClick={() => removeDependency(projectId)}
                className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {dependencies.length > 0 && (
        <div className="text-xs text-muted-foreground">
          This project depends on the completion of the selected projects above.
        </div>
      )}
    </div>
  );
};

export default ProjectDependencies;