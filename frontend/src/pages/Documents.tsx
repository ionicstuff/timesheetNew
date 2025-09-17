"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DocumentCard from "@/components/documents/DocumentCard";
import CreateDocumentButton from "@/components/documents/CreateDocumentButton";
import DocumentFilter from "@/components/documents/DocumentFilter";

const Documents = () => {
  const folders = [
    { id: 1, name: "Design Assets", type: "folder", updatedAt: "2 days ago", items: 12 },
    { id: 2, name: "Research", type: "folder", updatedAt: "1 week ago", items: 8 },
    { id: 3, name: "Client Docs", type: "folder", updatedAt: "3 days ago", items: 15 },
  ];

  const documents = [
    { id: 1, name: "Project Requirements", type: "doc", updatedAt: "Today" },
    { id: 2, name: "Meeting Notes", type: "txt", updatedAt: "Yesterday" },
    { id: 3, name: "Design Mockups", type: "pdf", updatedAt: "2 days ago" },
    { id: 4, name: "User Research", type: "doc", updatedAt: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <CreateDocumentButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full rounded-md border pl-8 pr-4 py-2"
          />
        </div>
        <DocumentFilter />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Folders</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <DocumentCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              type={folder.type}
              updatedAt={folder.updatedAt}
              isFolder={true}
              items={folder.items}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
        <div className="border rounded-lg">
          <div className="border-b p-4 font-medium">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-1"></div>
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-2">Last Updated</div>
            </div>
          </div>
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-muted/50 cursor-pointer">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <DocumentCard
                      id={doc.id}
                      name={doc.name}
                      type={doc.type}
                      updatedAt={doc.updatedAt}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;