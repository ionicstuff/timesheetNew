'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onDuplicated?: () => void;
}

interface ApiProjectListItem {
  id: number;
  name: string;
}

const DuplicateProjectButton = ({ onDuplicated }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ApiProjectListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async (q: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      params.set('limit', '50');
      params.set('offset', '0');
      const res = await fetch(`/api/projects?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const list = await res.json();
        const rows = Array.isArray(list) ? list : list?.projects || [];
        setItems(rows.map((r: any) => ({ id: r.id, name: r.name || r.projectName })));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchProjects(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Copy className="mr-2 h-4 w-4" /> Copy From Previous
      </Button>

      <Modal open={open} onOpenChange={setOpen} title="Copy From Previous Project" size="lg">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search previous projects..."
              className="pl-8"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchProjects(e.target.value);
              }}
              autoFocus
            />
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {loading && <div className="p-3 text-sm text-muted-foreground">Loading...</div>}
              {!loading && items.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">No matching projects</div>
              )}
              {items.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="text-sm truncate pr-2">{p.name}</div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token') || '';
                        const res = await fetch(`/api/projects/${p.id}/duplicate`, {
                          method: 'POST',
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                        });
                        if (!res.ok) {
                          const err = await res.json().catch(() => ({}));
                          throw new Error(err.message || 'Failed to duplicate');
                        }
                        toast({ title: 'Duplicated', description: `Copied from "${p.name}"` });
                        setOpen(false);
                        onDuplicated?.();
                      } catch (e: any) {
                        toast({ title: 'Duplicate failed', description: e.message || 'Request failed', variant: 'destructive' });
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Modal>
    </>
  );
};

export default DuplicateProjectButton;