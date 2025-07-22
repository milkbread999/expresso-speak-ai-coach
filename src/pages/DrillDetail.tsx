import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeechRecorder } from "@/components/SpeechRecorder";
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  CheckCircle, 
  Play,
  BookOpen,
  Users,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock drill data - in a real app this would come from an API
const drillsData = {
  1: {
    id: 1,
    title: "Pen Drill",
    description: "Practice articulation with a pen between your teeth to improve clarity and precision in speech",
    difficulty: "Beginner",
    duration: "5 min",
    tags: ["Articulation", "Clarity"],
    category: "Articulation",
    instructions: [
      "Place a pen or pencil horizontally between your teeth, holding it gently",
      "Read the provided text aloud while keeping the pen in place",
      "Focus on making each consonant and vowel sound as clear as possible",
      "Repeat the exercise 3 times, then remove the pen and read normally",
      "Notice the improved clarity in your regular speech"
    ],
    practiceText: "There are plenty of reasons to learn a foreign language before you travel. Perhaps you’re venturing beyond major tourist centers, or you want to be prepared for emergencies. Whatever the reason, speaking even a few words of the local language with residents can quickly elevate you from mere tourist to sympathetic traveler."

,
    tips: [
      "Start slowly and gradually increase your speed",
      "Don't bite down too hard on the pen - gentle pressure is enough",
      "Focus on tongue placement and lip movement",
      "Practice in front of a mirror to see your mouth movements"
    ],
    benefits: [
      "Improves consonant articulation",
      "Enhances speech clarity",
      "Strengthens oral muscles",
      "Helps control speed"
    ]
  },
  2: {
    id: 2,
    title: "Over-Enunciation",
    description: "Exaggerate consonants and vowels for clearer speech patterns",
    difficulty: "Intermediate",
    duration: "7 min",
    tags: ["Enunciation", "Precision"],
    category: "Pronunciation",
    instructions: [
      "Choose a short paragraph or the provided practice text",
      "Read through it first at normal speed",
      "Now read it again, exaggerating every consonant and vowel sound",
      "Make your mouth movements larger and more deliberate",
      "Finish by reading at normal speed again, maintaining the clarity"
    ],
    practiceText: "Peter Piper picked a peck of pickled peppers. Betty Botter bought some butter, but she said the butter's bitter. Six sick slick slim sycamore saplings.",
    tips: [
      "Exaggerate without losing the natural rhythm",
      "Pay special attention to consonant clusters",
      "Use more facial muscle engagement",
      "Record yourself to hear the difference"
    ],
    benefits: [
      "Develops muscle memory for clear speech",
      "Improves enunciation and clarity",
      "Enhances vocal projection",
      "Builds confidence in pronunciation"
    ]
  },
  3: {
    id: 3,
    title: "Tongue Twisters",
    description: "Challenge your pronunciation with rapid-fire phrases and complex sounds",
    difficulty: "Advanced",
    duration: "10 min",
    tags: ["Speed", "Pronunciation"],
    category: "Pronunciation",
    instructions: [
      "Start slow!",
      "Gradually increase speed while maintaining accuracy",
      "If you make a mistake, slow down and start again",
      "Practice each twister 5 times before moving to the next",
      "Focus on precision over speed initially"
    ],
    practiceText: "She sells seashells by the seashore. How can a clam cram in a clean cream can? I scream, you scream, we all scream for ice cream. Red leather, yellow leather. Six sick hicks nick six slick bricks with picks and sticks. Unique New York. You know you need unique New York.",
    tips: [
      "Accuracy first, speed second",
      "Break down difficult sound combinations",
      "Practice tongue placement for similar sounds",
      "Use a metronome to build steady rhythm"
    ],
    benefits: [
      "Improves articulation speed",
      "Enhances tongue agility",
      "Builds pronunciation confidence",
      "Develops speech motor control"
    ]
  }
};

const DrillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const drill = id ? drillsData[parseInt(id) as keyof typeof drillsData] : null;

  if (!drill) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Drill Not Found</h2>
          <Button onClick={() => navigate('/drills')}>
            Back to Drills
          </Button>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const markAsCompleted = () => {
    setIsCompleted(true);
    toast({
      title: "Drill completed! 🎉",
      description: "Great job! Your speaking skills are improving.",
    });
  };

  const progress = ((currentStep + 1) / drill.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/drills')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drills
          </Button>
          
          {isCompleted && (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Drill Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge 
                variant="outline" 
                className={`text-sm border ${getDifficultyColor(drill.difficulty)}`}
              >
                <Target className="w-3 h-3 mr-1" />
                {drill.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-3 h-3 mr-1" />
                {drill.duration}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <BookOpen className="w-3 h-3 mr-1" />
                {drill.category}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-foreground">{drill.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {drill.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {drill.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructions */}
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Instructions</h3>
                  <span className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {drill.instructions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {drill.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-colors ${
                      index === currentStep
                        ? 'bg-primary/10 border-primary/20'
                        : index < currentStep
                        ? 'bg-success/10 border-success/20'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        index < currentStep
                          ? 'bg-success text-success-foreground'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index < currentStep ? '✓' : index + 1}
                      </div>
                      <p className="text-foreground leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentStep < drill.instructions.length - 1) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        markAsCompleted();
                      }
                    }}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {currentStep === drill.instructions.length - 1 ? 'Complete Drill' : 'Next Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Practice Text */}
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Practice Text</h3>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <p className="text-foreground text-lg leading-relaxed font-medium">
                    "{drill.practiceText}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Speech Recorder */}
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Record Your Practice</h3>
                <p className="text-muted-foreground">
                  Record yourself doing this drill to get AI feedback
                </p>
              </CardHeader>
              <CardContent>
                <SpeechRecorder />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <h4 className="font-semibold text-foreground flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Pro Tips
                </h4>
              </CardHeader>
              <CardContent className="space-y-3">
                {drill.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader>
                <h4 className="font-semibold text-foreground flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Benefits
                </h4>
              </CardHeader>
              <CardContent className="space-y-3">
                {drill.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isCompleted ? (
                <Button 
                  onClick={markAsCompleted}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              ) : (
                <Button 
                  className="w-full bg-success hover:bg-success/90"
                  size="lg"
                  disabled
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed!
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => navigate('/drills')}
                className="w-full"
              >
                Back to All Drills
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DrillDetail;