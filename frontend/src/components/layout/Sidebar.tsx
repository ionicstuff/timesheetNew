"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  Folder, 
  Home, 
  MessageSquare, 
  Plus, 
  Settings as SettingsIcon, 
  Users,
  ChevronDown,
  Search,
  LayoutGrid,
  FileText,
  Moon,
  Sun,
  Building2,
  DollarSign
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import TimeTracker from "./TimeTracker";
import QuickTaskCreator from "./QuickTaskCreator";

const Sidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
    folders: true
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const projects = [
    { id: 1, name: "Website Redesign", color: "bg-blue-500" },
    { id: 2, name: "Product Launch", color: "bg-green-500" },
    { id: 3, name: "Marketing Campaign", color: "bg-purple-500" }
  ];

  const folders = [
    { id: 1, name: "Design Assets" },
    { id: 2, name: "Research" },
    { id: 3, name: "Client Docs" }
  ];

  const clients = [
    { id: 1, name: "Acme Corp" },
    { id: 2, name: "Globex Inc" },
    { id: 3, name: "Wayne Enterprises" }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AgencyOS</h1>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <WorkspaceSwitcher />
        </div>
        
        <div className="mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md bg-muted pl-8 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <a
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/dashboard") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="/tasks"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/tasks") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <CheckCircle className="h-4 w-4" />
            Tasks
          </a>
          <a
            href="/projects"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/projects") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Projects
          </a>
          <a
            href="/clients"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/clients") 
                ? "text-primary bg-primary/10" 
                : "text-muted-0foreground hover:text-primary"
            )}
          >
            <Building2 className="h-4 w-4" />
            My Clients
          </a>
          <a
            href="/calendar"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/calendar") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </a>
          <a
            href="/documents"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/documents") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <FileText className="h-4 w-4" />
            Documents
          </a>
          <a
            href="/team"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/team") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Users className="h-4 w-4" />
            Team
          </a>
          <a
            href="/billings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/billings") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <DollarSign className="h-4 w-4" />
            Billings
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </a>
        </nav>

        <QuickTaskCreator />

        <div className="px-3 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Workspaces</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <button
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Personal
            </button>
            <button
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Work
            </button>
            <button
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            >
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Freelance
            </button>
          </div>
        </div>

        <div className="px-3 py-2">
          <Collapsible 
            open={expandedSections.projects} 
            onOpenChange={() => toggleSection('projects')}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-medium">Projects</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform",
                    expandedSections.projects ? "rotate-180" : ""
                  )} />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full ${project.color}`}></div>
                  {project.name}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="px-3 py-2">
          <Collapsible 
            open={expandedSections.folders} 
            onOpenChange={() => toggleSection('folders')}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-medium">Folders</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform",
                    expandedSections.folders ? "rotate-180" : ""
                  )} />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {folders.map((folder) => (
                <a
                  key={folder.id}
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Folder className="h-3 w-3" />
                  {folder.name}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <TimeTracker />

      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <a
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/settings") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </a>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          AgencyOS v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;