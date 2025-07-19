import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Drill {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tags: string[];
  completed?: boolean;
}

interface DrillCardProps {
  drill: Drill;
}

export const DrillCard = ({ drill }: DrillCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success hover:bg-success/20';
      case 'intermediate':
        return 'bg-accent/10 text-accent hover:bg-accent/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {drill.title}
              </h3>
              {drill.completed && (
                <CheckCircle className="w-4 h-4 text-success animate-bounce-check" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {drill.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {drill.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-muted/50 hover:bg-muted transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{drill.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Target className="w-3 h-3" />
              <Badge 
                variant="outline" 
                className={`text-xs border-0 ${getDifficultyColor(drill.difficulty)}`}
              >
                {drill.difficulty}
              </Badge>
            </div>
          </div>

          <Button 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
            onClick={() => navigate(`/drill/${drill.id}`)}
          >
            Start Drill
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};