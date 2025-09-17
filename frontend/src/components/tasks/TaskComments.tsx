"use client";

import { useState } from "react";
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

const TaskComments = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      content: "I've reviewed the design and it looks great! Just a few minor adjustments needed.",
      time: "2 hours ago",
      likes: 3,
      liked: false
    },
    {
      id: 2,
      user: "Sam Smith",
      avatar: "https://i.pravatar.cc/150?u=sam",
      content: "Thanks for the feedback! I'll make those adjustments by tomorrow.",
      time: "1 hour ago",
      likes: 1,
      liked: true
    },
    {
      id: 3,
      user: "Taylor Brown",
      avatar: "https://i.pravatar.cc/150?u=taylor",
      content: "I've attached the updated mockups with the requested changes.",
      time: "30 minutes ago",
      likes: 0,
      liked: false,
      attachments: ["updated-mockups.pdf"]
    }
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "You",
        avatar: "https://github.com/shadcn.png",
        content: comment,
        time: "Just now",
        likes: 0,
        liked: false
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleLikeComment = (id: number) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } 
        : comment
    ));
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