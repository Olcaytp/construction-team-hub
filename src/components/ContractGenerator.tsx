import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import { Project } from "@/hooks/useProjects";

interface ContractGeneratorProps {
  project: Project;
  customer?: {
    name: string;
    phone?: string;
    address?: string;
  } | null;
  teamMembers?: Array<{
    id: string;
    name: string;
    specialty: string;
    daily_wage?: number;
  }>;
}

export const ContractGenerator = ({ project, customer, teamMembers }: ContractGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const generateContract = async () => {
    setIsLoading(true);
    setContract(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-contract", {
        body: { project, customer, teamMembers },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setContract(data.contract);
      toast({ title: t("contract.generated") });
    } catch (error) {
      console.error("Contract generation error:", error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("contract.generateError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!contract) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    
    // Remove markdown formatting for PDF
    const cleanText = contract
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/---/g, "")
      .replace(/\n\n\n/g, "\n\n");

    const lines = doc.splitTextToSize(cleanText, maxWidth);
    
    let y = 20;
    const lineHeight = 6;
    
    doc.setFontSize(10);
    
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }

    doc.save(`${project.title}_sozlesme.pdf`);
    toast({ title: t("contract.downloaded") });
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown to HTML conversion
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$1. $2</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/---/g, '<hr class="my-4 border-border">')
      .replace(/^/gim, '')
      .replace(/$/gim, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          {t("contract.generate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("contract.title")} - {project.title}
          </DialogTitle>
        </DialogHeader>

        {!contract ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-muted-foreground text-center max-w-md">
              {t("contract.description")}
            </p>
            <Button onClick={generateContract} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("contract.generating")}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {t("contract.generateButton")}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={downloadPDF} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t("contract.downloadPDF")}
              </Button>
            </div>
            <ScrollArea className="h-[60vh] border rounded-lg p-4 bg-muted/30">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(contract) }}
              />
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
