"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProjectTagsSelectorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const ProjectTagsSelector = ({ tags, onTagsChange }: ProjectTagsSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
      setIsInputVisible(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Escape") {
      setIsInputVisible(false);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Tags:</span>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setIsInputVisible(true)}
        >
          + Add Tag
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {isInputVisible && (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addTag}
              placeholder="Tag name"
              className="h-8 w-24"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTagsSelector;