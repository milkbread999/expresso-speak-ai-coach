import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Clock, Target, Trophy, PlayCircle, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrainingPlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  totalDrills: number;
  completedDrills: number;
  category: string;
  goals: string[];
  drills: Array<{
    id: number;
    title: string;
    duration: string;
    completed: boolean;
    week: number;
  }>;
}

const trainingPlans: TrainingPlan[] = [
  {
    id: 1,
    title: "Beginner's Foundation",
    description: "Build confidence and clarity in your everyday speech with fundamental exercises",
    duration: "4 weeks",
    level: "Beginner",
    totalDrills: 12,
    completedDrills: 3,
    category: "Foundation",
    goals: ["Improve clarity", "Build confidence", "Master basics"],
    drills: [
      { id: 1, title: "Breathing Fundamentals", duration: "5 min", completed: true, week: 1 },
      { id: 4, title: "Vowel Clarity", duration: "6 min", completed: true, week: 1 },
      { id: 5, title: "Basic Vocal Warm-ups", duration: "6 min", completed: true, week: 1 },
      { id: 2, title: "Simple Articulation", duration: "7 min", completed: false, week: 2 },
      { id: 6, title: "Pace Control Basics", duration: "7 min", completed: false, week: 2 },
      { id: 7, title: "Basic Projection", duration: "8 min", completed: false, week: 2 },
      { id: 8, title: "Consonant Practice", duration: "8 min", completed: false, week: 3 },
      { id: 9, title: "Rhythm Exercises", duration: "9 min", completed: false, week: 3 },
      { id: 10, title: "Simple Presentations", duration: "10 min", completed: false, week: 3 },
      { id: 11, title: "Confidence Building", duration: "10 min", completed: false, week: 4 },
      { id: 12, title: "Final Assessment", duration: "15 min", completed: false, week: 4 },
    ]
  },
  {
    id: 3,
    title: "Accent Refinement",
    description: "Reduce accent interference and enhance pronunciation clarity",
    duration: "8 weeks",
    level: "Intermediate",
    totalDrills: 24,
    completedDrills: 7,
    category: "Pronunciation",
    goals: ["Reduce accent", "Perfect pronunciation", "Increase clarity"],
    drills: [
      { id: 1, title: "Sound Assessment", duration: "10 min", completed: true, week: 1 },
      { id: 2, title: "Vowel Mapping", duration: "12 min", completed: true, week: 1 },
      { id: 3, title: "Consonant Clusters", duration: "15 min", completed: true, week: 1 },
      { id: 4, title: "Intonation Patterns", duration: "12 min", completed: true, week: 2 },
      { id: 5, title: "Word Stress", duration: "10 min", completed: true, week: 2 },
      { id: 6, title: "Sentence Rhythm", duration: "15 min", completed: true, week: 2 },
      { id: 7, title: "Linking Sounds", duration: "12 min", completed: true, week: 3 },
      { id: 8, title: "Reduction Practice", duration: "10 min", completed: false, week: 3 },
      // ... more drills would be here
    ]
  }
];

const TrainingPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'advanced':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressPercentage = (plan: TrainingPlan) => {
    return (plan.completedDrills / plan.totalDrills) * 100;
  };

  if (selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedPlan(null)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Plan Header */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge className={`border ${getLevelColor(selectedPlan.level)}`}>
                    {selectedPlan.level}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {selectedPlan.duration}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedPlan.category}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-foreground">{selectedPlan.title}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  {selectedPlan.description}
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {Math.round(getProgressPercentage(selectedPlan))}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-muted-foreground">
                  {selectedPlan.completedDrills} of {selectedPlan.totalDrills} drills
                </span>
              </div>
              <Progress value={getProgressPercentage(selectedPlan)} className="h-3" />
            </div>

            {/* Goals */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Goals</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.goals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Week-by-week breakdown */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => {
              const weekDrills = selectedPlan.drills.filter(drill => drill.week === week);
              if (weekDrills.length === 0) return null;

              const completedInWeek = weekDrills.filter(drill => drill.completed).length;
              const weekProgress = (completedInWeek / weekDrills.length) * 100;

              return (
                <Card key={week} className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-foreground">Week {week}</h3>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-muted-foreground">
                          {completedInWeek}/{weekDrills.length} complete
                        </div>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${weekProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weekDrills.map((drill) => (
                        <div
                          key={drill.id}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                            drill.completed 
                              ? 'bg-success/10 border-success/20' 
                              : 'bg-muted/30 border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              drill.completed 
                                ? 'bg-success text-success-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {drill.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <PlayCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{drill.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{drill.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={drill.completed ? "secondary" : "outline"}
                            onClick={() => navigate(`/drill/${drill.id}`)}
                            className={drill.completed ? "" : "hover:bg-primary hover:text-primary-foreground"}
                          >
                            {drill.completed ? "Review" : "Start"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <img 
                  src="expressologo.png" 
                  alt="Expresso Logo" 
                  className="w-5 h-5"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Expresso
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-foreground">Training Plans</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow structured programs designed by experienced speakers
          </p>
        </div>

        {/* Training Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-card to-card/80"
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`border ${getLevelColor(plan.level)}`}>
                      {plan.level}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{plan.duration}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {plan.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {Math.round(getProgressPercentage(plan))}%
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(plan)} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {plan.completedDrills} of {plan.totalDrills} drills completed
                  </div>
                </div>

                {/* Goals Preview */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Goals</div>
                  <div className="flex flex-wrap gap-1">
                    {plan.goals.slice(0, 2).map((goal, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                    {plan.goals.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{plan.goals.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                  }}
                >
                  {plan.completedDrills > 0 ? 'Continue Plan' : 'Start Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrainingPlans;