"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Paperclip, 
  Send,
  Smile,
  ThumbsUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface Props { taskId: number; }

const TaskComments = ({ taskId }: Props) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const { toast } = useToast();

  const load = async () => {
    if (!taskId) return;
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/tasks/${taskId}/comments`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 403) {
      toast({ title: 'Members only', description: 'Only project members can view comments for this task.', variant: 'destructive' });
      setComments([]);
      return;
    }
    if (res.ok) {
      const rows = await res.json();
      const mapped = (rows || []).map((r: any) => ({
        id: r.id,
        user: r.author ? `${r.author.firstName} ${r.author.lastName}` : 'User',
        avatar: "",
        content: r.content,
        time: new Date(r.created_at || r.createdAt).toLocaleString(),
        likes: r.likes ?? 0,
        liked: !!r.liked
      }));
      setComments(mapped);
    }
  };

  useEffect(() => { load(); }, [taskId]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/tasks/${taskId}/comments`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: comment }) });
      if (res.status === 403) {
        toast({ title: 'Members only', description: 'Only project members can comment on this task.', variant: 'destructive' });
        return;
      }
      if (res.ok) {
        setComment("");
        await load();
      }
    }
  };

  const handleLikeComment = async (id: number) => {
    const token = localStorage.getItem('token') || '';
    const target = comments.find(c => c.id === id);
    if (!target) return;
    const liked = !!target.liked;
    const method = liked ? 'DELETE' : 'POST';
    const res = await fetch(`/api/tasks/${taskId}/comments/${id}/like`, { method, headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setComments(comments.map(c => c.id === id ? { ...c, liked: data.liked, likes: data.likes } : c));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Discuss this task with your team
        </p>
      </div>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.avatar} alt={comment.user} />
              <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">{comment.time}</span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
                {comment.attachments && (
                  <div className="mt-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {comment.attachments.join(", ")}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className={`h-3 w-3 mr-1 ${comment.liked ? "fill-current" : ""}`} />
                  {comment.likes > 0 ? comment.likes : "Like"}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a comment..."
              className="resize-none mb-2"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" onClick={handleAddComment}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;