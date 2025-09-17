"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClientContactHistory = () => {
  const contacts = [
    {
      id: 1,
      type: "call",
      user: "Alex Johnson",
      avatar: "https://github.com/shadcn.png",
      title: "Project Update Call",
      description: "Discussed progress on website redesign and upcoming milestones",
      date: "2 hours ago",
      duration: "32 min"
    },
    {
      id: 2,
      type: "email",
      user: "Sam Smith",
      avatar: "https://github.com/shadcn.png",
      title: "Meeting Notes",
      description: "Sent summary of our discussion about design requirements",
      date: "1 day ago",
      duration: null
    },
    {
      id: 3,
      type: "meeting",
      user: "Taylor Brown",
      avatar: "https://github.com/shadcn.png",
      title: "Client Presentation",
      description: "Presented initial wireframes and received feedback",
      date: "2 days ago",
      duration: "1 hour"
    },
    {
      id: 4,
      type: "message",
      user: "Jordan Lee",
      avatar: "https://github.com/shadcn.png",
      title: "Quick Check-in",
      description: "Brief message about timeline adjustments",
      date: "3 days ago",
      duration: null
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "meeting": return <Calendar className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "call": return "bg-blue-100 text-blue-800";
      case "email": return "bg-green-100 text-green-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      case "message": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contact History</span>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Log Contact
          </Button>
        </CardTitle>
        <CardDescription>Recent interactions with this client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50">
              <div className={`p-2 rounded-full ${getTypeColor(contact.type)}`}>
                {getTypeIcon(contact.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{contact.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {contact.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={contact.avatar} alt={contact.user} />
                      <AvatarFallback>{contact.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{contact.user}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {contact.date}
                    {contact.duration && ` • ${contact.duration}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Contact Tips</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Schedule regular check-ins to maintain strong relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Document all important conversations for future reference</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Follow up on action items within 24 hours</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientContactHistory;