'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import EventForm from '@/components/calendar/EventForm';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addEvent } from '@/services/events';

const QuickActions = () => {
  const [eventOpen, setEventOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageTo, setMessageTo] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const { toast } = useToast();

  const handleEventSubmit = async (data: any) => {
    console.log('Event data:', data);
    try {
      const taskId = Number(data?.linkTaskId || 0);
      if (taskId && data?.endDate) {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sprintEndDate: new Date(data.endDate).toISOString(),
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to sync task deadline');
        }
      }
      // Persist event locally
      addEvent({
        title: data?.title || 'Untitled Event',
        description: data?.description || '',
        startDate: data?.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
        endDate: data?.endDate ? new Date(data.endDate).toISOString() : undefined,
        startTime: data?.startTime || undefined,
        endTime: data?.endTime || undefined,
        recurrence: data?.recurrence || 'none',
        linkTaskId: data?.linkTaskId ? Number(data.linkTaskId) : undefined,
      });
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
    } catch (e: any) {
      toast({
        title: 'Event created (partial)',
        description: e.message || 'Task sync failed',
      });
    }
    setEventOpen(false);
  };

  const actions = [
    {
      title: 'Create Task',
      description: 'Add a new task to your list',
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-blue-500',
      onClick: () => console.log('Create task'),
    },
    {
      title: 'Schedule Event',
      description: 'Plan a meeting or event',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-green-500',
      onClick: () => setEventOpen(true),
    },
    {
      title: 'New Document',
      description: 'Create a new document',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-purple-500',
      onClick: () => console.log('Create document'),
    },
    {
      title: 'Invite Member',
      description: 'Add someone to your team',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-orange-500',
      onClick: () => console.log('Invite member'),
    },
    {
      title: 'Send Message',
      description: 'Communicate with your team',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-pink-500',
      onClick: () => setMessageOpen(true),
    },
    {
      title: 'View Reports',
      description: 'Check your progress analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-indigo-500',
      onClick: () => console.log('View reports'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                {action.icon}
              </div>
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs text-muted-foreground text-center">
                {action.description}
              </div>
            </Button>
          ))}
        </div>

        <Modal
          open={eventOpen}
          onOpenChange={setEventOpen}
          title="Create New Event"
          size="lg"
        >
          <EventForm
            onSubmit={handleEventSubmit}
            onCancel={() => setEventOpen(false)}
            initialData={{ linkTaskId: 11 }}
          />
        </Modal>

        <Modal
          open={messageOpen}
          onOpenChange={setMessageOpen}
          title="New Message"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="msg-to">
                To
              </label>
              <Input
                id="msg-to"
                placeholder="Name or email (UI only)"
                value={messageTo}
                onChange={(e) => setMessageTo(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="msg-body">
                Message
              </label>
              <Textarea
                id="msg-body"
                rows={4}
                placeholder="Type your message..."
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMessageOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: 'Message sent',
                    description: 'Your message has been sent (demo).',
                  });
                  setMessageOpen(false);
                  setMessageTo('');
                  setMessageBody('');
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
