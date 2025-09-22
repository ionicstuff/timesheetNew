"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Building2,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Modal from "@/components/ui/Modal";
import ClientForm from "@/components/clients/ClientForm";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface UiClientCard {
  id: number;
  name: string;
  industry?: string;
  projects: number;
  status: string;
  contact?: string;
  email?: string;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<UiClientCard[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/clients?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      const rows = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
      const mapped: UiClientCard[] = rows.map((c: any) => ({
        id: c.id,
        name: c.clientName || c.name || `Client #${c.id}`,
        industry: c.industry || c.companyName || undefined,
        projects: Array.isArray(c.projects) ? c.projects.length : (c.projectsCount ?? 0),
        status: (c.status || (c.isActive ? 'Active' : 'Inactive')) + '',
        contact: c.contact || c.primaryContact || c.contactName,
        email: c.email || c.contactEmail
      }));
      setClients(mapped);
    } catch (e) {
      console.error('Failed to load clients', e);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchClients(); }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "prospect": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and projects
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search clients..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      <Link to={`/clients/${client.id}`} className="hover:underline">
                        {client.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{client.industry || '—'}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/clients/${client.id}`}>View Details</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Primary Contact</span>
                  <span className="text-sm font-medium">{client.contact || client.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="text-sm font-medium">{client.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
                <div className="pt-2">
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/clients/${client.id}`}>View Client</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or add a new client
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      )}

      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Create Client" size="lg">
        <ClientForm onSubmit={async (data: any) => {
          try {
            const token = localStorage.getItem('token') || '';
              const statusNorm = (data.status ? String(data.status) : 'active').toLowerCase().replace(/\s+/g,'_');
              const payload: any = {
              clientName: data.name,
              industry: data.industry || undefined,
              email: data.email || undefined,
              phone: data.phone || undefined,
              address: data.address || undefined,
              website: data.website || undefined,
              status: statusNorm,
              notes: data.notes || undefined
            };
            const res = await fetch('/api/clients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
            const j = await res.json().catch(()=>({}));
            if (!res.ok) throw new Error(j?.message || 'Failed to create client');
            setCreateOpen(false);
            toast({ title: 'Client created' });
            await fetchClients();
          } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed to create client', variant: 'destructive' });
          }
        }} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
};

export default Clients;
