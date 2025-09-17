"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Paperclip, 
  Send,
  Smile,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamCollaboration = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      content: "Hey team, I've finished the homepage design. What do you think?",
      time: "10:30 AM",
      reactions: [{ emoji: "👍", count: 3 }]
    },
    {
      id: 2,
      user: "Sam Smith",
      avatar: "https://i.pravatar.cc/150?u=sam",
      content: "Looks great! I especially like the color scheme.",
      time: "10:32 AM",
      reactions: []
    },
    {
      id: 3,
      user: "Taylor Brown",
      avatar: "https://i.pravatar.cc/150?u=taylor",
      content: "I've attached the feedback document with some suggestions.",
      time: "10:35 AM",
      reactions: [{ emoji: "👀", count: 1 }],
      attachments: ["feedback.docx"]
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        avatar: "https://github.com/shadcn.png",
        content: message,
        time: "Just now",
        reactions: []
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b p-4">
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Team Chat
        </h3>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.avatar} alt={msg.user} />
              <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm mt-1">{msg.content}</p>
                {msg.attachments && (
                  <div className="mt-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {msg.attachments.join(", ")}
                    </span>
                  </div>
                )}
              </div>
              {msg.reactions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {msg.reactions.map((reaction, idx) => (
                    <span key={idx} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                      {reaction.emoji} {reaction.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <Button size="icon" variant="outline">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4 mr-1" />
            Emoji
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Attach
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;