"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet-custom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Flag, 
  User, 
  MessageSquare,
  Paperclip,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
}

const TaskDetailSheet = ({ open, onOpenChange, task }: TaskDetailSheetProps) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = () => {
    if (comment.trim()) {
      console.log("Adding comment:", comment);
      // In a real app, you would save this to your database
      toast({
        title: "Comment added",
        description: "Your comment has been added to the task."
      });
      setComment("");
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{task.title}</SheetTitle>
          <SheetDescription>{task.project}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}>
                {task.priority} Priority
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due {task.dueDate}</span>
              </div>
            </div>
            <Button size="sm">
              <Check className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Assignees</h3>
            <div className="flex -space-x-2">
              {task.assignedTo ? (
                <Avatar className="border-2 border-background">
                  <AvatarFallback>
                    {task.assignedTo.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <p className="text-muted-foreground text-sm">No one assigned</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Attachments</h3>
            <div className="flex items-center justify-center border rounded-lg p-8">
              <div className="text-center">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No attachments</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Attachment
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Comments</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="font-medium text-sm">John Doe</div>
                    <p className="text-sm mt-1">
                      This task is almost complete. Just need to review the final design.
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Today at 10:30 AM
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;