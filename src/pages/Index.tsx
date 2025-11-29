import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskItem } from "@/components/TaskItem";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { TeamMemberForm } from "@/components/TeamMemberForm";
import { ProjectForm } from "@/components/ProjectForm";
import { TaskForm } from "@/components/TaskForm";
import { LayoutDashboard, FolderKanban, ListTodo, Users, Plus, Building2, Pencil, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  estimatedCost: number;
};

type Project = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  team: string;
  progress: number;
  status: "active" | "completed" | "pending";
  budget: number;
  actualCost: number;
  revenue: number;
};

type TeamMember = {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  dailyWage: number;
};

const STORAGE_KEYS = {
  TASKS: 'construction_tasks',
  PROJECTS: 'construction_projects',
  TEAM_MEMBERS: 'construction_team_members',
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const savedTeamMembers = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        {
          id: "1",
          title: "Zemin Betonajı",
          project: "Konut Projesi - Kadıköy",
          assignee: "Ahmet Yılmaz Ekibi",
          dueDate: "15 Şubat 2024",
          status: "in-progress",
          priority: "high",
          estimatedCost: 15000,
        },
        {
          id: "2",
          title: "Dış Cephe Boyası",
          project: "İş Merkezi - Levent",
          assignee: "Mehmet Demir Ekibi",
          dueDate: "20 Şubat 2024",
          status: "pending",
          priority: "medium",
          estimatedCost: 8000,
        },
      ]);
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects([
        {
          id: "1",
          title: "Konut Projesi",
          location: "Kadıköy, İstanbul",
          startDate: "5 Ocak 2024",
          team: "Ahmet Yılmaz Ekibi",
          progress: 65,
          status: "active",
          budget: 500000,
          actualCost: 325000,
          revenue: 450000,
        },
        {
          id: "2",
          title: "İş Merkezi",
          location: "Levent, İstanbul",
          startDate: "12 Ocak 2024",
          team: "Mehmet Demir Ekibi",
          progress: 40,
          status: "active",
          budget: 800000,
          actualCost: 320000,
          revenue: 600000,
        },
      ]);
    }

    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    } else {
      setTeamMembers([
        {
          id: "1",
          name: "Ahmet Yılmaz",
          phone: "0555 123 45 67",
          specialty: "Elektrikçi",
          dailyWage: 800,
        },
        {
          id: "2",
          name: "Mehmet Demir",
          phone: "0555 987 65 43",
          specialty: "Boyacı",
          dailyWage: 650,
        },
      ]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (teamMembers.length > 0) localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(teamMembers));
  }, [teamMembers]);

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success("Görev durumu güncellendi");
  };

  // Team Member handlers
  const handleAddTeamMember = (data: Omit<TeamMember, 'id'>) => {
    const newMember = { ...data, id: Date.now().toString() };
    setTeamMembers([...teamMembers, newMember]);
    toast.success("Ekip üyesi eklendi");
  };

  const handleEditTeamMember = (data: Omit<TeamMember, 'id'>) => {
    if (!editingTeamMember) return;
    setTeamMembers(teamMembers.map(member =>
      member.id === editingTeamMember.id ? { ...member, ...data } : member
    ));
    setEditingTeamMember(null);
    toast.success("Ekip üyesi güncellendi");
  };

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success("Ekip üyesi silindi");
  };

  // Project handlers
  const handleAddProject = (data: Omit<Project, 'id'>) => {
    const newProject = { ...data, id: Date.now().toString() };
    setProjects([...projects, newProject]);
    toast.success("Proje eklendi");
  };

  const handleEditProject = (data: Omit<Project, 'id'>) => {
    if (!editingProject) return;
    setProjects(projects.map(project =>
      project.id === editingProject.id ? { ...project, ...data } : project
    ));
    setEditingProject(null);
    toast.success("Proje güncellendi");
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success("Proje silindi");
  };

  // Task handlers
  const handleAddTask = (data: Omit<Task, 'id'>) => {
    const newTask = { ...data, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
    toast.success("Görev eklendi");
  };

  const handleEditTask = (data: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? { ...task, ...data } : task
    ));
    setEditingTask(null);
    toast.success("Görev güncellendi");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Görev silindi");
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
            <TabsTrigger value="teams" className="gap-2">
              <Users className="h-4 w-4" />
              Ekipler
            </TabsTrigger>
            <TabsTrigger value="finance" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Ekonomi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Aktif Projeler"
                value={projects.filter(p => p.status === 'active').length}
                icon={FolderKanban}
                variant="default"
              />
              <StatsCard
                title="Devam Eden İşler"
                value={tasks.filter(t => t.status === 'in-progress').length}
                icon={ListTodo}
                variant="info"
              />
              <StatsCard
                title="Tamamlanan İşler"
                value={tasks.filter(t => t.status === 'completed').length}
                icon={ListTodo}
                variant="success"
              />
              <StatsCard
                title="Ekip Üyeleri"
                value={teamMembers.length}
                icon={Users}
                variant="warning"
              />
            </div>

            {/* Recent Projects */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Aktif Projeler</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.filter(p => p.status === 'active').slice(0, 3).map(project => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onClick={() => {
                      setEditingProject(project);
                      setProjectFormOpen(true);
                    }}
                  />
                ))}
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
              <Button onClick={() => setProjectFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Proje
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <div key={project.id} className="relative group">
                  <ProjectCard
                    {...project}
                    onClick={() => {
                      setEditingProject(project);
                      setProjectFormOpen(true);
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        setProjectFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Tüm Görevler</h2>
              <Button onClick={() => setTaskFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Görev
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex gap-2 group">
                  <div className="flex-1">
                    <TaskItem 
                      {...task} 
                      onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                    />
                  </div>
                  <div className="flex gap-2 items-start pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTask(task);
                        setTaskFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Ekip Üyeleri</h2>
              <Button onClick={() => setTeamFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Üye
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map(member => (
                <TeamMemberCard
                  key={member.id}
                  {...member}
                  onEdit={() => {
                    setEditingTeamMember(member);
                    setTeamFormOpen(true);
                  }}
                  onDelete={() => handleDeleteTeamMember(member.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Finansal Özet</h2>
            
            {/* Financial Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Toplam Bütçe"
                value={`₺${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString('tr-TR')}`}
                icon={DollarSign}
                variant="default"
              />
              <StatsCard
                title="Toplam Gelir"
                value={`₺${projects.reduce((sum, p) => sum + (p.revenue || 0), 0).toLocaleString('tr-TR')}`}
                icon={DollarSign}
                variant="success"
              />
              <StatsCard
                title="Toplam Maliyet"
                value={`₺${projects.reduce((sum, p) => sum + (p.actualCost || 0), 0).toLocaleString('tr-TR')}`}
                icon={DollarSign}
                variant="warning"
              />
              <StatsCard
                title="Net Kar"
                value={`₺${(projects.reduce((sum, p) => sum + (p.revenue || 0), 0) - projects.reduce((sum, p) => sum + (p.actualCost || 0), 0)).toLocaleString('tr-TR')}`}
                icon={DollarSign}
                variant="info"
              />
            </div>

            {/* Project Financial Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Proje Bazlı Finansal Durum</h3>
              <div className="grid gap-4">
                {projects.map(project => (
                  <div key={project.id} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{project.title}</h4>
                      <span className={`text-sm font-medium ${
                        (project.revenue || 0) - (project.actualCost || 0) > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(project.revenue || 0) - (project.actualCost || 0) > 0 ? '+' : ''}
                        ₺{((project.revenue || 0) - (project.actualCost || 0)).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Bütçe</p>
                        <p className="font-medium text-foreground">₺{(project.budget || 0).toLocaleString('tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gelir</p>
                        <p className="font-medium text-foreground">₺{(project.revenue || 0).toLocaleString('tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Maliyet</p>
                        <p className="font-medium text-foreground">₺{(project.actualCost || 0).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Bütçe Kullanımı</span>
                        <span>{(project.budget || 0) > 0 ? Math.round(((project.actualCost || 0) / (project.budget || 1)) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            ((project.actualCost || 0) / (project.budget || 1)) > 0.9 
                              ? 'bg-red-500' 
                              : ((project.actualCost || 0) / (project.budget || 1)) > 0.7 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(((project.actualCost || 0) / (project.budget || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Costs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Görev Maliyetleri</h3>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Görev</th>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Proje</th>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Durum</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Tahmini Maliyet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.id} className="border-t border-border">
                        <td className="p-3 text-sm text-foreground">{task.title}</td>
                        <td className="p-3 text-sm text-muted-foreground">{task.project}</td>
                        <td className="p-3 text-sm">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {task.status === 'completed' ? 'Tamamlandı' : 
                             task.status === 'in-progress' ? 'Devam Ediyor' : 'Bekliyor'}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-right font-medium text-foreground">
                          ₺{(task.estimatedCost || 0).toLocaleString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-border bg-muted/50">
                      <td colSpan={3} className="p-3 text-sm font-semibold text-foreground">Toplam</td>
                      <td className="p-3 text-sm text-right font-bold text-foreground">
                        ₺{tasks.reduce((sum, t) => sum + (t.estimatedCost || 0), 0).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Costs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Ekip Maliyetleri</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{member.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {member.specialty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Günlük Ücret</span>
                      <span className="text-lg font-bold text-foreground">₺{(member.dailyWage || 0).toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aylık Tahmini</span>
                        <span className="font-medium text-foreground">₺{((member.dailyWage || 0) * 26).toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Toplam Günlük Ekip Maliyeti</span>
                  <span className="text-xl font-bold text-primary">
                    ₺{teamMembers.reduce((sum, m) => sum + (m.dailyWage || 0), 0).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forms */}
      <TeamMemberForm
        open={teamFormOpen}
        onOpenChange={(open) => {
          setTeamFormOpen(open);
          if (!open) setEditingTeamMember(null);
        }}
        onSubmit={editingTeamMember ? handleEditTeamMember : handleAddTeamMember}
        defaultValues={editingTeamMember || undefined}
        title={editingTeamMember ? "Ekip Üyesini Düzenle" : "Yeni Ekip Üyesi"}
      />

      <ProjectForm
        open={projectFormOpen}
        onOpenChange={(open) => {
          setProjectFormOpen(open);
          if (!open) setEditingProject(null);
        }}
        onSubmit={editingProject ? handleEditProject : handleAddProject}
        defaultValues={editingProject || undefined}
        title={editingProject ? "Projeyi Düzenle" : "Yeni Proje"}
      />

      <TaskForm
        open={taskFormOpen}
        onOpenChange={(open) => {
          setTaskFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        defaultValues={editingTask || undefined}
        title={editingTask ? "Görevi Düzenle" : "Yeni Görev"}
      />
    </div>
  );
};

export default Index;
