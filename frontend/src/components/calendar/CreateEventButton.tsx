'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import EventForm from '@/components/calendar/EventForm';
import { useToast } from '@/hooks/use-toast';
import { addEvent } from '@/services/events';

const CreateEventButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    console.log('Event data:', data);
    try {
      // Optional: sync linked task deadline to event endDate
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
      // Persist event locally for calendar view
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
