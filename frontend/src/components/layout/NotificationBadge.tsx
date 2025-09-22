"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotifItem {
  id: number;
  title?: string;
  body?: string;
  link?: string;
  type?: string;
  createdAt?: string;
}

const NotificationBadge = () => {
  const [count, setCount] = useState<number>(0);
  const [items, setItems] = useState<NotifItem[]>([]);

  const load = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const [cRes, lRes] = await Promise.all([
        fetch('/api/notifications/unread-count', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/notifications?unreadOnly=1&limit=5', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (cRes.ok) {
        const j = await cRes.json();
        setCount(Number(j?.count || 0));
      }
      if (lRes.ok) {
        const j = await lRes.json();
        const list = Array.isArray(j?.items) ? j.items : (Array.isArray(j) ? j : []);
        setItems(list);
      }
    } catch { setItems([]); }
  };

  useEffect(() => { void load(); }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Notifications</h3>
            <Link to="/notifications" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2 max-h-80 overflow-auto">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground">No unread notifications.</div>
            ) : (
              items.map((n) => {
                const isClientPending = n.type === 'client_profile_pending';
                return (
                  <Link key={n.id} to={n.link || '/notifications'} className={`block rounded p-2 border ${isClientPending ? 'bg-amber-50 border-amber-300' : 'hover:bg-muted'}`}>
                    <div className="text-sm font-medium truncate">{n.title || 'Notification'}</div>
                    {n.body && <div className="text-xs text-muted-foreground truncate">{n.body}</div>}
                    {n.createdAt && <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>}
                  </Link>
                );
              })
            )}
          </div>
          <Button variant="link" className="w-full mt-2 text-xs" asChild>
            <Link to="/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBadge;
