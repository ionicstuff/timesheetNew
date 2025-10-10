'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Edit,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Modal from '@/components/ui/Modal';
import ClientForm from '@/components/clients/ClientForm';
import ProjectForm from '@/components/projects/ProjectForm';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import TaskAnalytics from '@/components/tasks/TaskAnalytics';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const ClientDetail = () => {
  const { id } = useParams();
  const clientId = useMemo(() => (id ? parseInt(id, 10) : NaN), [id]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [spocs, setSpocs] = useState<any[]>([]);

  // Modals
  const [editOpen, setEditOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [addSpocOpen, setAddSpocOpen] = useState(false);

  // Add/Edit SPOC form state
  const [editingSpocId, setEditingSpocId] = useState<number | null>(null);
  const [spocName, setSpocName] = useState('');
  const [spocEmail, setSpocEmail] = useState('');
  const [spocPhone, setSpocPhone] = useState('');
  const [spocDesignation, setSpocDesignation] = useState('');
  const [spocDepartment, setSpocDepartment] = useState('');
  const [spocIsPrimary, setSpocIsPrimary] = useState(false);
  const { toast } = useToast();
  const [canManageSpocs, setCanManageSpocs] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [spocToDeleteId, setSpocToDeleteId] = useState<number | null>(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Website redesign homepage',
      project: 'Website Redesign',
      dueDate: 'Today',
      priority: 'High' as const,
      completed: false,
      assignedTo: 'Alex Johnson',
    },
    {
      id: 2,
      title: 'Prepare client presentation',
      project: 'Website Redesign',
      dueDate: 'Tomorrow',
      priority: 'Medium' as const,
      completed: false,
    },
    {
      id: 3,
      title: 'Update documentation',
      project: 'Product Launch',
      dueDate: 'In 2 days',
      priority: 'Low' as const,
      completed: true,
    },
    {
      id: 4,
      title: 'Create wireframes',
      project: 'Website Redesign',
      dueDate: 'Next week',
      priority: 'High' as const,
      completed: false,
      assignedTo: 'Sam Smith',
    },
  ]);

  const clientFallback = {
    id: clientId,
    name: 'Client',
    industry: 'Technology',
    logo: 'https://github.com/shadcn.png',
    contact: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, San Francisco, CA 94107',
    website: 'https://acmecorp.com',
    status: 'Active',
    projects: 3,
    tasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    members: 5,
    startDate: 'Jan 15, 2023',
    contractValue: '$125,000',
    lastContact: '2 days ago',
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (!clientId || Number.isNaN(clientId)) return;
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` } as Record<
          string,
          string
        >;

        const [clientRes, projRes, spocRes] = await Promise.all([
          fetch(`/api/clients/${clientId}`, { headers }),
          fetch(`/api/projects?clientId=${clientId}`, { headers }),
          fetch(`/api/spocs/client/${clientId}`, { headers }),
        ]);

        if (clientRes.ok) {
          const cj = await clientRes.json();
          // Support both { success, data } shaped responses and plain objects
          setClient(cj?.data ?? cj ?? null);
        } else setClient(null);
        if (projRes.ok) {
          const pj = await projRes.json();
          const list = Array.isArray(pj)
            ? pj
            : Array.isArray(pj?.projects)
              ? pj.projects
              : [];
          setProjects(list);
        } else setProjects([]);

        if (spocRes.ok) {
          const sj = await spocRes.json();
          const list = Array.isArray(sj?.data)
            ? sj.data
            : Array.isArray(sj)
              ? sj
              : [];
          setSpocs(list);
        } else setSpocs([]);
      } catch (e) {
        setClient(null);
        setProjects([]);
        setSpocs([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [clientId]);

  // Determine SPOC management permission
  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) {
          setCanManageSpocs(false);
          return;
        }
        const me = await meRes.json();
        const u = me?.user || me;
        const roleName = (
          u?.role ||
          u?.roleName ||
          u?.role_master?.roleName ||
          u?.roleMaster?.roleName ||
          ''
        )
          .toString()
          .toLowerCase();
        const roleCode = (
          u?.roleCode ||
          u?.role_master?.roleCode ||
          u?.roleMaster?.roleCode ||
          ''
        )
          .toString()
          .toUpperCase();
        const allowed = new Set([
          'admin',
          'director',
          'account manager',
          'project manager',
        ]);
        setCanManageSpocs(
          allowed.has(roleName) || ['ADM', 'DIR', 'AM', 'PM'].includes(roleCode)
        );
      } catch {
        setCanManageSpocs(false);
      }
    };
    check();
  }, []);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {(
                client?.clientName ||
                client?.name ||
                client?.companyName ||
                'C'
              ).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">
                {client?.clientName ||
                  client?.name ||
                  client?.companyName ||
                  `Client #${clientId}`}
              </h1>
              <Badge
                className={
                  client?.status || client?.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {(client?.status ||
                  (client?.isActive ? 'Active' : 'Inactive')) + ''}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {client?.industry || client?.companyName || '—'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <CreateTaskButton
            label="Add Task"
            overrideProjects={projects.map((p: any) => ({
              id: p.id,
              projectName:
                p.projectName || p.name || p.project_name || `Project #${p.id}`,
            }))}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Overview</CardTitle>
              <CardDescription>Key information and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Projects</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {Array.isArray(projects) ? projects.length : 0}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Active Tasks</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {client?.pendingTasks ?? 0}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="text-sm">Contract Value</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {client?.contractValue ?? '—'}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Last Contact</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {client?.lastContact ?? '—'}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {client?.contact || client?.primaryContact || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${client?.email || ''}`}
                        className="hover:underline"
                      >
                        {client?.email || '—'}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${client?.phone || ''}`}
                        className="hover:underline"
                      >
                        {client?.phone || '—'}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{client?.address || '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Client Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Client Since
                      </span>
                      <span className="text-sm">
                        {client?.startDate || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Projects
                      </span>
                      <span className="text-sm">
                        {Array.isArray(projects) ? projects.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Active Tasks
                      </span>
                      <span className="text-sm">
                        {client?.pendingTasks ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Completed Tasks
                      </span>
                      <span className="text-sm">
                        {client?.completedTasks ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Client Projects</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateProjectOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardTitle>
              <CardDescription>
                Projects associated with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {project.name || project.project_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getStatusColor(
                              project.status || 'active'
                            )}
                          >
                            {(project.status || 'active')
                              .charAt(0)
                              .toUpperCase() +
                              (project.status || 'active').slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Due {project.endDate || project.end_date || '—'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">65%</p>
                          <p className="text-xs text-muted-foreground">
                            Progress
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contacts (SPOCs)</span>
                <div className="flex gap-2">
                  {canManageSpocs && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddSpocOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Spoc
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription>People at the client side</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spocs.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {s.designation || s.department || ''}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingSpocId(s.id);
                          setSpocName(s.name || '');
                          setSpocEmail(s.email || '');
                          setSpocPhone(s.phone || '');
                          setSpocDesignation(s.designation || '');
                          setSpocDepartment(s.department || '');
                          setSpocIsPrimary(!!s.isPrimary);
                          setAddSpocOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSpocToDeleteId(s.id);
                          setConfirmDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {spocs.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No contacts added.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <TaskAnalytics />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Activity</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Alex Johnson"
                    />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Alex Johnson</span>{' '}
                      completed task "Design homepage"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Sam Smith"
                    />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Sam Smith</span> commented
                      on "Meeting notes"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1 day ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Taylor Brown"
                    />
                    <AvatarFallback>TB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Taylor Brown</span> uploaded
                      document "User research.pdf"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 days ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Jordan Lee"
                    />
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Jordan Lee</span> scheduled
                      event "Team meeting"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Files</CardTitle>
              <CardDescription>Documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 text-xs">PDF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Project Requirements
                      </p>
                      <p className="text-xs text-muted-foreground">2.4 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-green-800 text-xs">FIG</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Design Mockups</p>
                      <p className="text-xs text-muted-foreground">5.1 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-800 text-xs">DOC</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meeting Notes</p>
                      <p className="text-xs text-muted-foreground">45 KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Edit Client Modal */}
      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Client"
        size="lg"
      >
        <ClientForm
          onSubmit={async (data: any) => {
            try {
              if (!clientId) return;
              const token = localStorage.getItem('token') || '';
              const statusNorm = (
                data.status ? String(data.status) : client?.status || 'active'
              )
                .toLowerCase()
                .replace(/\s+/g, '_');
              const payload: any = {
                clientName: data.name,
                industry: data.industry || undefined,
                email: data.email || undefined,
                phone: data.phone || undefined,
                address: data.address || undefined,
                website: data.website || undefined,
                status: statusNorm,
                notes: data.notes || undefined,
              };
              const res = await fetch(`/api/clients/${clientId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              const j = await res.json().catch(() => ({}));
              if (!res.ok)
                throw new Error(j?.message || 'Failed to update client');
              setEditOpen(false);
              // Refresh client
              try {
                const r = await fetch(`/api/clients/${clientId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const cj = await r.json().catch(() => null);
                setClient(cj?.data ?? cj ?? null);
              } catch {}
              toast({ title: 'Client updated' });
            } catch (e: any) {
              toast({
                title: 'Error',
                description: e.message || 'Failed to update client',
                variant: 'destructive',
              });
            }
          }}
          onCancel={() => setEditOpen(false)}
          initialData={
            client
              ? {
                  name: client.clientName || client.name || client.companyName,
                  industry: client.industry,
                  email: client.email,
                  phone: client.phone,
                  address: client.address,
                  website: client.website,
                  status:
                    (client.status ||
                      (client.isActive ? 'Active' : 'Inactive')) + '',
                  notes: client.notes,
                }
              : undefined
          }
        />
      </Modal>

      {/* Create Project Modal */}
      <Modal
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        title="Add Project"
        size="xl"
      >
        <ProjectForm
          lockClientId={clientId}
          onSubmit={async (data: any) => {
            try {
              const token = localStorage.getItem('token') || '';
              const payload: any = {
                name: data.name,
                description: data.description || undefined,
                clientId: data.clientId ? Number(data.clientId) : clientId,
                spocId: data.spocId ? Number(data.spocId) : undefined,
                managerId: data.managerId ? Number(data.managerId) : undefined,
                startDate: data.startDate || undefined,
                endDate: data.endDate || undefined,
                estimatedTime: data.estimatedTime
                  ? Number(data.estimatedTime)
                  : undefined,
                isActive:
                  typeof data.isActive === 'boolean' ? data.isActive : true,
              };
              const res = await fetch(`/api/projects`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              const j = await res.json().catch(() => ({}));
              if (!res.ok)
                throw new Error(j?.message || 'Failed to create project');
              setCreateProjectOpen(false);
              // Refresh projects
              try {
                const projRes = await fetch(
                  `/api/projects?clientId=${clientId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const pj = await projRes.json().catch(() => ({}));
                const list = Array.isArray(pj)
                  ? pj
                  : Array.isArray(pj?.projects)
                    ? pj.projects
                    : [];
                setProjects(list);
              } catch {}
              toast({ title: 'Project created' });
            } catch (e: any) {
              toast({
                title: 'Error',
                description: e.message || 'Failed to create project',
                variant: 'destructive',
              });
            }
          }}
          onCancel={() => setCreateProjectOpen(false)}
          initialData={{ clientId }}
        />
      </Modal>

      {/* Add SPOC Modal */}
      <Modal
        open={addSpocOpen}
        onOpenChange={(v) => {
          setAddSpocOpen(v);
          if (!v) {
            setEditingSpocId(null);
          }
        }}
        title={editingSpocId ? 'Edit SPOC' : 'Add SPOC'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={spocName}
              onChange={(e) => setSpocName(e.target.value)}
              placeholder="Alice"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={spocEmail}
              onChange={(e) => setSpocEmail(e.target.value)}
              placeholder="alice@example.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={spocPhone}
              onChange={(e) => setSpocPhone(e.target.value)}
              placeholder="+1-234"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Designation</Label>
              <Input
                value={spocDesignation}
                onChange={(e) => setSpocDesignation(e.target.value)}
                placeholder="Manager"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={spocDepartment}
                onChange={(e) => setSpocDepartment(e.target.value)}
                placeholder="Sales"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrimary"
              checked={spocIsPrimary}
              onCheckedChange={(v) => setSpocIsPrimary(!!v)}
            />
            <Label htmlFor="isPrimary">Primary contact</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddSpocOpen(false);
                setEditingSpocId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (!spocName || !spocEmail) {
                    toast({
                      title: 'Provide name and email',
                      variant: 'destructive',
                    });
                    return;
                  }
                  const token = localStorage.getItem('token') || '';
                  const url = editingSpocId
                    ? `/api/spocs/${editingSpocId}`
                    : `/api/spocs`;
                  const method = editingSpocId ? 'PUT' : 'POST';
                  const res = await fetch(url, {
                    method,
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      name: spocName,
                      email: spocEmail,
                      phone: spocPhone || undefined,
                      designation: spocDesignation || undefined,
                      department: spocDepartment || undefined,
                      clientId: clientId,
                      isPrimary: spocIsPrimary,
                    }),
                  });
                  const j = await res.json().catch(() => ({}));
                  if (!res.ok)
                    throw new Error(
                      j?.message ||
                        (editingSpocId
                          ? 'Failed to update SPOC'
                          : 'Failed to add SPOC')
                    );
                  setAddSpocOpen(false);
                  setEditingSpocId(null);
                  setSpocName('');
                  setSpocEmail('');
                  setSpocPhone('');
                  setSpocDesignation('');
                  setSpocDepartment('');
                  setSpocIsPrimary(false);
                  // Refresh spocs list
                  try {
                    const spRes = await fetch(`/api/spocs/client/${clientId}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const sj = await spRes.json().catch(() => ({}));
                    const list = Array.isArray(sj?.data)
                      ? sj.data
                      : Array.isArray(sj)
                        ? sj
                        : [];
                    setSpocs(list);
                  } catch {}
                  toast({
                    title: editingSpocId ? 'SPOC updated' : 'SPOC added',
                  });
                } catch (e: any) {
                  toast({
                    title: 'Error',
                    description: e.message || 'Operation failed',
                    variant: 'destructive',
                  });
                }
              }}
            >
              {editingSpocId ? 'Save Changes' : 'Add SPOC'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm delete SPOC */}
      <Modal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Remove SPOC"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to remove this SPOC from the client?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setSpocToDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  if (!spocToDeleteId) return;
                  const token = localStorage.getItem('token') || '';
                  const res = await fetch(`/api/spocs/${spocToDeleteId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const j = await res.json().catch(() => ({}));
                  if (!res.ok)
                    throw new Error(j?.message || 'Failed to remove SPOC');
                  setConfirmDeleteOpen(false);
                  setSpocToDeleteId(null);
                  // Refresh SPOCs
                  try {
                    const spRes = await fetch(`/api/spocs/client/${clientId}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const sj = await spRes.json().catch(() => ({}));
                    const list = Array.isArray(sj?.data)
                      ? sj.data
                      : Array.isArray(sj)
                        ? sj
                        : [];
                    setSpocs(list);
                  } catch {}
                  toast({ title: 'SPOC removed' });
                } catch (e: any) {
                  toast({
                    title: 'Error',
                    description: e.message || 'Failed to remove SPOC',
                    variant: 'destructive',
                  });
                }
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientDetail;
