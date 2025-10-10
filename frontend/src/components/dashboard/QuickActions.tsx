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

const QuickActions = () => {
  const [eventOpen, setEventOpen] = useState(false);
  const { toast } = useToast();

  const handleEventSubmit = (data: any) => {
    console.log('Event data:', data);
    toast({
      title: 'Event created',
      description: 'Your event has been created successfully.',
    });
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
      onClick: () => console.log('Send message'),
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

        <Modal open={eventOpen} onOpenChange={setEventOpen} title="Create New Event" size="lg">
          <EventForm onSubmit={handleEventSubmit} onCancel={() => setEventOpen(false)} />
        </Modal>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
