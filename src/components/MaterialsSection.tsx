import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialForm } from "@/components/MaterialForm";
import { MaterialItem } from "@/components/MaterialItem";
import { useMaterials, Material } from "@/hooks/useMaterials";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Sparkles, Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MaterialsSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const { materials, isLoading, addMaterial, updateMaterial, deleteMaterial, addBulkMaterials } = useMaterials(selectedProjectId || undefined);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleAddMaterial = (data: any) => {
    if (!selectedProjectId) {
      toast({ variant: "destructive", title: "Hata", description: "Lütfen önce bir proje seçin" });
      return;
    }
    addMaterial({
      projectId: selectedProjectId,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      estimatedCost: data.estimatedCost,
      actualCost: data.actualCost,
      status: data.status,
      supplier: data.supplier || null,
      notes: data.notes || null,
    });
    setFormOpen(false);
  };

  const handleEditMaterial = (data: any) => {
    if (!editingMaterial) return;
    updateMaterial({
      id: editingMaterial.id,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      estimatedCost: data.estimatedCost,
      actualCost: data.actualCost,
      status: data.status,
      supplier: data.supplier || null,
      notes: data.notes || null,
    });
    setEditingMaterial(null);
    setFormOpen(false);
  };

  const handleAISuggest = async () => {
    if (!selectedProject) {
      toast({ variant: "destructive", title: "Hata", description: "Lütfen önce bir proje seçin" });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-materials", {
        body: {
          projectTitle: selectedProject.title,
          projectDescription: selectedProject.description,
        },
      });

      if (error) throw error;

      if (data.materials && data.materials.length > 0) {
        const materialsToAdd = data.materials.map((m: any) => ({
          projectId: selectedProjectId,
          name: m.name,
          quantity: m.quantity || 0,
          unit: m.unit || "adet",
          estimatedCost: m.estimatedCost || 0,
          actualCost: 0,
          status: "planned",
          supplier: null,
          notes: null,
        }));

        addBulkMaterials(materialsToAdd);
        toast({ title: "AI Önerisi", description: `${materialsToAdd.length} malzeme önerildi ve eklendi` });
      } else {
        toast({ variant: "destructive", title: "Hata", description: "AI malzeme önerisi oluşturamadı" });
      }
    } catch (error: any) {
      console.error("AI suggest error:", error);
      toast({ variant: "destructive", title: "Hata", description: error.message || "AI servisi hatası" });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredMaterials = selectedProjectId 
    ? materials.filter(m => m.projectId === selectedProjectId)
    : materials;

  const totalEstimatedCost = filteredMaterials.reduce((sum, m) => sum + m.estimatedCost, 0);
  const totalActualCost = filteredMaterials.reduce((sum, m) => sum + m.actualCost, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.materials')}</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('material.selectProject')} />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleAISuggest}
            disabled={!selectedProjectId || aiLoading}
            className="gap-2"
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {t('material.aiSuggest')}
          </Button>
          <Button
            onClick={() => {
              setEditingMaterial(null);
              setFormOpen(true);
            }}
            disabled={!selectedProjectId}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('material.add')}
          </Button>
        </div>
      </div>

      {selectedProjectId && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('material.totalMaterials')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{filteredMaterials.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('material.totalEstimatedCost')}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-primary">₺{totalEstimatedCost.toLocaleString()}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('material.totalActualCost')}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-orange-600">₺{totalActualCost.toLocaleString()}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !selectedProjectId ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('material.selectProjectFirst')}
          </CardContent>
        </Card>
      ) : filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('common.noData')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map(material => (
            <MaterialItem
              key={material.id}
              {...material}
              onEdit={() => {
                setEditingMaterial(material);
                setFormOpen(true);
              }}
              onDelete={() => deleteMaterial(material.id)}
            />
          ))}
        </div>
      )}

      <MaterialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingMaterial ? handleEditMaterial : handleAddMaterial}
        defaultValues={editingMaterial ? {
          name: editingMaterial.name,
          quantity: editingMaterial.quantity,
          unit: editingMaterial.unit,
          estimatedCost: editingMaterial.estimatedCost,
          actualCost: editingMaterial.actualCost,
          status: editingMaterial.status,
          supplier: editingMaterial.supplier || "",
          notes: editingMaterial.notes || "",
        } : undefined}
        title={editingMaterial ? t('material.edit') : t('material.add')}
      />
    </div>
  );
};
