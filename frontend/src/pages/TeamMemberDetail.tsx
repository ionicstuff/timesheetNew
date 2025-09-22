"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Edit
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskList from "@/components/tasks/TaskList";
import TeamCollaboration from "@/components/team/TeamCollaboration";

interface ApiUserDetail {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  isActive?: boolean;
  profilePicture?: string;
}

const TeamMemberDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<ApiUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.message || `Failed to load user (${res.status})`);
        }
        const j = await res.json();
        setData(j?.data || null);
      } catch (e: any) {
        setError(e.message || 'Request failed');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const member = useMemo(() => {
    const fullName = `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim();
    return {
      id: data?.id || 0,
      name: fullName || data?.email || (id ? `User #${id}` : 'User'),
      role: data?.designation || '—',
      email: data?.email || '',
      phone: data?.phone || '',
      location: '—',
      status: (data?.isActive ? 'online' : 'offline') as 'online'|'away'|'offline',
      tasks: 0,
      projects: 0,
      avatar: data?.profilePicture || `https://i.pravatar.cc/150?u=${data?.id || id}`,
      bio: ''
    };
  }, [data, id]);

  const tasks = [
    // Placeholder until tasks-by-user endpoint is wired
  ];

  const getStatusColor = () => {
    switch (member.status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    return member.status.charAt(0).toUpperCase() + member.status.slice(1);
  };

  if (loading) return <div className="p-4">Loading member...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${getStatusColor()}`}></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">{member.role}</p>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 mt-1">
              {getStatusText()}
            </span>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
              <CardDescription>About this team member</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {member.bio || 'No biography available.'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assigned Tasks</span>
                <span className="text-sm text-muted-foreground">{member.tasks} tasks</span>
              </CardTitle>
              <CardDescription>Tasks assigned to this member</CardDescription>
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
                  <TaskList tasks={tasks as any[]} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Team Chat
              </CardTitle>
              <CardDescription>Communicate with this member</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamCollaboration />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How to reach this member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${member.email}`} className="text-sm hover:underline">
                      {member.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="text-sm hover:underline">
                      {member.phone || '—'}
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Projects this member is involved in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium text-sm">No linked projects yet</p>
                      <p className="text-xs text-muted-foreground">—</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Recent activity and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tasks Completed</span>
                    <span>—</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetail;
