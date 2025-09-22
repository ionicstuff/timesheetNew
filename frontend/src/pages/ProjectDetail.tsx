"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Users, 
  Flag,
  BarChart3,
  Edit,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaskList from "@/components/tasks/TaskList";
import TeamCollaboration from "@/components/team/TeamCollaboration";
import TaskAnalytics from "@/components/tasks/TaskAnalytics";
import TaskTemplates from "@/components/tasks/TaskTemplates";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import ProjectSprintVisualization from "@/components/projects/ProjectSprintVisualization";
import ProjectSprintCalendar from "@/components/projects/ProjectSprintCalendar";
import ProjectForm from "@/components/projects/ProjectForm";

const ProjectDetail = () => {
  const { id } = useParams();
  const projectId = useMemo(() => (id ? parseInt(id, 10) : NaN), [id]);

  const [tasks, setTasks] = useState<any[]>([]);
  const [project, setProject] = useState<any | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const SEARCH_USER_VALUE = "__search_user__";
  const { toast } = useToast();

  // Fetch project details, tasks, and files
  useEffect(() => {
    const run = async () => {
      if (!projectId || Number.isNaN(projectId)) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` } as Record<string,string>;

        const [projRes, tasksRes, filesRes, membersRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`, { headers }),
          fetch(`/api/tasks/project/${projectId}`, { headers }),
          fetch(`/api/projects/${projectId}/files`, { headers }),
          fetch(`/api/projects/${projectId}/members`, { headers }),
        ]);

        if (projRes.ok) {
          const proj = await projRes.json();
          setProject(proj);
        } else {
          setProject(null);
        }

        if (tasksRes.ok) {
          const t = await tasksRes.json();
          // Map tasks to TaskList shape
          const mapped = (Array.isArray(t) ? t : []).map((task: any) => ({
            id: task.id,
            title: task.name || task.title || 'Untitled Task',
            project: typeof task.project === 'string' ? task.project : (task.project?.projectName || `Project #${task.projectId ?? ''}`),
            dueDate: task.sprintEndDate ? new Date(task.sprintEndDate).toLocaleDateString() : (task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'),
            priority: (['High','Medium','Low'].includes(String(task.priority))) ? task.priority : 'Medium',
            completed: String(task.status || '').toLowerCase() === 'completed',
            assignedTo: task.assignee ? `${task.assignee.firstName ?? ''} ${task.assignee.lastName ?? ''}`.trim() || task.assignee.email : task.assignedTo
          }));
          setTasks(mapped);
        } else {
          setTasks([]);
        }

        if (filesRes.ok) {
          const f = await filesRes.json();
          setFiles(Array.isArray(f) ? f : []);
        } else {
          setFiles([]);
        }

        if (membersRes.ok) {
          const m = await membersRes.json();
          setMembers(Array.isArray(m) ? m : []);
        } else {
          setMembers([]);
        }
      } catch (e) {
        console.error('Failed to load project detail', e);
        setTasks([]);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [projectId]);

  // Fetch project users when opening add modal
  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (!addOpen) return;
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/projects/users`, { headers: { Authorization: `Bearer ${token}` } });
        setAllUsers(res.ok ? await res.json() : []);
      } catch {
        setAllUsers([]);
      }
    };
    loadUsers();
  }, [addOpen]);

  // Reload helpers for post-actions
  const reloadProject = async () => {
    if (!projectId || Number.isNaN(projectId)) return;
    try {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` } as Record<string,string>;
      const projRes = await fetch(`/api/projects/${projectId}`, { headers });
      if (projRes.ok) setProject(await projRes.json());
    } catch (e) { console.error('reloadProject failed', e); }
  };

  const reloadTasks = async () => {
    if (!projectId || Number.isNaN(projectId)) return;
    try {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` } as Record<string,string>;
      const tasksRes = await fetch(`/api/tasks/project/${projectId}`, { headers });
      if (tasksRes.ok) {
        const t = await tasksRes.json();
        const mapped = (Array.isArray(t) ? t : []).map((task: any) => ({
          id: task.id,
          title: task.name || task.title || 'Untitled Task',
          project: typeof task.project === 'string' ? task.project : (task.project?.projectName || `Project #${task.projectId ?? ''}`),
          dueDate: task.sprintEndDate ? new Date(task.sprintEndDate).toLocaleDateString() : (task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'),
          priority: (['High','Medium','Low'].includes(String(task.priority))) ? task.priority : 'Medium',
          completed: String(task.status || '').toLowerCase() === 'completed',
          assignedTo: task.assignee ? `${task.assignee.firstName ?? ''} ${task.assignee.lastName ?? ''}`.trim() || task.assignee.email : task.assignedTo
        }));
        setTasks(mapped);
      }
    } catch (e) { console.error('reloadTasks failed', e); }
  };

  // Mock sprint data
  const sprints = [
    {
      id: 1,
      title: "Sprint 1: Planning",
      startDate: new Date(2023, 9, 1),
      endDate: new Date(2023, 9, 7),
      duration: 2,
      tasks: 5,
      completed: 5,
      status: "completed" as const
    },
    {
      id: 2,
      title: "Sprint 2: Design",
      startDate: new Date(2023, 9, 8),
      endDate: new Date(2023, 9, 21),
      duration: 3,
      tasks: 8,
      completed: 6,
      status: "in-progress" as const
    },
    {
      id: 3,
      title: "Sprint 3: Development",
      startDate: new Date(2023, 9, 22),
      endDate: new Date(2023, 10, 11),
      duration: 2.5,
      tasks: 10,
      completed: 0,
      status: "planned" as const
    },
    {
      id: 4,
      title: "Sprint 4: Testing",
      startDate: new Date(2023, 10, 12),
      endDate: new Date(2023, 10, 14),
      duration: 1,
      tasks: 4,
      completed: 0,
      status: "planned" as const
    }
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task: any) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-6 text-red-500">Project not found.</div>;
  }

  // Derive some UI-friendly data
  const membersList = (members || []).map((m: any) => ({
    name: [m?.user?.firstName, m?.user?.lastName].filter(Boolean).join(' ') || m?.user?.email || 'Member',
    role: m?.projectRole || m?.user?.designation || 'Team Member',
    avatar: undefined as string | undefined,
  }));

  const membersCount = Array.isArray(members) ? members.length : 0;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-4 w-4 rounded-full ${project.color}`}></div>
            <h1 className="text-2xl font-bold">{project.name || project.project_name}</h1>
            <Badge className={getStatusColor(project.status || 'active')}>
              {(project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-3xl">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Key metrics and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Progress</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{progress}%</div>
                    <Progress value={progress} className="mt-2" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{completedTasks}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{tasks.length - completedTasks}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">Members</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{membersCount}</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{(project.startDate || project.start_date) ?? '—'} - {(project.dueDate || project.end_date) ?? '—'}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Key Dates</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Design Phase</span>
                      <span className="text-muted-foreground">Nov 15, 2023</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Development</span>
                      <span className="text-muted-foreground">Nov 20 - Dec 10, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ProjectSprintCalendar sprints={sprints} />
          
          <ProjectSprintVisualization sprints={sprints} />
          
          {/* Edit Project Modal */}
          <Modal open={editOpen} onOpenChange={setEditOpen} title="Edit Project" size="xl">
            <ProjectForm
              onSubmit={async (data: any) => {
                try {
                  if (!projectId || Number.isNaN(projectId)) return;
                  const token = localStorage.getItem('token') || '';
                  const payload: any = {
                    name: data.name,
                    description: data.description || undefined,
                    clientId: data.clientId ? Number(data.clientId) : undefined,
                    managerId: data.managerId ? Number(data.managerId) : undefined,
                    startDate: data.startDate || undefined,
                    endDate: data.endDate || undefined,
                    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
                  };
                  const res = await fetch(`/api/projects/${projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                  });
                  const j = await res.json().catch(()=>({}));
                  if (!res.ok) throw new Error(j?.message || 'Failed to update project');
                  setEditOpen(false);
                  await reloadProject();
                  toast({ title: 'Project updated' });
                } catch (e: any) {
                  toast({ title: 'Error', description: e.message || 'Failed to update project', variant: 'destructive' });
                }
              }}
              onCancel={() => setEditOpen(false)}
              initialData={project ? {
                name: project.name || project.project_name,
                description: project.description,
                clientId: project.client?.id,
                // spocId intentionally omitted (backend update not supported here)
                managerId: project.manager?.id,
                startDate: project.startDate ? new Date(project.startDate) : (project.start_date ? new Date(project.start_date) : undefined),
                dueDate: project.endDate ? new Date(project.endDate) : (project.end_date ? new Date(project.end_date) : undefined),
                isActive: project.isActive,
              } : undefined}
            />
          </Modal>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Tasks</span>
                <div className="flex gap-2">
                  <CreateTaskButton
                    defaultProjectId={projectId}
                    lockProjectId={projectId}
                    overrideProjects={[{ id: projectId, projectName: project.name || project.project_name }]}
                    onSuccess={async () => { await reloadTasks(); await reloadProject(); }}
                  />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Tasks related to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="border-b p-4 font-medium">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Task</div>
                    <div className="col-span-2">Project</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-1">Priority</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="divide-y">
                  <TaskList tasks={tasks} variant="row" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TaskAnalytics />
          
          <TaskTemplates />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {membersList.map((member: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>

              {/* Add Member Modal */}
              <Modal open={addOpen} onOpenChange={setAddOpen} title="Add Project Member" size="md">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">User</Label>
                    <Select value={selectedUserId || undefined} onValueChange={(v)=>{
                      if (v === SEARCH_USER_VALUE) { setOpenSearchUser(true); return; }
                      setSelectedUserId(v);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {allUsers.map((u: any) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}
                          </SelectItem>
                        ))}
                        <SelectItem value={SEARCH_USER_VALUE}>🔎 Search users…</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="pm">Project Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button onClick={async () => {
                      try {
                        if (!selectedUserId) { toast({ title: 'Select a user', variant: 'destructive' }); return; }
                        const token = localStorage.getItem('token') || '';
                        const res = await fetch(`/api/projects/${projectId}/members`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ userId: Number(selectedUserId), projectRole: selectedRole })
                        });
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          throw new Error(data.message || 'Failed to add member');
                        }
                        setAddOpen(false);
                        setSelectedUserId('');
                        setSelectedRole('member');
                        await (async () => {
                          const memRes = await fetch(`/api/projects/${projectId}/members`, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } });
                          if (memRes.ok) setMembers(await memRes.json());
                        })();
                        toast({ title: 'Member added' });
                      } catch (e: any) {
                        toast({ title: 'Error', description: e.message, variant: 'destructive' });
                      }
                    }}>Add</Button>
                  </div>
                </div>
              </Modal>

              {/* Search users modal */}
              <Modal open={openSearchUser} onOpenChange={setOpenSearchUser} title="Search Users" size="lg">
                <QuickSearchUser onPick={(u)=>{
                  if (!allUsers.some((x:any)=> String(x.id) === String(u.id))) {
                    setAllUsers(prev => [...prev, { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email }]);
                  }
                  setSelectedUserId(String(u.id));
                  setOpenSearchUser(false);
                }} />
              </Modal>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Important documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.length === 0 && (
                  <p className="text-sm text-muted-foreground">No files uploaded.</p>
                )}
                {files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 text-xs">{String(file.file_type || file.filename || 'FILE').slice(0,3).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.original_name || file.filename}</p>
                        <p className="text-xs text-muted-foreground">{file.file_size ? `${Math.round(file.file_size/1024)} KB` : ''}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <a href={`/${file.file_path}`} target="_blank" rel="noreferrer">Open</a>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <input id="fileUpload" type="file" multiple accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
                  try {
                    const token = localStorage.getItem('token') || '';
                    const filesSel = e.target.files;
                    if (!filesSel || filesSel.length === 0) return;
                    const formData = new FormData();
                    for (let i=0;i<filesSel.length;i++) formData.append('file', filesSel[i]);
                    const res = await fetch(`/api/projects/${projectId}/files`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
                    if (!res.ok) {
                      const data = await res.json().catch(()=>({}));
                      throw new Error(data?.message || 'Failed to upload files. Allowed: PDF/DOC/DOCX/ZIP/JPG/PNG up to 10MB each.');
                    }
                    const refreshed = await fetch(`/api/projects/${projectId}/files`, { headers: { Authorization: `Bearer ${token}` } });
                    setFiles(refreshed.ok ? await refreshed.json() : files);
                  } catch (err: any) {
                    toast({ title: 'Upload failed', description: err?.message || 'Please try again.', variant: 'destructive' });
                  } finally {
                    (e.target as HTMLInputElement).value = '';
                  }
                }} />
                <label htmlFor="fileUpload">
                  <Button className="w-full" variant="outline" asChild>
                    <span><Plus className="h-4 w-4 mr-2" /> Upload File</span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Team chat */}
          <TeamCollaboration projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

function QuickSearchUser({ onPick }: { onPick: (u: { id:number, firstName?:string, lastName?:string, email?:string })=>void }){
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const search = async (query: string) => {
    try{
      setBusy(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(()=>({}));
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setResults(list);
    }catch{ setResults([]); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Search</Label>
        <Input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Type a name or email" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); search(q); } }} />
        <div className="flex justify-end mt-2">
          <Button size="sm" disabled={!q || busy} onClick={()=>search(q)}>Search</Button>
        </div>
      </div>
      <div className="max-h-64 overflow-auto border rounded">
        {results.length === 0 && <p className="p-3 text-sm text-muted-foreground">{busy ? 'Searching…' : 'No results'}</p>}
        {results.map((u)=>{
          const label = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || `User ${u.id}`;
          return (
            <button key={u.id} className="w-full text-left p-3 hover:bg-muted" onClick={()=>onPick(u)}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectDetail;
