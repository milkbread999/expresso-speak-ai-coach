import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpeechRecorder } from "@/components/SpeechRecorder";
import { DrillCard } from "@/components/DrillCard";
import { Mic, Target, BookOpen, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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


        <div className="text-center">
            <Button 
              onClick={() => window.open('https://calendly.com/speakexpresso/30min', '_blank')}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 transition-opacity mr-4"
            >
              Try Free 1:1 Coaching
            </Button>
          </div>


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

        {/* Testimonials Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-foreground">What Our Users Say</h3>
            <p className="text-muted-foreground">
              Real feedback from people who've improved their speaking skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80 hover:shadow-large transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg">
                      S
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sydney</h4>
                      <p className="text-sm text-muted-foreground">High School Student</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "Expresso's work with our mock trial team was super helpful. The steps they provided for better speaking were specific and attainable, making it very easy to follow."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80 hover:shadow-large transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Abhi</h4>
                      <p className="text-sm text-muted-foreground">Entrepreneur</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                  "Working with Expresso has really helped me alleviate the pressure to be perfect that's often associated with public speaking and find my love for communication!”                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80 hover:shadow-large transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Manav</h4>
                      <p className="text-sm text-muted-foreground">IT Professional</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                  "Expresso provided awesome coaching. It was really likeable way of teaching. I’m really grateful to connect with Expresso. Thanks for doing public speaking sessions!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80 hover:shadow-large transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg">
                      E
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Edden</h4>
                      <p className="text-sm text-muted-foreground">High SchoolStudent</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                  "Getting public speaking training has pushed me to think on my feet and speak confidently even if I feel unready."                  </p>
                </div>
              </CardContent>
            </Card>
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
