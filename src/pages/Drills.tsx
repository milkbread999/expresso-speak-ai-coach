import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DrillCard } from "@/components/DrillCard";
import { Mic, Search, Filter, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allDrills = [
  {
    id: 1,
    title: "Pen Drill",
    description: "Practice articulation with a pen between your teeth to improve clarity",
    difficulty: "Beginner",
    duration: "5 min",
    tags: ["Articulation", "Clarity"],
    category: "Articulation"
  },
  {
    id: 2,
    title: "Over-Enunciation",
    description: "Exaggerate consonants and vowels for clearer speech patterns",
    difficulty: "Intermediate",
    duration: "7 min",
    tags: ["Enunciation", "Precision"],
    category: "Pronunciation"
  },
  {
    id: 3,
    title: "Tongue Twisters",
    description: "Challenge your pronunciation with rapid-fire phrases and complex sounds",
    difficulty: "Advanced",
    duration: "10 min",
    tags: ["Speed", "Pronunciation"],
    category: "Pronunciation"
  },
  {
    id: 4,
    title: "Breath Control",
    description: "Master your breathing for sustained and powerful speech delivery",
    difficulty: "Beginner",
    duration: "8 min",
    tags: ["Breathing", "Control"],
    category: "Breathing"
  },
  {
    id: 5,
    title: "Vocal Warm-ups",
    description: "Prepare your voice with targeted exercises before speaking",
    difficulty: "Beginner",
    duration: "6 min",
    tags: ["Warm-up", "Preparation"],
    category: "Vocal Health"
  },
  {
    id: 6,
    title: "Pitch Variation",
    description: "Practice varying your vocal pitch for more engaging speech",
    difficulty: "Intermediate",
    duration: "9 min",
    tags: ["Pitch", "Variation", "Engagement"],
    category: "Expression"
  },
  {
    id: 7,
    title: "Speed Control",
    description: "Learn to control your speaking pace for maximum comprehension",
    difficulty: "Intermediate",
    duration: "7 min",
    tags: ["Pace", "Control"],
    category: "Delivery"
  },
  {
    id: 8,
    title: "Consonant Clusters",
    description: "Master difficult consonant combinations that trip up speakers",
    difficulty: "Advanced",
    duration: "12 min",
    tags: ["Consonants", "Difficulty"],
    category: "Articulation"
  },
  {
    id: 9,
    title: "Vowel Clarity",
    description: "Perfect your vowel sounds for crystal-clear pronunciation",
    difficulty: "Beginner",
    duration: "6 min",
    tags: ["Vowels", "Clarity"],
    category: "Pronunciation"
  },
  {
    id: 10,
    title: "Public Speaking Prep",
    description: "Prepare for presentations with confidence-building exercises",
    difficulty: "Advanced",
    duration: "15 min",
    tags: ["Public Speaking", "Confidence"],
    category: "Performance"
  }
];

const categories = ["All", "Articulation", "Pronunciation", "Breathing", "Vocal Health", "Expression", "Delivery", "Performance"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const Drills = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredDrills = allDrills.filter((drill) => {
    const matchesSearch = drill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || drill.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || drill.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Expresso
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-bold text-foreground">Speaking Drills</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master your speaking skills with our comprehensive collection of exercises
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-soft border-0 bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search drills, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === category 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-3">
                <span className="text-sm font-medium text-foreground">Difficulty</span>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Badge
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedDifficulty === difficulty 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDrills.length} of {allDrills.length} drills
          </p>
        </div>

        {/* Drills Grid */}
        {filteredDrills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrills.map((drill) => (
              <DrillCard key={drill.id} drill={drill} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-muted/30">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">No drills found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Drills;