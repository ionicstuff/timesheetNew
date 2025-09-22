"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface PendingClient {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  spocCount?: number;
}

const ClientCompletionQueue = () => {
  const [items, setItems] = useState<PendingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFinance, setIsFinance] = useState<boolean | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        // Determine if current user is Finance
        const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        let finance = false;
        if (meRes.ok) {
          const me = await meRes.json();
          const u = me?.user || me;
          const role = (u?.role || u?.roleName || '').toString().toLowerCase();
          const code = (u?.roleMaster?.roleCode || u?.roleCode || '').toString().toUpperCase();
          const rname = (u?.roleMaster?.roleName || u?.roleName || '').toString().toLowerCase();
          finance = role === 'finance' || code === 'FIN' || rname === 'finance';
        }
        setIsFinance(finance);
        if (!finance) { setItems([]); setLoading(false); return; }
        const res = await fetch(`/api/clients/pending?limit=5`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setItems([]); setLoading(false); return; }
        const j = await res.json();
        const list = Array.isArray(j?.items) ? j.items : (Array.isArray(j) ? j : []);
        setItems(list);
      } catch { setItems([]); } finally { setLoading(false); }
    };
    run();
  }, []);

  if (isFinance === false) return null;

  if (loading) return (
    <Card>
      <CardHeader>
        <CardTitle>Clients pending completion</CardTitle>
        <CardDescription>Loading…</CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clients pending completion</CardTitle>
            <CardDescription>Added by others — complete profile details</CardDescription>
          </div>
          <a href="/clients" className="text-sm text-blue-600 hover:underline">View all</a>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2"><Building2 className="h-4 w-4"/> No pending clients.</div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email || c.phone || 'Missing contact info'} · SPOCs: {c.spocCount ?? 0}</div>
                </div>
                <Button asChild size="sm" variant="outline"><a href={`/clients/${c.id}`}>Complete</a></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCompletionQueue;
