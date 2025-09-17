"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  CheckCircle, 
  LayoutGrid,
  Users,
  Calendar
} from "lucide-react";
import TaskCard from "@/components/tasks/TaskCard";
import ProjectCard from "@/components/projects/ProjectCard";
import DocumentCard from "@/components/documents/DocumentCard";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import { Input } from "@/components/ui/input";

const SearchResults = () => {
  // In a real app, you would get search params from the URL
  // For now, we'll simulate search results
  const [searchTerm, setSearchTerm] = useState("design");
  
  // Simulated search results
  const tasks = [
    { id: 1, title: "Design homepage", project: "Website Redesign", dueDate: "Today", priority: "High" as const, completed: false, assignedTo: "Alex Johnson" },
    { id: 2, title: "Create wireframes", project: "Website Redesign", dueDate: "In 3 days", priority: "High" as const, completed: false },
  ];
  
  const projects = [
    { 
      id: 1, 
      name: "Website Redesign", 
      description: "Complete overhaul of company website", 
      progress: 65, 
      tasks: 12,
      members: 5,
      color: "bg-blue-500",
      membersList: ["Alex Johnson", "Sam Smith", "Taylor Brown"],
      status: "active",
      dueDate: "Dec 15, 2023"
    },
  ];
  
  const documents = [
    { id: 1, name: "Design Mockups", type: "pdf", updatedAt: "2 days ago" },
    { id: 2, name: "Design Assets Folder", type: "folder", updatedAt: "1 week ago", items: 8, isFolder: true },
  ];
  
  const teamMembers = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      role: "Project Manager", 
      email: "alex@example.com", 
      status: "online" as const,
      tasks: 12
    },
    { 
      id: 2, 
      name: "Sam Smith", 
      role: "Designer", 
      email: "sam@example.com", 
      status: "online" as const,
      tasks: 8
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          Found {tasks.length + projects.length + documents.length + teamMembers.length} results for "{searchTerm}"
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks, projects, docs..."
          className="w-full rounded-md pl-8 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {tasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Tasks</h2>
            <span className="text-sm text-muted-foreground">({tasks.length})</span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                project={task.project}
                dueDate={task.dueDate}
                priority={task.priority}
                completed={task.completed}
                assignedTo={task.assignedTo}
                onToggle={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Projects</h2>
            <span className="text-sm text-muted-foreground">({projects.length})</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                progress={project.progress}
                tasks={project.tasks}
                members={project.members}
                color={project.color}
                membersList={project.membersList}
                status={project.status}
                dueDate={project.dueDate}
              />
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Documents</h2>
            <span className="text-sm text-muted-foreground">({documents.length})</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                type={doc.type}
                updatedAt={doc.updatedAt}
                isFolder={doc.isFolder}
                items={doc.items}
              />
            ))}
          </div>
        </div>
      )}

      {teamMembers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Team Members</h2>
            <span className="text-sm text-muted-foreground">({teamMembers.length})</span>
          </div>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                id={member.id}
                name={member.name}
                role={member.role}
                email={member.email}
                status={member.status}
                tasks={member.tasks}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && projects.length === 0 && documents.length === 0 && teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;