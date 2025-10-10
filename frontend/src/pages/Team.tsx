'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import InviteMemberButton from '@/components/team/InviteMemberButton';
import TeamFilter from '@/components/team/TeamFilter';

interface ApiUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  designation?: string;
  isActive?: boolean;
  roleMaster?: { roleName?: string } | null;
}

const Team = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<ApiUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTeam = useCallback(
    async (opts?: { page?: number; q?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const qp = new URLSearchParams();
        qp.set('includeSubordinates', 'true'); // default true per requirement
        qp.set('page', String(opts?.page ?? page));
        qp.set('limit', String(limit));
        if ((opts?.q ?? query).trim())
          qp.set('search', (opts?.q ?? query).trim());
        const res = await fetch(`/api/users/team?${qp.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data?.message || `Failed to load team (${res.status})`
          );
        }
        const json = await res.json();
        const tm = json?.data?.teamMembers || [];
        const pg = json?.data?.pagination || {};
        setMembers(Array.isArray(tm) ? tm : []);
        setTotalPages(Number(pg.totalPages || 1));
      } catch (e: any) {
        setError(e.message || 'Request failed');
      } finally {
        setLoading(false);
      }
    },
    [page, limit, query]
  );

  useEffect(() => {
    fetchTeam();
    // Listen for team updates from the invite/add flow
    const onTeamUpdated = () => {
      fetchTeam({ page: 1, q: query });
      setPage(1);
    };
    window.addEventListener('teamUpdated', onTeamUpdated as EventListener);
    return () =>
      window.removeEventListener('teamUpdated', onTeamUpdated as EventListener);
  }, []);

  // Debounce search
  useEffect(() => {
    const h = setTimeout(() => {
      setPage(1);
      fetchTeam({ page: 1 });
    }, 300);
    return () => clearTimeout(h);
  }, [query]);

  useEffect(() => {
    fetchTeam({ page });
  }, [page]);

  const renderContent = () => {
    if (loading) return <div className="p-4">Loading team...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!members.length)
      return (
        <div className="p-4 text-muted-foreground">No team members found.</div>
      );

    return (
      <div className="divide-y">
        {members.map((u: ApiUser) => {
          const name =
            `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ||
            u.email ||
            `User #${u.id}`;
          const role = u.designation || u.roleMaster?.roleName || '—';
          const status = (u.isActive ? 'online' : 'offline') as
            | 'online'
            | 'away'
            | 'offline';
          return (
            <TeamMemberCard
              key={u.id}
              id={u.id}
              name={name}
              role={role}
              email={u.email || ''}
              status={status}
              tasks={0}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team</h1>
        <InviteMemberButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team members..."
            className="w-full rounded-md border pl-8 pr-4 py-2"
          />
        </div>
        {/* Keeping filter UI present but not functional per requirement (filters not needed now) */}
        <TeamFilter />
      </div>

      <div className="border rounded-lg">
        <div className="border-b p-4 font-medium">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">Member</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Tasks</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        {renderContent()}
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Team;
