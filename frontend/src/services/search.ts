export type SearchTask = { id: number; title: string; project: string; dueDate?: string; priority?: 'High'|'Medium'|'Low'; completed?: boolean; assignedTo?: string };
export type SearchProject = { id: number; name: string; description?: string; progress?: number; tasks?: number; members?: number; color?: string; membersList?: string[]; status?: string; dueDate?: string };
export type SearchDocument = { id: number; name: string; type: string; updatedAt?: string; folderName?: string; isFolder?: boolean; items?: number };
export type SearchMember = { id: number; name: string; role?: string; email?: string; status?: 'online'|'offline'; tasks?: number };

export type SearchResults = {
  tasks: SearchTask[];
  projects: SearchProject[];
  documents: SearchDocument[];
  members: SearchMember[];
};

function mockDocuments(): SearchDocument[] {
  return [
    { id: 1, name: 'Design Mockups', type: 'pdf', updatedAt: '2 days ago', folderName: 'Design Assets' },
    { id: 2, name: 'Design Assets', type: 'folder', updatedAt: '1 week ago', items: 8, isFolder: true },
    { id: 3, name: 'User Research', type: 'doc', updatedAt: '1 week ago', folderName: 'Research' },
    { id: 4, name: 'Research', type: 'folder', updatedAt: '1 week ago', items: 8, isFolder: true },
  ];
}

export async function searchAll(term: string): Promise<SearchResults> {
  const q = (term || '').trim().toLowerCase();
  const token = localStorage.getItem('token') || '';

  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const [tasksRes, projectsRes] = await Promise.all([
    fetch(`/api/tasks/my-tasks?limit=50&searchTerm=${encodeURIComponent(term || '')}`, { headers }).catch(() => null),
    fetch(`/api/projects?q=${encodeURIComponent(term || '')}&limit=30`, { headers }).catch(() => null),
  ]);

  let tasks: SearchTask[] = [];
  try {
    if (tasksRes && tasksRes.ok) {
      const rows = await tasksRes.json();
      tasks = (Array.isArray(rows) ? rows : []).map((t: any) => ({
        id: t.id,
        title: t.name || t.title || 'Untitled Task',
        project: typeof t.project === 'string' ? t.project : t.project?.projectName || `Project #${t.projectId ?? ''}`,
        dueDate: t.sprintEndDate ? new Date(t.sprintEndDate).toLocaleDateString() : t.dueDate ? new Date(t.dueDate).toLocaleDateString() : undefined,
        priority: ['High','Medium','Low'].includes(String(t.priority)) ? t.priority : 'Medium',
        completed: String(t.status || '').toLowerCase() === 'completed',
        assignedTo: t.assignee ? `${t.assignee.firstName ?? ''} ${t.assignee.lastName ?? ''}`.trim() || t.assignee.email : undefined,
      }));
    }
  } catch {}

  let projects: SearchProject[] = [];
  try {
    if (projectsRes && projectsRes.ok) {
      const rows = await projectsRes.json();
      const list = Array.isArray(rows) ? rows : rows?.projects || [];
      projects = list.map((p: any) => ({
        id: p.id,
        name: p.name || p.project_name,
        description: p.description,
        progress: p.progress ?? 0,
        tasks: p.tasksCount ?? p.tasks ?? 0,
        members: p.membersCount ?? p.members ?? 0,
        color: p.color || 'bg-gray-400',
        membersList: p.membersList || [],
        status: p.status || 'active',
        dueDate: p.endDate ? new Date(p.endDate).toLocaleDateString() : undefined,
      }));
    }
  } catch {}

  // Documents are mocked client-side for now; include folderName matching (e.g., Research)
  const documentsAll = mockDocuments();
  const documents = documentsAll.filter((d) => !q || (d.name || '').toLowerCase().includes(q) || (d.folderName || '').toLowerCase().includes(q));

  // Team members mock (could be populated via /api/users later)
  const members: SearchMember[] = [
    { id: 1, name: 'Alex Johnson', role: 'Project Manager', email: 'alex@example.com', status: 'online', tasks: 12 },
    { id: 2, name: 'Sam Smith', role: 'Designer', email: 'sam@example.com', status: 'online', tasks: 8 },
  ].filter((m) => !q || m.name.toLowerCase().includes(q) || (m.role || '').toLowerCase().includes(q));

  return { tasks, projects, documents, members };
}
