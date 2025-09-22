"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ProjectSprintSelector from "./ProjectSprintSelector";
import Modal from "@/components/ui/Modal";

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  lockClientId?: number; // when provided, client selection is locked to this id
}

// Simple helper to YYYY-MM-DD
function toDateOnly(d?: Date) {
  return d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10) : undefined;
}

const ProjectForm = ({ onSubmit, onCancel, initialData, lockClientId }: ProjectFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState(initialData?.color || "blue"); // UI-only

  // Dates
  const [startDate, setStartDate] = useState<Date | undefined>(initialData?.startDate);
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate);

  // Core relationships/fields
  const [clientId, setClientId] = useState<string>(
    (initialData?.clientId ? String(initialData.clientId) : (lockClientId ? String(lockClientId) : ""))
  );
  const [spocId, setSpocId] = useState<string>(initialData?.spocId ? String(initialData.spocId) : "");
  const [managerId, setManagerId] = useState<string>(initialData?.managerId ? String(initialData.managerId) : "");
  const [estimatedTime, setEstimatedTime] = useState<string>(initialData?.estimatedTime ? String(initialData.estimatedTime) : "");
  const [isActive, setIsActive] = useState<string>(initialData?.isActive === false ? "false" : "true");

  // Dropdown data
  const [clients, setClients] = useState<Array<{ id: number; name: string }>>([]);
  const [spocs, setSpocs] = useState<Array<{ id: number; name: string }>>([]);
  const [managers, setManagers] = useState<Array<{ id: number; first_name?: string; last_name?: string; email?: string }>>([]);

  const [loadingMeta, setLoadingMeta] = useState<boolean>(true);

  // Sentinel values
  const MANAGER_NONE_VALUE = "__none__";
  const CREATE_CLIENT_VALUE = "__create_client__";
  const CREATE_SPOC_VALUE = "__create_spoc__";
  const SEARCH_MANAGER_VALUE = "__search_manager__";

  // Quick-create modals
  const [openCreateClient, setOpenCreateClient] = useState(false);
  const [openCreateSpoc, setOpenCreateSpoc] = useState(false);
  const [openSearchManager, setOpenSearchManager] = useState(false);

  // Sync lockClientId into state if it changes
  useEffect(() => {
    if (lockClientId) setClientId(String(lockClientId));
  }, [lockClientId]);

  // Fetch clients and managers on open
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoadingMeta(true);
        const token = localStorage.getItem("token") || "";
        const h = { Authorization: `Bearer ${token}` } as Record<string, string>;
        const [cRes, mRes] = await Promise.all([
          fetch(`/api/projects/clients`, { headers: h }),
          fetch(`/api/projects/managers`, { headers: h }),
        ]);
        const c = cRes.ok ? await cRes.json() : [];
        const m = mRes.ok ? await mRes.json() : [];
        if (!cancelled) {
          setClients(Array.isArray(c) ? c : []);
          setManagers(Array.isArray(m) ? m : []);
        }
      } catch {
        if (!cancelled) {
          setClients([]);
          setManagers([]);
        }
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Fetch SPOCs when client changes
  useEffect(() => {
    let cancelled = false;
    const loadSpocs = async () => {
      try {
        if (!clientId) { setSpocs([]); return; }
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`/api/projects/clients/${clientId}/spocs`, { headers: { Authorization: `Bearer ${token}` } });
        const rows = res.ok ? await res.json() : [];
        if (!cancelled) setSpocs(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setSpocs([]);
      }
    };
    loadSpocs();
    // reset spocId if client changes
    setSpocId("");
    return () => { cancelled = true; };
  }, [clientId]);

  const [sprintData, setSprintData] = useState({
    numberOfSprints: 1,
    sprintDuration: 1,
    startDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      color,
      startDate: toDateOnly(startDate),
      endDate: toDateOnly(dueDate),
      sprintData,
      clientId,
      spocId,
      managerId,
      estimatedTime,
      isActive: isActive === "true",
    });
  };

  const handleSprintChange = (data: { 
    numberOfSprints: number; 
    sprintDuration: number;
    startDate: Date | undefined;
  }) => {
    setSprintData(data);
  };

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${option.class} mr-2`}></div>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Client</Label>
          <Select 
            value={clientId || undefined} 
            onValueChange={(v) => {
              if (lockClientId) return; // locked
              if (v === CREATE_CLIENT_VALUE) { setOpenCreateClient(true); return; }
              setClientId(v);
            }}
          >
            <SelectTrigger disabled={!!lockClientId}>
              <SelectValue placeholder={loadingMeta ? "Loading clients..." : "Select client"} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
              {!lockClientId && <SelectItem value={CREATE_CLIENT_VALUE}>+ Create new client…</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>SPOC</Label>
          <Select 
            value={spocId || undefined} 
            onValueChange={(v) => {
              if (v === CREATE_SPOC_VALUE) { setOpenCreateSpoc(true); return; }
              setSpocId(v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={clientId ? (spocs.length ? "Select SPOC" : "No SPOCs") : "Select client first"} />
            </SelectTrigger>
            <SelectContent>
              {spocs.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
              ))}
              {clientId && <SelectItem value={CREATE_SPOC_VALUE}>+ Create new SPOC…</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Project Manager (optional)</Label>
          <Select 
            value={managerId || MANAGER_NONE_VALUE} 
            onValueChange={(v) => {
              if (v === SEARCH_MANAGER_VALUE) { setOpenSearchManager(true); return; }
              setManagerId(v === MANAGER_NONE_VALUE ? '' : v)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingMeta ? "Loading managers..." : "Select manager (optional)"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MANAGER_NONE_VALUE}>— None —</SelectItem>
              {managers.map((m) => {
                const label = [m.first_name, m.last_name].filter(Boolean).join(" ") || m.email || `User ${m.id}`;
                return (
                  <SelectItem key={m.id} value={String(m.id)}>{label}</SelectItem>
                );
              })}
              <SelectItem value={SEARCH_MANAGER_VALUE}>🔎 Search users…</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
          <Input
            id="estimatedTime"
            type="number"
            min={0}
            step="0.5"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g. 40"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={isActive} onValueChange={setIsActive}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sprints (UI) */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Sprint Planning</h3>
        <ProjectSprintSelector onSprintChange={handleSprintChange} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name || !clientId || (!spocId && !initialData)}>
          {initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>

      {/* Quick create: Client */}
      <Modal open={openCreateClient} onOpenChange={setOpenCreateClient} title="Create Client" size="md">
        <QuickCreateClient onDone={async (createdId?: number) => {
          setOpenCreateClient(false);
          if (createdId) {
            // refresh clients and select the new one
            try {
              const token = localStorage.getItem('token') || '';
              const rowsRes = await fetch(`/api/projects/clients`, { headers: { Authorization: `Bearer ${token}` } });
              const rows = rowsRes.ok ? await rowsRes.json() : [];
              setClients(Array.isArray(rows) ? rows : []);
              setClientId(String(createdId));
              // refresh spocs for the new client as well
              const spocRes = await fetch(`/api/projects/clients/${createdId}/spocs`, { headers: { Authorization: `Bearer ${token}` } });
              const sp = spocRes.ok ? await spocRes.json() : [];
              setSpocs(Array.isArray(sp) ? sp : []);
              setSpocId('');
            } catch {}
          }
        }} />
      </Modal>

      {/* Quick create: SPOC */}
      <Modal open={openCreateSpoc} onOpenChange={setOpenCreateSpoc} title="Create SPOC" size="md">
        <QuickCreateSpoc clientId={clientId ? Number(clientId) : undefined} onDone={async (createdId?: number) => {
          setOpenCreateSpoc(false);
          if (createdId && clientId) {
            try {
              const token = localStorage.getItem('token') || '';
              const spocRes = await fetch(`/api/projects/clients/${clientId}/spocs`, { headers: { Authorization: `Bearer ${token}` } });
              const sp = spocRes.ok ? await spocRes.json() : [];
              setSpocs(Array.isArray(sp) ? sp : []);
              setSpocId(String(createdId));
            } catch {}
          }
        }} />
      </Modal>

      {/* Search manager */}
      <Modal open={openSearchManager} onOpenChange={setOpenSearchManager} title="Search Users" size="lg">
        <QuickSearchUser onPick={(u) => {
          // Ensure selected user appears in managers list
          if (!managers.some(m => String(m.id) === String(u.id))) {
            setManagers(prev => [...prev, { id: u.id, first_name: u.firstName, last_name: u.lastName, email: u.email }]);
          }
          setManagerId(String(u.id));
          setOpenSearchManager(false);
        }} />
      </Modal>
    </form>
  );
};

// --- Inline helper components ---

function QuickCreateClient({ onDone }: { onDone: (id?: number) => void }) {
  const [name, setName] = useState('');
  const [spocEmail, setSpocEmail] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <Label>Client Name</Label>
        <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="ACME Corp" />
      </div>
      <div>
        <Label>Primary SPOC Email (optional)</Label>
        <Input type="email" value={spocEmail} onChange={(e)=>setSpocEmail(e.target.value)} placeholder="spoc@example.com" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={()=>onDone(undefined)} disabled={busy}>Cancel</Button>
        <Button disabled={!name || busy} onClick={async ()=>{
          try{
            setBusy(true);
            const token = localStorage.getItem('token') || '';
            const res = await fetch(`/api/clients`, {
              method:'POST',
              headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ clientName: name, spocEmail: spocEmail || undefined })
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) throw new Error(data?.message || 'Failed to create client');
            const id = data?.data?.id || data?.id || data?.client?.id;
            onDone(id);
          }catch(e){
            onDone(undefined);
          }finally{ setBusy(false); }
        }}>Create</Button>
      </div>
    </div>
  );
}

function QuickCreateSpoc({ clientId, onDone }: { clientId?: number, onDone: (id?: number)=>void }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const disabled = !clientId;
  return (
    <div className="space-y-4">
      {disabled && <p className="text-sm text-muted-foreground">Select a client first.</p>}
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Alice" disabled={disabled} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="alice@example.com" disabled={disabled} />
      </div>
      <div>
        <Label>Phone (optional)</Label>
        <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+1-234" disabled={disabled} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={()=>onDone(undefined)}>Cancel</Button>
        <Button disabled={disabled || !name || !email || busy} onClick={async ()=>{
          try{
            setBusy(true);
            const token = localStorage.getItem('token') || '';
            const res = await fetch(`/api/spocs`, {
              method:'POST',
              headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ name, email, phone: phone || undefined, clientId })
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) throw new Error(data?.message || 'Failed to create SPOC');
            const id = data?.data?.id || data?.id;
            onDone(id);
          }catch(e){
            onDone(undefined);
          }finally{ setBusy(false); }
        }}>Create</Button>
      </div>
    </div>
  );
}

function QuickSearchUser({ onPick }: { onPick: (u: { id:number, firstName?:string, lastName?:string, email?:string })=>void }){
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const search = async (query: string) => {
    try{
      setBusy(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(()=>({}));
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setResults(list);
    }catch{ setResults([]); } finally{ setBusy(false); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Search</Label>
        <Input value={q} onChange={(e)=>{ setQ(e.target.value); }} placeholder="Type a name or email" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); search(q); } }} />
        <div className="flex justify-end mt-2">
          <Button size="sm" onClick={()=>search(q)} disabled={!q || busy}>Search</Button>
        </div>
      </div>
      <div className="max-h-64 overflow-auto border rounded">
        {results.length === 0 && <p className="p-3 text-sm text-muted-foreground">{busy ? 'Searching…' : 'No results'}</p>}
        {results.map((u)=>{
          const label = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || `User ${u.id}`;
          return (
            <button key={u.id} className="w-full text-left p-3 hover:bg-muted" onClick={()=>onPick(u)}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectForm;
