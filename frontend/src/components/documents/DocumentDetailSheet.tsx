"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet-custom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Download,
  Share2,
  Eye,
  MessageSquare,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DocumentDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

const DocumentDetailSheet = ({ open, onOpenChange, document }: DocumentDetailSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{document.name}</SheetTitle>
          <SheetDescription>{document.type.toUpperCase()}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Updated {document.updatedAt}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-muted rounded-lg p-6 inline-block">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Preview not available for this document type
              </p>
              <Button className="mt-2">Open Document</Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Document Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Size</span>
                <span>2.4 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>Oct 12, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Modified</span>
                <span>{document.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{document.type.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Shared With</h3>
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="border-2 border-dashed">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Activity</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">John Doe</span> viewed this document
                  </p>
                  <p className="text-xs text-muted-foreground">Today at 9:30 AM</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Alex Johnson</span> commented
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday at 4:15 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DocumentDetailSheet;