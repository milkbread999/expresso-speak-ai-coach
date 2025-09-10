import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpeechRecorder } from "@/components/SpeechRecorder";
import { DrillCard } from "@/components/DrillCard";
import { Mic, Target, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featuredDrills = [
  {
    id: 1,
    title: "Pen Drill",
    description: "Practice articulation with a pen between your teeth",
    difficulty: "Beginner",
    duration: "5 min",
    tags: ["Articulation", "Clarity"]
  },
  {
    id: 2,
    title: "Over-Enunciation",
    description: "Exaggerate consonants and vowels for clearer speech",
    difficulty: "Intermediate",
    duration: "7 min",
    tags: ["Enunciation", "Precision"]
  },
  {
    id: 3,
    title: "Tongue Twisters",
    description: "Challenge your pronunciation with rapid-fire phrases",
    difficulty: "Advanced",
    duration: "10 min",
    tags: ["Speed", "Pronunciation"]
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft">
              <img 
                src="expressologo.png" 
                alt="Expresso Logo" 
                className="w-6 h-6"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Expresso
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/drills')}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            All Drills
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground block bg-gradient-hero bg-clip-text text-transparent">Expresso</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Public speaking coaching made for you.
            </h2>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary" />
              <span>15+ Drills</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-accent" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Blog + Live Coaching</span>
            </div>
          </div>
        </section>

        {/* Speech Recorder Section */}
        <section className="max-w-2xl mx-auto">
          <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-8">
              <div className="text-center space-y-4 mb-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Start Your Practice
                </h3>
                <p className="text-muted-foreground">
                  Record yourself speaking and get instant AI feedback on your performance
                </p>
              </div>
              <SpeechRecorder />
            </CardContent>
          </Card>
        </section>

        {/* Featured Drills */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-foreground">Featured Drills</h3>
            <p className="text-muted-foreground">
              Popular exercises to improve your speaking skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDrills.map((drill) => (
              <DrillCard key={drill.id} drill={drill} />
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/drills')}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 transition-opacity mr-4"
            >
              Explore All Drills
            </Button>
            <Button 
              onClick={() => navigate('/training-plans')}
              size="lg"
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Training Plans
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Expresso. Improve your speaking skills with AI-powered coaching.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
