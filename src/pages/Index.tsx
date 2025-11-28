import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FolderKanban, ListTodo, Plus, Building2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Zemin Betonajı",
      project: "Konut Projesi - Kadıköy",
      assignee: "Ahmet Yılmaz Ekibi",
      dueDate: "15 Şubat 2024",
      status: "in-progress" as const,
      priority: "high" as const,
    },
    {
      id: 2,
      title: "Dış Cephe Boyası",
      project: "İş Merkezi - Levent",
      assignee: "Mehmet Demir Ekibi",
      dueDate: "20 Şubat 2024",
      status: "pending" as const,
      priority: "medium" as const,
    },
    {
      id: 3,
      title: "Elektrik Tesisatı",
      project: "Konut Projesi - Kadıköy",
      assignee: "Can Kaya Ekibi",
      dueDate: "10 Şubat 2024",
      status: "completed" as const,
      priority: "high" as const,
    },
  ]);

  const handleStatusChange = (taskId: number, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">İnşaat Yönetim Sistemi</h1>
                <p className="text-sm text-muted-foreground">Taşeron ve Ekip Takibi</p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Proje
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Özet
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projeler
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Görevler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Aktif Projeler"
                value={3}
                icon={FolderKanban}
                variant="default"
              />
              <StatsCard
                title="Devam Eden İşler"
                value={12}
                icon={ListTodo}
                variant="info"
              />
              <StatsCard
                title="Tamamlanan İşler"
                value={28}
                icon={ListTodo}
                variant="success"
                trend="Bu ay: +8"
              />
              <StatsCard
                title="Bekleyen İşler"
                value={5}
                icon={ListTodo}
                variant="warning"
              />
            </div>

            {/* Recent Projects */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Aktif Projeler</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ProjectCard
                  title="Konut Projesi"
                  location="Kadıköy, İstanbul"
                  startDate="5 Ocak 2024"
                  team="Ahmet Yılmaz Ekibi"
                  progress={65}
                  status="active"
                />
                <ProjectCard
                  title="İş Merkezi"
                  location="Levent, İstanbul"
                  startDate="12 Ocak 2024"
                  team="Mehmet Demir Ekibi"
                  progress={40}
                  status="active"
                />
                <ProjectCard
                  title="AVM Yenileme"
                  location="Beylikdüzü, İstanbul"
                  startDate="20 Şubat 2024"
                  team="Can Kaya Ekibi"
                  progress={0}
                  status="pending"
                />
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Son Görevler</h2>
              <div className="space-y-3">
                {tasks.slice(0, 3).map(task => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    onStatusChange={(status) => handleStatusChange(task.id, status)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Tüm Projeler</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Proje
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ProjectCard
                title="Konut Projesi"
                location="Kadıköy, İstanbul"
                startDate="5 Ocak 2024"
                team="Ahmet Yılmaz Ekibi"
                progress={65}
                status="active"
              />
              <ProjectCard
                title="İş Merkezi"
                location="Levent, İstanbul"
                startDate="12 Ocak 2024"
                team="Mehmet Demir Ekibi"
                progress={40}
                status="active"
              />
              <ProjectCard
                title="AVM Yenileme"
                location="Beylikdüzü, İstanbul"
                startDate="20 Şubat 2024"
                team="Can Kaya Ekibi"
                progress={0}
                status="pending"
              />
              <ProjectCard
                title="Ofis Renovasyonu"
                location="Şişli, İstanbul"
                startDate="1 Aralık 2023"
                team="Ahmet Yılmaz Ekibi"
                progress={100}
                status="completed"
              />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Tüm Görevler</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Görev
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
