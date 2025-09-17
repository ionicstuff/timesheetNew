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
  DollarSign,
  ChevronRight
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
import { motion, AnimatePresence } from "framer-motion";

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
      document0.documentElement.classList.remove('dark');
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
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            AgencyOS
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-4">
          <WorkspaceSwitcher />
        </div>
        
        <div className="mt-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md bg-muted pl-8 pr-4 py-2 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {[
            { path: "/dashboard", icon: Home, label: "Dashboard" },
            { path: "/tasks", icon: CheckCircle, label: "Tasks" },
            { path: "/projects", icon: LayoutGrid, label: "Projects" },
            { path: "/clients", icon: Building2, label: "My Clients" },
            { path: "/calendar", icon: CalendarIcon, label: "Calendar" },
            { path: "/documents", icon: FileText, label: "Documents" },
            { path: "/team", icon: Users, label: "Team" },
            { path: "/billings", icon: DollarSign, label: "Billings" }
          ].map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.a
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  active 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            );
          })}
          
          <motion.a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ x: 5 }}
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </motion.a>
        </nav>

        <QuickTaskCreator />

        <div className="px-3 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Workspaces</h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
          
          <div className="space-y-1">
            {["Personal", "Work", "Freelance"].map((workspace, index) => (
              <motion.button
                key={workspace}
                className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                {workspace}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <Collapsible 
            open={expandedSections.projects} 
            onOpenChange={() => toggleSection('projects')}
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between w-full"
                whileHover={{ x: 5 }}
              >
                <h3 className="text-sm font-medium">Projects</h3>
                <motion.div
                  animate={{ rotate: expandedSections.projects ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              <AnimatePresence>
                {expandedSections.projects && projects.map((project, index) => (
                  <motion.a
                    key={project.id}
                    href="#"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`h-2 w-2 rounded-full ${project.color}`}></div>
                    {project.name}
                  </motion.a>
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="px-3 py-2">
          <Collapsible 
            open={expandedSections.folders} 
            onOpenChange={() => toggleSection('folders')}
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between w-full"
                whileHover={{ x: 5 }}
              >
                <h3 className="text-sm font-medium">Folders</h3>
                <motion.div
                  animate={{ rotate: expandedSections.folders ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              <AnimatePresence>
                {expandedSections.folders && folders.map((folder, index) => (
                  <motion.a
                    key={folder.id}
                    href="#"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                  >
                    <Folder className="h-3 w-3" />
                    {folder.name}
                  </motion.a>
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <TimeTracker />

      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <motion.a
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/settings") 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary"
            )}
            whileHover={{ x: 5 }}
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </motion.a>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
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
          </motion.div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          AgencyOS v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;