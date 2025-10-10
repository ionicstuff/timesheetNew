import { QueryClient } from '@tanstack/react-query';

export type InvoiceStatus = 'generated' | 'approved' | 'sent';

export interface InvoiceRow {
  id: number;
  projectId: number;
  invoiceNumber: string;
  version: number;
  status: InvoiceStatus;
  issueDate: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd
  subtotal: number;
  total: number;
  currency: string;
  notes?: string | null;
  pdfPath?: string | null;
  projectName?: string;
  clientName?: string;
}

export interface ReadyProjectRow {
  project_id: number;
  project_name: string;
  closed_at: string | null;
  client_id: number;
  client_name: string;
  client_email: string | null;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function toNumber(n: any): number {
  const num = typeof n === 'number' ? n : parseFloat(String(n ?? 0));
  return Number.isFinite(num) ? num : 0;
}

// Adapter: snake_case DB row -> camelCase InvoiceRow
function adaptInvoiceRow(row: any): InvoiceRow {
  return {
    id: row.id,
    projectId: row.project_id ?? row.projectId,
    invoiceNumber: row.invoice_number ?? row.invoiceNumber,
    version: row.version,
    status: row.status,
    issueDate: row.issue_date ?? row.issueDate,
    dueDate: row.due_date ?? row.dueDate,
    subtotal: toNumber(row.subtotal),
    total: toNumber(row.total),
    currency: row.currency ?? 'USD',
    notes: row.notes ?? null,
    pdfPath: row.pdf_path ?? row.pdfPath ?? null,
    projectName: row.project_name ?? row.projectName,
    clientName: row.client_name ?? row.clientName,
  } as InvoiceRow;
}

export async function getReadyProjects(): Promise<ReadyProjectRow[]> {
  const res = await fetch(`/api/finance/ready-projects`, {
    headers: authHeaders(),
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({})))?.message ||
        'Failed to load ready projects'
    );
  const json = await res.json();
  const list = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
      ? json
      : [];
  return list as ReadyProjectRow[];
}

export async function listInvoices(params?: {
  status?: InvoiceStatus;
}): Promise<InvoiceRow[]> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  const url = `/api/finance/invoices${q.toString() ? `?${q.toString()}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({})))?.message || 'Failed to load invoices'
    );
  const json = await res.json();
  const rows = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
      ? json
      : [];
  return (rows as any[]).map(adaptInvoiceRow);
}

export async function generateInvoice(projectId: number) {
  const res = await fetch(`/api/finance/projects/${projectId}/invoice`, {
    method: 'POST',
    headers: authHeaders(),
    body: '{}',
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({})))?.message ||
        'Failed to generate invoice'
    );
  const json = await res.json();
  // backend returns { invoice: { id, pdfUrl, ... } }
  return json;
}

export async function approveInvoice(id: number) {
  const res = await fetch(`/api/finance/invoices/${id}/approve`, {
    method: 'POST',
    headers: authHeaders(),
    body: '{}',
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({})))?.message ||
        'Failed to approve invoice'
    );
  return res.json();
}

export async function sendInvoice(id: number) {
  const res = await fetch(`/api/finance/invoices/${id}/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: '{}',
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({})))?.message || 'Failed to send invoice'
    );
  return res.json();
}

export function getInvoicePdfUrl(id: number) {
  return `/api/finance/invoices/${id}/pdf`;
}

// Optional: a helper to invalidate related queries
export function invalidateFinanceQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['invoices'] });
  queryClient.invalidateQueries({ queryKey: ['ready-projects'] });
}
