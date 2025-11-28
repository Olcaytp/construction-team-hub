import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users } from "lucide-react";

interface ProjectCardProps {
  title: string;
  location: string;
  startDate: string;
  team: string;
  progress: number;
  status: "active" | "completed" | "pending";
  onClick?: () => void;
}

export const ProjectCard = ({ 
  title, 
  location, 
  startDate, 
  team, 
  progress, 
  status,
  onClick 
}: ProjectCardProps) => {
  const statusColors = {
    active: "bg-success text-success-foreground",
    completed: "bg-muted text-muted-foreground",
    pending: "bg-warning text-warning-foreground",
  };

  const statusLabels = {
    active: "Devam Ediyor",
    completed: "Tamamlandı",
    pending: "Bekliyor",
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {startDate}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {team}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">İlerleme</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
