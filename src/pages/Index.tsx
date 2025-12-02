import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskItem } from "@/components/TaskItem";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { TeamMemberForm } from "@/components/TeamMemberForm";
import { ProjectForm } from "@/components/ProjectForm";
import { TaskForm } from "@/components/TaskForm";
import { LayoutDashboard, FolderKanban, ListTodo, Users, Plus, Building2, Pencil, Trash2, DollarSign, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { projects, isLoading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
  const { tasks, isLoading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();
  const { teamMembers, isLoading: membersLoading, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ id: taskId, status: newStatus });
    }
  };

  const handleAddTeamMember = (data: any) => {
    addTeamMember(data);
    setTeamFormOpen(false);
  };

  const handleEditTeamMember = (data: any) => {
    if (!editingTeamMember) return;
    updateTeamMember({ id: editingTeamMember.id, ...data });
    setEditingTeamMember(null);
    setTeamFormOpen(false);
  };

  const handleDeleteTeamMember = (id: string) => {
    deleteTeamMember(id);
  };

  const handleAddProject = (data: any) => {
    const projectData = {
      title: data.title,
      description: data.description || "",
      status: data.status,
      progress: data.progress,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedTeam: data.assignedTeam ? data.assignedTeam.split(',').map((t: string) => t.trim()) : [],
      budget: data.budget,
      actualCost: data.actualCost,
      revenue: data.revenue,
      photos: data.photos || [],
    };
    addProject(projectData);
    setProjectFormOpen(false);
  };

  const handleEditProject = (data: any) => {
    if (!editingProject) return;
    const projectData = {
      id: editingProject.id,
      title: data.title,
      description: data.description || "",
      status: data.status,
      progress: data.progress,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedTeam: data.assignedTeam ? data.assignedTeam.split(',').map((t: string) => t.trim()) : [],
      budget: data.budget,
      actualCost: data.actualCost,
      revenue: data.revenue,
      photos: data.photos || [],
    };
    updateProject(projectData);
    setEditingProject(null);
    setProjectFormOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  const handleAddTask = (data: any) => {
    const taskData = {
      title: data.title,
      description: "",
      status: data.status,
      priority: data.priority,
      projectId: data.project,
      assignedTo: data.assignee,
      dueDate: data.dueDate,
      estimatedCost: data.estimatedCost,
    };
    addTask(taskData);
    setTaskFormOpen(false);
  };

  const handleEditTask = (data: any) => {
    if (!editingTask) return;
    const taskData = {
      id: editingTask.id,
      title: data.title,
      description: "",
      status: data.status,
      priority: data.priority,
      projectId: data.project,
      assignedTo: data.assignee,
      dueDate: data.dueDate,
      estimatedCost: data.estimatedCost,
    };
    updateTask(taskData);
    setEditingTask(null);
    setTaskFormOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  if (projectsLoading || tasksLoading || membersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="bg-primary p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{t('app.title')}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{t('app.dashboard')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <LanguageSelector />
              <Button variant="outline" onClick={signOut} size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('app.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-muted w-full sm:w-auto overflow-x-auto flex justify-start sm:justify-center">
            <TabsTrigger value="dashboard" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('app.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">{t('app.projects')}</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">{t('app.tasks')}</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('app.team')}</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">{t('app.economy')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t('stats.totalProjects')}
                value={projects.filter(p => p.status === 'active').length}
                icon={FolderKanban}
                variant="default"
              />
              <StatsCard
                title={t('stats.activeTasks')}
                value={tasks.filter(t => t.status === 'in-progress').length}
                icon={ListTodo}
                variant="info"
              />
              <StatsCard
                title={t('common.edit')}
                value={tasks.filter(t => t.status === 'completed').length}
                icon={ListTodo}
                variant="success"
              />
              <StatsCard
                title={t('stats.teamMembers')}
                value={teamMembers.length}
                icon={Users}
                variant="warning"
              />
            </div>

            {/* Recent Projects */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.projects')}</h2>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projects.filter(p => p.status === 'active').slice(0, 3).map(project => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    location={project.description}
                    startDate={project.startDate}
                    team={project.assignedTeam.join(', ')}
                    progress={project.progress}
                    status={project.status as any}
                    photos={project.photos}
                    onClick={() => {
                      setEditingProject(project);
                      setProjectFormOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.tasks')}</h2>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map(task => (
                  <TaskItem
                    key={task.id}
                    title={task.title}
                    project={projects.find(p => p.id === task.projectId)?.title || "Proje Yok"}
                    assignee={task.assignedTo}
                    dueDate={task.dueDate}
                    status={task.status as any}
                    priority={task.priority as any}
                    onStatusChange={(status) => handleStatusChange(task.id, status)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.projects')}</h2>
              <Button onClick={() => {
                setEditingProject(null);
                setProjectFormOpen(true);
              }} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('project.add')}
              </Button>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <div key={project.id} className="relative group">
                  <ProjectCard
                    title={project.title}
                    location={project.description}
                    startDate={project.startDate}
                    team={project.assignedTeam.join(', ')}
                    progress={project.progress}
                    status={project.status as any}
                    photos={project.photos}
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

          <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.tasks')}</h2>
              <Button onClick={() => {
                setEditingTask(null);
                setTaskFormOpen(true);
              }} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('task.add')}
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex gap-2 group">
                  <div className="flex-1">
                    <TaskItem 
                      title={task.title}
                      project={projects.find(p => p.id === task.projectId)?.title || "Proje Yok"}
                      assignee={task.assignedTo}
                      dueDate={task.dueDate}
                      status={task.status as any}
                      priority={task.priority as any}
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

          <TabsContent value="teams" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.team')}</h2>
              <Button onClick={() => {
                setEditingTeamMember(null);
                setTeamFormOpen(true);
              }} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('team.add')}
              </Button>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map(member => (
                <TeamMemberCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  phone={member.phone}
                  specialty={member.specialty}
                  dailyWage={member.dailyWage}
                  totalReceivable={member.totalReceivable}
                  totalPaid={member.totalPaid}
                  onEdit={() => {
                    setEditingTeamMember(member);
                    setTeamFormOpen(true);
                  }}
                  onDelete={() => handleDeleteTeamMember(member.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('app.economy')}</h2>
            
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title={t('stats.totalBudget')}
                value={`₺${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}`}
                icon={DollarSign}
                variant="default"
              />
              <StatsCard
                title={t('stats.totalRevenue')}
                value={`₺${projects.reduce((sum, p) => sum + (p.revenue || 0), 0).toLocaleString()}`}
                icon={DollarSign}
                variant="success"
              />
              <StatsCard
                title={t('stats.totalCost')}
                value={`₺${projects.reduce((sum, p) => sum + (p.actualCost || 0), 0).toLocaleString()}`}
                icon={DollarSign}
                variant="warning"
              />
              <StatsCard
                title={t('stats.netProfit')}
                value={`₺${(projects.reduce((sum, p) => sum + (p.revenue || 0), 0) - projects.reduce((sum, p) => sum + (p.actualCost || 0), 0)).toLocaleString()}`}
                icon={DollarSign}
                variant="info"
              />
            </div>

            {/* Project Financial Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Proje Bazlı Finansal Durum</h3>
              <div className="grid gap-4">
                {projects.map(project => {
                  const profit = (project.revenue || 0) - (project.actualCost || 0);
                  const isProfitable = profit >= 0;
                  
                  return (
                    <div key={project.id} className="p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{project.title}</h4>
                        <span className={`text-sm font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                          {isProfitable ? '+' : ''}{profit.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Bütçe</p>
                          <p className="font-semibold">{(project.budget || 0).toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Gelir</p>
                          <p className="font-semibold text-green-600">{(project.revenue || 0).toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Maliyet</p>
                          <p className="font-semibold text-orange-600">{(project.actualCost || 0).toLocaleString('tr-TR')} ₺</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Bütçe Kullanımı</span>
                          <span className="font-medium">
                            {project.budget > 0 ? Math.round(((project.actualCost || 0) / project.budget) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(project.budget > 0 ? ((project.actualCost || 0) / project.budget) * 100 : 0, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Costs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Görev Maliyetleri</h3>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {projects.find(p => p.id === task.projectId)?.title || "Proje Yok"}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground">
                        {(task.estimatedCost || 0).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t-2 border-border">
                    <span className="font-bold text-foreground">Toplam Tahmini Maliyet</span>
                    <span className="font-bold text-lg text-foreground">
                      {tasks.reduce((sum, t) => sum + (t.estimatedCost || 0), 0).toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Costs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Ekip Maliyetleri</h3>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="space-y-3">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {(member.dailyWage || 0).toLocaleString('tr-TR')} ₺/gün
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ~{((member.dailyWage || 0) * 26).toLocaleString('tr-TR')} ₺/ay
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t-2 border-border">
                    <span className="font-bold text-foreground">Toplam Günlük Ekip Maliyeti</span>
                    <span className="font-bold text-lg text-foreground">
                      {teamMembers.reduce((sum, m) => sum + (m.dailyWage || 0), 0).toLocaleString('tr-TR')} ₺/gün
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <TeamMemberForm
        open={teamFormOpen}
        onOpenChange={(open) => {
          setTeamFormOpen(open);
          if (!open) setEditingTeamMember(null);
        }}
        onSubmit={editingTeamMember ? handleEditTeamMember : handleAddTeamMember}
        title={editingTeamMember ? t('team.edit') : t('team.add')}
        defaultValues={editingTeamMember ? {
          name: editingTeamMember.name,
          phone: editingTeamMember.phone,
          specialty: editingTeamMember.specialty,
          dailyWage: editingTeamMember.dailyWage,
          totalReceivable: editingTeamMember.totalReceivable || 0,
          totalPaid: editingTeamMember.totalPaid || 0,
        } : undefined}
      />

      <ProjectForm
        open={projectFormOpen}
        onOpenChange={(open) => {
          setProjectFormOpen(open);
          if (!open) setEditingProject(null);
        }}
        onSubmit={editingProject ? handleEditProject : handleAddProject}
        title={editingProject ? t('project.edit') : t('project.add')}
        defaultValues={editingProject ? {
          title: editingProject.title,
          description: editingProject.description,
          startDate: editingProject.startDate,
          endDate: editingProject.endDate,
          assignedTeam: editingProject.assignedTeam.join(', '),
          progress: editingProject.progress,
          status: editingProject.status,
          budget: editingProject.budget,
          actualCost: editingProject.actualCost,
          revenue: editingProject.revenue,
          photos: editingProject.photos || [],
        } : undefined}
      />

      <TaskForm
        open={taskFormOpen}
        onOpenChange={(open) => {
          setTaskFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        title={editingTask ? t('task.edit') : t('task.add')}
        projects={projects}
        teamMembers={teamMembers}
        defaultValues={editingTask ? {
          title: editingTask.title,
          project: editingTask.projectId,
          assignee: editingTask.assignedTo,
          dueDate: editingTask.dueDate,
          status: editingTask.status,
          priority: editingTask.priority,
          estimatedCost: editingTask.estimatedCost,
        } : undefined}
      />
    </div>
  );
};

export default Index;
