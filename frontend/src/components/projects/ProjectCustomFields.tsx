"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select";
  value: string;
  options?: string[];
}

interface ProjectCustomFieldsProps {
  customFields: CustomField[];
  onCustomFieldsChange: (fields: CustomField[]) => void;
}

const ProjectCustomFields = ({ customFields, onCustomFieldsChange }: ProjectCustomFieldsProps) => {
  const [newField, setNewField] = useState({
    name: "",
    type: "text" as "text" | "number" | "date" | "select",
    value: "",
    options: [""]
  });

  const addField = () => {
    if (newField.name.trim()) {
      const field: CustomField = {
        id: Date.now().toString(),
        name: newField.name,
        type: newField.type,
        value: newField.value,
        ...(newField.type === "select" && { options: newField.options.filter(opt => opt.trim()) })
      };
      
      onCustomFieldsChange([...customFields, field]);
      setNewField({
        name: "",
        type: "text",
        value: "",
        options: [""]
      });
    }
  };

  const removeField = (id: string) => {
    onCustomFieldsChange(customFields.filter(field => field.id !== id));
  };

  const updateFieldValue = (id: string, value: string) => {
    onCustomFieldsChange(
      customFields.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const addOption = () => {
    setNewField({
      ...newField,
      options: [...(newField.options || []), ""]
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(newField.options || [])];
    newOptions[index] = value;
    setNewField({ ...newField, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(newField.options || [])];
    newOptions.splice(index, 1);
    setNewField({ ...newField, options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Custom Fields</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setNewField({
            name: "",
            type: "text",
            value: "",
            options: [""]
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>
      
      {newField.name !== "" && (
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label htmlFor="field-name">Field Name</Label>
            <Input
              id="field-name"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              placeholder="e.g., Budget, Client Type"
            />
          </div>
          
          <div>
            <Label htmlFor="field-type">Field Type</Label>
            <Select 
              value={newField.type} 
              onValueChange={(value: "text" | "number" | "date" | "select") => 
                setNewField({ ...newField, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {newField.type === "select" && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {newField.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addOption}
                >
                  + Add Option
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewField({
                name: "",
                type: "text",
                value: "",
                options: [""]
              })}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addField}>
              Add Field
            </Button>
          </div>
        </div>
      )}
      
      {customFields.length > 0 && (
        <div className="space-y-3">
          {customFields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">{field.name}</Label>
                {field.type === "select" ? (
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => updateFieldValue(field.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCustomFields;