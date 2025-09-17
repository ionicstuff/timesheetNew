'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskSchedulerWidget from "@/components/dashboard/TaskSchedulerWidget";
import ProductivityInsights from "@/components/dashboard/ProductivityInsights";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import GoalTracker from "@/components/dashboard/GoalTracker";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, overdue: 0, productivity: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }
        // Use absolute backend URL in dev to avoid proxy mismatch
        const baseUrl = (typeof window !== 'undefined' && window.location && window.location.origin) || '';
        const apiUrl = baseUrl.includes('localhost') ? 'http://localhost:3000' : '';

        const headers = { "Authorization": `Bearer ${token}` } as Record<string,string>;
        const [statsRes, tasksRes] = await Promise.all([
          fetch(`${apiUrl}/api/tasks/stats`, { headers }),
          fetch(`${apiUrl}/api/tasks/my-tasks?upcomingWithinDays=3&limit=5`, { headers })
        ]);

        if (!statsRes.ok) {
          let message = `Failed to fetch task stats (${statsRes.status})`;
          try {
            const data = await statsRes.json();
            if (data?.message) message = data.message;
          } catch {}
          throw new Error(message);
        }
        if (!tasksRes.ok) {
          let message = `Failed to fetch tasks (${tasksRes.status})`;
          try {
            const data = await tasksRes.json();
            if (data?.message) message = data.message;
          } catch {}
          throw new Error(message);
        }

        const statsData = await statsRes.json();
        const fetchedTasks = await tasksRes.json();
        setTasks(fetchedTasks);

        // Use server-side stats for totals/pending/overdue; compute productivity from task list
        const assigned = statsData?.assigned || { total: 0, pending: 0, overdue: 0 };
        const totalTasks = Array.isArray(fetchedTasks) ? fetchedTasks.length : 0;
        const completedTasks = Array.isArray(fetchedTasks)
          ? fetchedTasks.filter((t: any) => String(t?.status || '').toLowerCase() === 'completed').length
          : 0;
        const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({
          total: Number(assigned.total) || 0,
          pending: Number(assigned.pending) || 0,
          overdue: Number(assigned.overdue) || 0,
          productivity,
        });
      } catch (err: any) {
        console.error("Error fetching task stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <CreateTaskButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total.toString()}
          description="+2 from last week"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pending.toString()}
          description="3 due today"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Overdue Tasks"
          value={stats.overdue.toString()}
          description="Requires attention"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Productivity"
          value={`${stats.productivity}%`}
          description="+12% from last week"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="+12%"
        />
      </div>

      <QuickActions />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your tasks due soon</CardDescription>
              </div>
              <a href="/tasks" className="text-sm text-blue-600 hover:underline">View all</a>
            </div>
          </CardHeader>
          <CardContent>
            <TaskList tasks={tasks.slice(0, 5).map((t: any) => ({
              id: t.id,
              title: t.name || t.title || 'Untitled Task',
              project: typeof t.project === 'string' ? t.project : (t.project?.projectName || t.projectName || `Project #${t.projectId ?? ''}`),
              dueDate: t.sprintEndDate ? new Date(t.sprintEndDate).toLocaleDateString() : (t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'),
              priority: (['High','Medium','Low'].includes(String(t.priority))) ? t.priority : 'Medium',
              completed: String(t.status || '').toLowerCase() === 'completed',
              assignedTo: t.assignee ? `${t.assignee.firstName ?? ''} ${t.assignee.lastName ?? ''}`.trim() || t.assignee.email : t.assignedTo
            }))} />
          </CardContent>
        </Card>

        <RecentActivity />
      </div>

      <GoalTracker />

      <TaskSchedulerWidget />

      <ProductivityInsights />

      <Card>
        <CardHeader>
          <CardTitle>Calendar Overview</CardTitle>
          <CardDescription>Your upcoming events and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No events scheduled</h3>
              <p className="text-sm text-muted-foreground">Your calendar is empty for the next 7 days</p>
              <Button className="mt-4">Schedule Event</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
