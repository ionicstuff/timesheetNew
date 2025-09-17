"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";

const GlobalSearch = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
  };

  return (
    <div className="relative w-64">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks, projects, docs..."
          className="w-full rounded-md bg-muted pl-8 pr-8 py-2 text-sm"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {localSearchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1.5 h-5 w-5"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {isOpen && localSearchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
          <div className="p-2 text-sm text-muted-foreground">
            Search results for "{localSearchTerm}"
          </div>
          <div className="max-h-60 overflow-y-auto">
            {/* This would be populated with search results in a real implementation */}
            <div className="p-2 text-sm">No results found</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;