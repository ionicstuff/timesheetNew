'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface MinimalUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  designation?: string;
}

const InviteMemberButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamIds, setTeamIds] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<MinimalUser[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const currentUserId = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return Number(u?.id || 0);
    } catch {
      return 0;
    }
  }, []);

  const token = useMemo(() => localStorage.getItem('token') || '', []);

  const loadTeamIds = async () => {
    try {
      const res = await fetch(
        `/api/users/team?includeSubordinates=true&limit=200`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const j = await res.json();
        const tm = Array.isArray(j?.data?.teamMembers)
          ? j.data.teamMembers
          : [];
        const ids = tm.map((u: any) => Number(u.id)).filter(Boolean);
        setTeamIds(ids);
      } else {
        setTeamIds([]);
      }
    } catch {
      setTeamIds([]);
    }
  };

  const searchCandidates = async (q: string) => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      qp.set('page', '1');
      qp.set('limit', '20');
      if (q.trim()) qp.set('search', q.trim());
      const res = await fetch(`/api/users?${qp.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to search users');
      const j = await res.json();
      const list = Array.isArray(j?.data?.users) ? j.data.users : [];
      // Exclude current user and already-in-team
      const exclude = new Set<number>(
        [...teamIds, currentUserId].filter(Boolean)
      );
      const filtered = list.filter((u: any) => !exclude.has(Number(u.id)));
      setCandidates(filtered);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadTeamIds();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = setTimeout(() => {
      void searchCandidates(search);
    }, 300);
    return () => clearTimeout(h);
  }, [search, isOpen]);

  const toggle = (id: number) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = async () => {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => Number(k));
    if (!ids.length) return;
    try {
      const results = await Promise.all(
        ids.map(async (uid) => {
          const res = await fetch(`/api/users/${uid}/hierarchy`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              parentUserId: currentUserId,
              relationshipType: 'direct_report',
            }),
          });
          const j = await res.json().catch(() => ({}));
          return { uid, ok: res.ok, message: j?.message };
        })
      );

      const failures = results.filter((r) => !r.ok);
      if (failures.length === 0) {
        toast({
          title: 'Team updated',
          description: `${ids.length} member(s) added to your team.`,
        });
        window.dispatchEvent(new CustomEvent('teamUpdated'));
        setIsOpen(false);
        setSearch('');
        setCandidates([]);
        setSelected({});
      } else {
        const msg = failures
          .map((f) => `#${f.uid}: ${f.message || 'failed'}`)
          .join(', ');
        toast({
          title: 'Some additions failed',
          description: msg,
          variant: 'destructive',
        });
      }
    } catch (e: any) {
      toast({
        title: 'Failed to add members',
        description: e.message || 'Request failed',
        variant: 'destructive',
      });
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add to My Team
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Add Team Members"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a name, email, or employee ID"
            />
          </div>

          <div className="max-h-80 overflow-auto border rounded">
            {loading ? (
              <div className="p-3 text-sm">Searching...</div>
            ) : candidates.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              candidates.map((u) => {
                const label =
                  `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ||
                  u.email ||
                  `User #${u.id}`;
                const sub = u.email ? ` · ${u.email}` : '';
                return (
                  <label
                    key={u.id}
                    className="flex items-center gap-2 p-2 border-b last:border-b-0 cursor-pointer"
                  >
                    <Checkbox
                      checked={!!selected[u.id]}
                      onCheckedChange={() => toggle(u.id)}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.designation || '—'}
                        {sub}
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedCount} selected
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={selectedCount === 0}
                onClick={handleAdd}
              >
                Add Selected
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InviteMemberButton;
