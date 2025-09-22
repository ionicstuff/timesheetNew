import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveInvoice, generateInvoice, getReadyProjects, listInvoices, sendInvoice, InvoiceRow, ReadyProjectRow } from "@/services/finance";

export function useInvoices(status?: string, options?: { enabled?: boolean }) {
  return useQuery<InvoiceRow[], Error>({
    queryKey: ["invoices", { status: status || "" }],
    queryFn: () => listInvoices(status ? { status: status as any } : undefined),
    enabled: options?.enabled ?? true,
  });
}

export function useReadyProjects() {
  return useQuery<ReadyProjectRow[], Error>({
    queryKey: ["ready-projects"],
    queryFn: () => getReadyProjects(),
  });
}

export function useGenerateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => generateInvoice(projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["ready-projects"] });
    },
  });
}

export function useApproveInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useSendInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sendInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}