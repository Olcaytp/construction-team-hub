import { useTranslation } from "react-i18next";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { Crown, Lock, TrendingUp, Users, FolderKanban, ListTodo, DollarSign } from "lucide-react";
import { toast } from "sonner";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export const ReportsSection = () => {
  const { t } = useTranslation();
  const { isPremium, createCheckout } = useSubscription();
  const { isAdmin } = useAdmin();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { teamMembers } = useTeamMembers();

  // Admin'ler de premium özelliklere erişebilir
  const hasPremiumAccess = isPremium || isAdmin;

  const handleUpgrade = async () => {
    const url = await createCheckout(SUBSCRIPTION_TIERS.premium.price_id!);
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Ödeme sayfası açılamadı.");
    }
  };

  // Basic stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Financial stats
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalCost = projects.reduce((sum, p) => sum + (p.actualCost || 0), 0);
  const netProfit = totalRevenue - totalCost;

  // Chart data
  const taskStatusData = [
    { name: 'Tamamlandı', value: completedTasks, color: 'hsl(var(--chart-2))' },
    { name: 'Devam Ediyor', value: inProgressTasks, color: 'hsl(var(--primary))' },
    { name: 'Bekliyor', value: pendingTasks, color: 'hsl(var(--chart-4))' },
  ];

  const projectStatusData = [
    { name: 'Aktif', value: activeProjects },
    { name: 'Tamamlandı', value: completedProjects },
    { name: 'Beklemede', value: projects.filter(p => p.status === 'on-hold').length },
  ];

  const projectFinanceData = projects.slice(0, 5).map(p => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    Bütçe: p.budget || 0,
    Maliyet: p.actualCost || 0,
    Gelir: p.revenue || 0,
  }));

  const teamPerformanceData = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assignedTo === member.id);
    const memberCompletedTasks = memberTasks.filter(t => t.status === 'completed').length;
    return {
      name: member.name.length > 10 ? member.name.substring(0, 10) + '...' : member.name,
      Tamamlanan: memberCompletedTasks,
      Toplam: memberTasks.length,
    };
  });

  const LockedFeature = ({ title, description }: { title: string; description: string }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground mb-2">Premium Özellik</p>
          <Button size="sm" onClick={handleUpgrade} className="gap-2">
            <Crown className="h-4 w-4" />
            Yükselt
          </Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-48 bg-muted/20" />
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Raporlar</h2>
          <p className="text-muted-foreground">
            {hasPremiumAccess ? "Gelişmiş raporlama ve analizler" : "Temel raporlar"}
          </p>
        </div>
        {hasPremiumAccess && (
          <Badge className="bg-primary gap-1">
            <Crown className="h-3 w-3" />
            {isAdmin ? "Admin" : "Premium"}
          </Badge>
        )}
      </div>

      {/* Basic Reports - Available for all */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Temel Raporlar
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Proje</CardDescription>
              <CardTitle className="text-3xl">{totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {activeProjects} aktif, {completedProjects} tamamlandı
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Görev Tamamlama</CardDescription>
              <CardTitle className="text-3xl">{taskCompletionRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={taskCompletionRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {completedTasks}/{totalTasks} görev
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ekip Üyesi</CardDescription>
              <CardTitle className="text-3xl">{teamMembers.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Aktif çalışan sayısı
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Bütçe</CardDescription>
              <CardTitle className="text-3xl">₺{(totalBudget / 1000).toFixed(0)}K</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Tüm projeler
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Status Chart - Basic */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Görev Durumu Özeti</CardTitle>
            <CardDescription>Görevlerin mevcut durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Reports - Premium Only */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Gelişmiş Raporlar
          {!hasPremiumAccess && (
            <Badge variant="outline" className="ml-2">Premium</Badge>
          )}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {hasPremiumAccess ? (
            <>
              {/* Project Financial Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proje Finansal Analizi</CardTitle>
                  <CardDescription>Bütçe, maliyet ve gelir karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectFinanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Bütçe" fill="hsl(var(--chart-1))" />
                        <Bar dataKey="Maliyet" fill="hsl(var(--chart-4))" />
                        <Bar dataKey="Gelir" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ekip Performansı</CardTitle>
                  <CardDescription>Ekip üyelerinin görev tamamlama durumu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamPerformanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Tamamlanan" fill="hsl(var(--chart-2))" />
                        <Bar dataKey="Toplam" fill="hsl(var(--muted))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kâr/Zarar Analizi</CardTitle>
                  <CardDescription>Genel finansal durum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Toplam Gelir</span>
                      <span className="font-bold text-green-600">₺{totalRevenue.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Toplam Maliyet</span>
                      <span className="font-bold text-orange-600">₺{totalCost.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="font-medium">Net Kâr</span>
                      <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₺{netProfit.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Kâr Marjı</span>
                        <span>{totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%</span>
                      </div>
                      <Progress 
                        value={totalRevenue > 0 ? Math.max(0, (netProfit / totalRevenue) * 100) : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proje İlerleme Durumu</CardTitle>
                  <CardDescription>Tüm projelerin ilerleme yüzdeleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {projects.map(project => (
                      <div key={project.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{project.title}</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Henüz proje yok</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <LockedFeature 
                title="Proje Finansal Analizi" 
                description="Bütçe, maliyet ve gelir karşılaştırması" 
              />
              <LockedFeature 
                title="Ekip Performansı" 
                description="Ekip üyelerinin görev tamamlama durumu" 
              />
              <LockedFeature 
                title="Kâr/Zarar Analizi" 
                description="Genel finansal durum" 
              />
              <LockedFeature 
                title="Proje İlerleme Durumu" 
                description="Tüm projelerin ilerleme yüzdeleri" 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
