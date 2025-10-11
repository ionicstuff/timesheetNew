'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ProjectForm from '@/components/projects/ProjectForm';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectButtonProps {
  onCreated?: () => void;
}

const CreateProjectButton = ({ onCreated }: CreateProjectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token') || '';

      // Map UI form data to backend payload
      const payload: any = {
        name: data.name,
        description: data.description || undefined,
        clientId: data.clientId ? Number(data.clientId) : undefined,
        spocId: data.spocId ? Number(data.spocId) : undefined,
        managerId: data.managerId ? Number(data.managerId) : undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        estimatedTime: data.estimatedTime
          ? Number(data.estimatedTime)
          : undefined,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
        recurrenceActive: data.recurrenceActive || false,
        recurrenceFrequency: data.recurrenceFrequency || undefined,
        recurrenceInterval: data.recurrenceInterval || undefined,
        recurrenceUntil: data.recurrenceUntil || undefined,
      };

      const res = await fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create project');
      }

      toast({
        title: 'Project created',
        description: 'Your project has been created successfully.',
      });
      setIsOpen(false);
      try {
        onCreated && onCreated();
      } catch {}
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create New Project"
        size="xl"
      >
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CreateProjectButton;
