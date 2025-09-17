"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DocumentForm from "@/components/documents/DocumentForm";
import { useToast } from "@/hooks/use-toast";

const CreateDocumentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log("Document data:", data);
    // In a real app, you would save this to your database
    toast({
      title: "Document created",
      description: "Your document has been created successfully."
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Document
      </Button>
      
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create New Document"
        size="lg"
      >
        <DocumentForm 
          onSubmit={handleSubmit} 
          onCancel={() => setIsOpen(false)} 
        />
      </Modal>
    </>
  );
};

export default CreateDocumentButton;