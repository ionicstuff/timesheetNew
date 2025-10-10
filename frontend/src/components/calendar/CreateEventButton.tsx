'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import EventForm from '@/components/calendar/EventForm';
import { useToast } from '@/hooks/use-toast';

const CreateEventButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    console.log('Event data:', data);
    // In a real app, you would save this to your database
    try {
      // Optional: sync linked task deadline to event endDate
      const taskId = Number(data?.linkTaskId || 0);
      if (taskId && data?.endDate) {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dueDate: new Date(data.endDate).toISOString(),
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to sync task deadline');
        }
      }
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
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Event
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create New Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          initialData={{ linkTaskId: 11 }}
        />
      </Modal>
    </>
  );
};

export default CreateEventButton;
