"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Download, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Printer,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const InvoiceActions = ({ 
  invoiceId, 
  status, 
  onStatusChange,
  onEdit,
  onDelete
}: InvoiceActionsProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoiceId} has been sent to the client.`,
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Downloading PDF",
      description: `Preparing invoice ${invoiceId} for download...`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing Invoice",
      description: `Preparing invoice ${invoiceId} for printing...`,
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email Sent",
      description: `Invoice ${invoiceId} has been emailed to the client.`,
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      onDelete();
      setIsDeleting(false);
      toast({
        title: "Invoice Deleted",
        description: `Invoice ${invoiceId} has been permanently deleted.`,
      });
    }, 500);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        size="sm" 
        onClick={handleSendInvoice}
        disabled={status === "paid" || status === "sent"}
      >
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InvoiceActions;