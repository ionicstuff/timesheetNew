"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignee?: string;
}

interface ProjectChecklistsProps {
  checklists: Array<{
    id: string;
    name: string;
    items: ChecklistItem[];
  }>;
  teamMembers: Array<{ id: string; name: string }>;
  onChecklistsChange: (checklists: Array<{
    id: string;
    name: string;
    items: ChecklistItem[];
  }>) => void;
}

const ProjectChecklists = ({ checklists, teamMembers, onChecklistsChange }: ProjectChecklistsProps) => {
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);

  const addChecklist = () => {
    if (newChecklistName.trim()) {
      const newChecklist = {
        id: Date.now().toString(),
        name: newChecklistName,
        items: []
      };
      
      onChecklistsChange([...checklists, newChecklist]);
      setNewChecklistName("");
    }
  };

  const removeChecklist = (id: string) => {
    onChecklistsChange(checklists.filter(checklist => checklist.id !== id));
  };

  const addItem = () => {
    if (selectedChecklist && newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText,
        completed: false
      };
      
      onChecklistsChange(
        checklists.map(checklist => 
          checklist.id === selectedChecklist 
            ? { ...checklist, items: [...checklist.items, newItem] } 
            : checklist
        )
      );
      
      setNewItemText("");
    }
  };

  const removeItem = (checklistId: string, itemId: string) => {
    onChecklistsChange(
      checklists.map(checklist => 
        checklist.id === checklistId 
          ? { ...checklist, items: checklist.items.filter(item => item.id !== itemId) } 
          : checklist
      )
    );
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    onChecklistsChange(
      checklists.map(checklist => 
        checklist.id === checklistId 
          ? { 
              ...checklist, 
              items: checklist.items.map(item => 
                item.id === itemId 
                  ? { ...item, completed: !item.completed } 
                  : item
              ) 
            } 
          : checklist
      )
    );
  };

  const assignItem = (checklistId: string, itemId: string, assigneeId: string) => {
    onChecklistsChange(
      checklists.map(checklist => 
        checklist.id === checklistId 
          ? { 
              ...checklist, 
              items: checklist.items.map(item => 
                item.id === itemId 
                  ? { ...item, assignee: assigneeId } 
                  : item
              ) 
            } 
          : checklist
      )
    );
  };

  const getAssigneeName = (assigneeId: string) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : "Unassigned";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Checklists</h3>
        <div className="flex gap-2">
          <Input
            value={newChecklistName}
            onChange={(e) => setNewChecklistName(e.target.value)}
            placeholder="New checklist name"
            className="h-8 w-40"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={addChecklist}
            disabled={!newChecklistName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {checklists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No checklists yet</p>
          <p className="text-sm mt-1">Add a checklist to break down your project into tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checklists.map((checklist) => (
            <div key={checklist.id} className="border rounded-lg">
              <div className="flex items-center justify-between p-3 border-b">
                <h4 className="font-medium">{checklist.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {checklist.items.filter(item => item.completed).length}/{checklist.items.length}
                  </Badge>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeChecklist(checklist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3 space-y-2">
                {checklist.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-move" />
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(checklist.id, item.id)}
                    />
                    <span className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                      {item.text}
                    </span>
                    <Select 
                      value={item.assignee || ""} 
                      onValueChange={(value) => assignItem(checklist.id, item.id, value)}
                    >
                      <SelectTrigger className="h-7 w-28">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      onClick={() => removeItem(checklist.id, item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <Input
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Add an item"
                    className="h-8 flex-1"
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={addItem}
                    disabled={!newItemText.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectChecklists;