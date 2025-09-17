"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import EventForm from "@/components/calendar/EventForm";
import { useToast } from "@/hooks/use-toast";

const CreateEventButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log("Event data:", data);
    // In a real app, you would save this to your database
    toast({
      title: "Event created",
      description: "Your event has been created successfully."
    });
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
        />
      </Modal>
    </>
  );
};

export default CreateEventButton;