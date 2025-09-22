"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import TaskSprintSelector from "./TaskSprintSelector";

interface TeamMember {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface TaskFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  projects?: any[];
  currentUserId?: number;
  canAssignOthers?: boolean;
  teamMembers?: TeamMember[];
  lockProjectId?: number; // when provided, lock project selection to this id
}

const TaskForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  projects = [],
  currentUserId,
  canAssignOthers,
  teamMembers = [],
  lockProjectId
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [project, setProject] = useState(initialData?.project || (lockProjectId ? String(lockProjectId) : ""));
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate);
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || "");
  const [sprintData, setSprintData] = useState({
    duration: 1,
    startDate: new Date(),
    endDate: undefined as Date | undefined
  });
  const defaultAssigneeId = initialData?.assigneeId ?? (currentUserId ? String(currentUserId) : null);
  const [assigneeId, setAssigneeId] = useState<string | null>(defaultAssigneeId);
  const [projectMembers, setProjectMembers] = useState<TeamMember[] | null>(null); // null => not loaded yet for current project

  // Sync lockProjectId if it changes
  useEffect(() => {
    if (lockProjectId) setProject(String(lockProjectId));
  }, [lockProjectId]);

  // Load project members when project changes
  useEffect(() => {
    const loadMembers = async () => {
      try {
        if (!project) { setProjectMembers(null); return; }
        const pid = parseInt(String(project), 10);
        if (!pid || Number.isNaN(pid)) { setProjectMembers(null); return; }
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/projects/${pid}/members`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setProjectMembers([]); return; }
        const rows = await res.json();
        const members: TeamMember[] = (Array.isArray(rows) ? rows : []).map((m: any) => ({
          id: m?.user?.id ?? m?.userId ?? m?.id,
          firstName: m?.user?.firstName ?? m?.firstName,
          lastName: m?.user?.lastName ?? m?.lastName,
          email: m?.user?.email ?? m?.email,
        })).filter((m: any) => m && m.id);
        setProjectMembers(members);
        // If current assignee is not in new list, reset to null
        if (assigneeId && !members.some(m => String(m.id) === String(assigneeId))) {
          setAssigneeId(null);
        }
      } catch {
        setProjectMembers([]);
      }
    };
    loadMembers();
  }, [project]);

  // Decide eligible assignees: only project members matter for selection; if none, will auto-assign to current user
  const eligibleAssignees: TeamMember[] = useMemo(() => {
    if (project && projectMembers) return projectMembers;
    return [];
  }, [project, projectMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      project,
      priority,
      dueDate,
      estimatedTime,
      sprintData,
      assigneeId: assigneeId ?? (currentUserId ? String(currentUserId) : null)
    });
  };

  const handleSprintChange = (data: { 
    duration: number; 
    startDate: Date | undefined; 
    endDate: Date | undefined 
  }) => {
    setSprintData(data);
  };

  const renderFullName = (m: TeamMember) => {
    const name = [m.firstName, m.lastName].filter(Boolean).join(" ").trim();
    return name || m.email || `User ${m.id}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="project">Project</Label>
        <Select value={project} onValueChange={(v)=>{ if (lockProjectId) return; setProject(v); }}>
          <SelectTrigger disabled={!!lockProjectId}>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project: any) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assignee selection - show only when selected project has members; otherwise assign to current user */}
      {project && projectMembers && projectMembers.length > 0 ? (
        <div>
          <Label htmlFor="assignee">Assign to</Label>
          <Select 
            value={assigneeId ?? undefined}
            onValueChange={setAssigneeId}
          >
            <SelectTrigger>
              <SelectValue placeholder={project ? "Select project member" : "Select assignee"} />
            </SelectTrigger>
            <SelectContent>
              {eligibleAssignees.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {renderFullName(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {project && projectMembers && projectMembers.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">No members in this project. Add members on the Project page first.</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">This task will be assigned to you.</p>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="estimatedTime">Estimated Time (h)</Label>
          <Input
            id="estimatedTime"
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g., 4.5"
            required
          />
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Sprint Planning</h3>
        <TaskSprintSelector onSprintChange={handleSprintChange} />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
