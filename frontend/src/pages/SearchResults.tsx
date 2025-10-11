'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileText, CheckCircle, LayoutGrid, Users } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import ProjectCard from '@/components/projects/ProjectCard';
import DocumentCard from '@/components/documents/DocumentCard';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';

const SearchResults = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  // Simulated source data (now includes Research folder and User Research doc)
  const tasks = [
    {
      id: 1,
      title: 'Design homepage',
      project: 'Website Redesign',
      dueDate: 'Today',
      priority: 'High' as const,
      completed: false,
      assignedTo: 'Alex Johnson',
    },
    {
      id: 2,
      title: 'Create wireframes',
      project: 'Website Redesign',
      dueDate: 'In 3 days',
      priority: 'High' as const,
      completed: false,
    },
  ];

  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      progress: 65,
      tasks: 12,
      members: 5,
      color: 'bg-blue-500',
      membersList: ['Alex Johnson', 'Sam Smith', 'Taylor Brown'],
      status: 'active',
      dueDate: 'Dec 15, 2023',
    },
  ];

  const documents = [
    { id: 1, name: 'Design Mockups', type: 'pdf', updatedAt: '2 days ago', folderName: 'Design Assets' },
    {
      id: 2,
      name: 'Design Assets',
      type: 'folder',
      updatedAt: '1 week ago',
      items: 8,
      isFolder: true,
    },
    { id: 3, name: 'User Research', type: 'doc', updatedAt: '1 week ago', folderName: 'Research' },
    {
      id: 4,
      name: 'Research',
      type: 'folder',
      updatedAt: '1 week ago',
      items: 8,
      isFolder: true,
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Project Manager',
      email: 'alex@example.com',
      status: 'online' as const,
      tasks: 12,
    },
    {
      id: 2,
      name: 'Sam Smith',
      role: 'Designer',
      email: 'sam@example.com',
      status: 'online' as const,
      tasks: 8,
    },
  ];

  const term = (searchTerm || '').trim().toLowerCase();

  const tasksFiltered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !term ||
          t.title.toLowerCase().includes(term) ||
          (t.project || '').toLowerCase().includes(term)
      ),
    [term]
  );

  const projectsFiltered = useMemo(
    () =>
      projects.filter(
        (p) =>
          !term ||
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      ),
    [term]
  );

  const documentsFiltered = useMemo(
    () =>
      documents.filter((d: any) => {
        const nameMatch = (d.name || '').toLowerCase().includes(term);
        const folderMatch = (d.folderName || '').toLowerCase().includes(term);
        return !term || nameMatch || folderMatch;
      }),
    [term]
  );

  const membersFiltered = useMemo(
    () =>
      teamMembers.filter(
        (m) =>
          !term ||
          m.name.toLowerCase().includes(term) ||
          (m.role || '').toLowerCase().includes(term)
      ),
    [term]
  );

  const totalCount =
    tasksFiltered.length +
    projectsFiltered.length +
    documentsFiltered.length +
    membersFiltered.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          Found {totalCount} results for "{searchTerm}"
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

      {tasksFiltered.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Tasks</h2>
            <span className="text-sm text-muted-foreground">
              ({tasks.length})
            </span>
          </div>
          <div className="space-y-3">
            {tasksFiltered.map((task) => (
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

      {projectsFiltered.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Projects</h2>
            <span className="text-sm text-muted-foreground">
              ({projects.length})
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsFiltered.map((project) => (
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

      {documentsFiltered.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Documents</h2>
            <span className="text-sm text-muted-foreground">
              ({documents.length})
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentsFiltered.map((doc) => (
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

      {membersFiltered.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Team Members</h2>
            <span className="text-sm text-muted-foreground">
              ({teamMembers.length})
            </span>
          </div>
          <div className="space-y-3">
            {membersFiltered.map((member) => (
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

      {totalCount === 0 && (
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
