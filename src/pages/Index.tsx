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
import { LayoutDashboard, FolderKanban, ListTodo, Users, Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
};

type Project = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  team: string;
  progress: number;
  status: "active" | "completed" | "pending";
};

type TeamMember = {
  id: string;
  name: string;
  phone: string;
  specialty: string;
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
        },
        {
          id: "2",
          title: "Dış Cephe Boyası",
          project: "İş Merkezi - Levent",
          assignee: "Mehmet Demir Ekibi",
          dueDate: "20 Şubat 2024",
          status: "pending",
          priority: "medium",
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
        },
        {
          id: "2",
          title: "İş Merkezi",
          location: "Levent, İstanbul",
          startDate: "12 Ocak 2024",
          team: "Mehmet Demir Ekibi",
          progress: 40,
          status: "active",
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
        },
        {
          id: "2",
          name: "Mehmet Demir",
          phone: "0555 987 65 43",
          specialty: "Boyacı",
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
