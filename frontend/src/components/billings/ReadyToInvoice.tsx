'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGenerateInvoice, useReadyProjects } from '@/hooks/useFinance';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Sparkles } from 'lucide-react';

const ReadyToInvoice = () => {
  const { data, isLoading, isError, error } = useReadyProjects();
  const { mutateAsync: generate, isPending: generating } = useGenerateInvoice();
  const { toast } = useToast();

  const handleGenerate = async (projectId: number) => {
    try {
      const res = await generate(projectId);
      const invId = res?.invoice?.id;
      toast({
        title: 'Invoice generated',
        description: `Invoice #${res?.invoice?.invoiceNumber || invId} created.`,
      });
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to generate invoice',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return null; // avoid jumping UI; show after load
  if (isError || !data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Projects Ready for Invoicing
        </CardTitle>
        <CardDescription>
          These projects are closed and have no invoice yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((p) => (
            <div
              key={p.project_id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="font-medium">{p.project_name}</div>
                <div className="text-sm text-muted-foreground">
                  {p.client_name}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleGenerate(p.project_id)}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Generate Invoice
              </Button>
            </div>
          ))}
          {data.length > 5 && (
            <p className="text-xs text-muted-foreground">
              Showing 5 of {data.length} ready projects
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadyToInvoice;
