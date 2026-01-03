import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  assignedTeam: z.array(z.string()),
  customerId: z.string().optional(),
  status: z.enum(["planning", "active", "completed"]),
  progress: z.coerce.number().min(0).max(100),
  budget: z.coerce.number().min(0),
  actualCost: z.coerce.number().min(0),
  revenue: z.coerce.number().min(0),
  photos: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TeamMember {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  name: string;
}

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  title: string;
  teamMembers?: TeamMember[];
  customers?: Customer[];
}

export const ProjectForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title,
  teamMembers = [],
  customers = [],
}: ProjectFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(defaultValues?.photos || []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      assignedTeam: [],
      customerId: "",
      status: "planning",
      progress: 0,
      budget: 0,
      actualCost: 0,
      revenue: 0,
      photos: [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
      setPhotoUrls(defaultValues.photos || []);
    } else {
      form.reset({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        assignedTeam: [],
        customerId: "",
        status: "planning",
        progress: 0,
        budget: 0,
        actualCost: 0,
        revenue: 0,
        photos: [],
      });
      setPhotoUrls([]);
    }
  }, [defaultValues, form]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-photos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("project-photos")
          .getPublicUrl(filePath);

        newUrls.push(data.publicUrl);
      }

      const updatedUrls = [...photoUrls, ...newUrls];
      setPhotoUrls(updatedUrls);
      form.setValue("photos", updatedUrls, { shouldDirty: true });
      toast({ title: t("project.uploadPhotos") + " ✓" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setUploading(false);
      // Reset input to allow uploading same file again
      e.target.value = '';
    }
  };

  const removePhoto = (url: string) => {
    const updatedUrls = photoUrls.filter((u) => u !== url);
    setPhotoUrls(updatedUrls);
    form.setValue("photos", updatedUrls);
  };

  const handleSubmit = (data: FormData) => {
    onSubmit({ ...data, photos: photoUrls });
    form.reset();
    setPhotoUrls([]);
    onOpenChange(false);
  };

  const selectedTeam = form.watch("assignedTeam") || [];

  const toggleTeamMember = (memberId: string) => {
    const current = form.getValues("assignedTeam") || [];
    if (current.includes(memberId)) {
      form.setValue("assignedTeam", current.filter(id => id !== memberId));
    } else {
      form.setValue("assignedTeam", [...current, memberId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("project.titlePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.status")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("project.selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">{t("project.planning")}</SelectItem>
                        <SelectItem value="active">{t("project.active")}</SelectItem>
                        <SelectItem value="completed">{t("project.completed")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("project.descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.startDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.endDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Customer Selection */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.customer")}</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val === "none" ? "" : val)} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("project.selectCustomer")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("project.noCustomer")}</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Member Selection */}
            <FormField
              control={form.control}
              name="assignedTeam"
              render={() => (
                <FormItem>
                  <FormLabel>{t("project.assignedTeam")}</FormLabel>
                  <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {teamMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
                    ) : (
                      teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`team-${member.id}`}
                            checked={selectedTeam.includes(member.id)}
                            onCheckedChange={() => toggleTeamMember(member.id)}
                          />
                          <label
                            htmlFor={`team-${member.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {member.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("project.progress")} (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.budget")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder={t("project.budgetPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actualCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.actualCost")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("project.revenue")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>{t("project.photos")}</FormLabel>
              <div className="flex items-start gap-3">
                <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  {uploading && <span className="text-xs text-muted-foreground mt-1">...</span>}
                </label>
                <div className="flex flex-wrap gap-2 flex-1">
                  {photoUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group">
                      <img 
                        src={url} 
                        alt={`Photo ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(url)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {photoUrls.length === 0 && (
                    <span className="text-sm text-muted-foreground self-center">{t("common.noData")}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                {t("project.cancel")}
              </Button>
              <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
                {t("project.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
