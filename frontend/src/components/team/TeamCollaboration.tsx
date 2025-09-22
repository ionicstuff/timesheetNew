"use client";

import { useEffect, useState } from "react";
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

type ChatMessage = {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; firstName?: string; lastName?: string; email?: string } | null;
  attachments?: { id: number; originalName: string; filePath: string }[];
};

const TeamCollaboration = ({ projectId }: { projectId: number }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/projects/${projectId}/messages?limit=100`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch {}
  };

  useEffect(() => {
    if (!projectId) return;
    void loadMessages();
    const id = setInterval(loadMessages, 10000);
    return () => clearInterval(id);
  }, [projectId]);

  const handleSendMessage = async () => {
    const content = message.trim();
    if (!content) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/projects/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to send');
      setMessages(prev => [...prev, data]);
      setMessage("");
    } catch (e) {
      // swallow error for now or show toast via prop later
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
        {messages.map((msg) => {
          const name = msg.author ? [msg.author.firstName, msg.author.lastName].filter(Boolean).join(' ') || msg.author.email || 'User' : 'User';
          const initials = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
          const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={msg.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-muted-foreground">{time}</span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{msg.content}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {msg.attachments.map(a => (
                          <a key={a.id} href={`/${a.filePath}`} target="_blank" rel="noreferrer" className="underline">{a.originalName}</a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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