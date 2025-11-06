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
  },
  4: {
    id: 4,
    title: "Breath Control",
    description: "Master your breathing for sustained and powerful speech delivery",
    difficulty: "Beginner",
    duration: "8 min",
    tags: ["Breathing", "Control"],
    category: "Breathing",
    instructions: [
      "Sit or stand with your back straight and shoulders relaxed",
      "Place one hand on your chest and the other on your abdomen",
      "Inhale slowly through your nose for 4 counts, feeling your abdomen expand",
      "Hold your breath for 4 counts",
      "Exhale slowly through your mouth for 6 counts, feeling your abdomen contract",
      "Repeat this cycle 10 times, focusing on smooth, controlled breathing"
    ],
    practiceText: "The ability to control your breath is fundamental to effective speaking. When you master breath control, you can speak longer sentences without running out of air, maintain consistent volume, and reduce vocal strain. Practice reading this passage while maintaining steady, controlled breathing throughout.",
    tips: [
      "Practice daily for best results",
      "Don't force your breathing - keep it natural and relaxed",
      "Focus on expanding your diaphragm, not just your chest",
      "Use this technique before important speeches or presentations"
    ],
    benefits: [
      "Increases speaking stamina",
      "Reduces vocal fatigue",
      "Improves volume control",
      "Enhances overall speech quality"
    ]
  },
  5: {
    id: 5,
    title: "Vocal Warm-ups",
    description: "Prepare your voice with targeted exercises before speaking",
    difficulty: "Beginner",
    duration: "6 min",
    tags: ["Warm-up", "Preparation"],
    category: "Vocal Health",
    instructions: [
      "Start with gentle humming - hum 'mmm' on a comfortable pitch for 30 seconds",
      "Practice lip trills - blow air through relaxed lips to create a 'brrr' sound",
      "Do tongue stretches - stick your tongue out and move it in circles",
      "Practice vowel sounds - say 'ah, eh, ee, oh, oo' slowly and clearly",
      "End with gentle scales - sing 'do-re-mi-fa-sol-fa-mi-re-do' on a comfortable range"
    ],
    practiceText: "Vocal warm-ups are essential for maintaining vocal health and preparing your voice for extended speaking. Just as athletes warm up before exercise, speakers should warm up their vocal cords before presentations, meetings, or any extended speaking activity.",
    tips: [
      "Always warm up before important speaking engagements",
      "Start gently and gradually increase intensity",
      "Stop if you feel any strain or discomfort",
      "Make warm-ups part of your daily routine"
    ],
    benefits: [
      "Prevents vocal strain and injury",
      "Improves vocal range and flexibility",
      "Enhances voice quality and clarity",
      "Increases speaking confidence"
    ]
  },
  6: {
    id: 6,
    title: "Pitch Variation",
    description: "Practice varying your vocal pitch for more engaging speech",
    difficulty: "Intermediate",
    duration: "9 min",
    tags: ["Pitch", "Variation", "Engagement"],
    category: "Expression",
    instructions: [
      "Read a sentence in a monotone voice (same pitch throughout)",
      "Read the same sentence again, varying your pitch naturally",
      "Practice emphasizing different words by changing pitch",
      "Experiment with rising pitch for questions and falling pitch for statements",
      "Record yourself and listen for natural pitch variation"
    ],
    practiceText: "The way you vary your pitch can make the difference between a captivating speech and a boring monologue. Pitch variation adds interest, emotion, and emphasis to your words. Practice reading this passage with natural pitch changes, emphasizing key words and phrases to convey meaning and emotion.",
    tips: [
      "Listen to skilled speakers and notice their pitch patterns",
      "Use pitch to emphasize important points",
      "Avoid monotone - it makes you sound disinterested",
      "Practice with different emotional tones"
    ],
    benefits: [
      "Makes speech more engaging and interesting",
      "Helps convey emotion and meaning",
      "Improves audience attention and retention",
      "Develops vocal expressiveness"
    ]
  },
  7: {
    id: 7,
    title: "Speed Control",
    description: "Learn to control your speaking pace for maximum comprehension",
    difficulty: "Intermediate",
    duration: "7 min",
    tags: ["Pace", "Control"],
    category: "Delivery",
    instructions: [
      "Read a passage at your normal speaking pace",
      "Read the same passage 20% slower, focusing on clarity",
      "Practice pausing after key points or at punctuation marks",
      "Read at a slightly faster pace while maintaining clarity",
      "Find your optimal speaking speed - clear but not too slow"
    ],
    practiceText: "Effective speakers know how to control their pace. Speaking too fast can overwhelm your audience, while speaking too slowly can bore them. The key is finding the right balance - fast enough to maintain interest, slow enough to be understood. Practice varying your pace to emphasize important points and give your audience time to process information.",
    tips: [
      "Aim for 150-160 words per minute for most audiences",
      "Slow down for complex or important information",
      "Use pauses strategically to emphasize points",
      "Practice with a metronome to develop consistent pacing"
    ],
    benefits: [
      "Improves audience comprehension",
      "Enhances speech clarity and impact",
      "Allows time for emphasis on key points",
      "Builds speaking confidence"
    ]
  },
  8: {
    id: 8,
    title: "Consonant Clusters",
    description: "Master difficult consonant combinations that trip up speakers",
    difficulty: "Advanced",
    duration: "12 min",
    tags: ["Consonants", "Difficulty"],
    category: "Articulation",
    instructions: [
      "Identify consonant clusters that are challenging for you",
      "Practice each cluster in isolation, saying it slowly and clearly",
      "Build up to saying the cluster in words",
      "Practice the words in sentences",
      "Repeat challenging clusters multiple times until they feel natural"
    ],
    practiceText: "Consonant clusters like 'str', 'spl', 'thr', and 'scr' can be particularly challenging. These combinations require precise tongue and lip placement. Practice saying words with difficult clusters: strength, splash, through, screen, three, split, thread, script. Focus on making each consonant sound clear and distinct.",
    tips: [
      "Break down clusters into individual sounds first",
      "Practice in front of a mirror to see mouth movements",
      "Start slow and gradually increase speed",
      "Focus on tongue placement for each consonant"
    ],
    benefits: [
      "Improves articulation precision",
      "Reduces speech errors and stumbles",
      "Enhances overall clarity",
      "Builds confidence with difficult sounds"
    ]
  },
  9: {
    id: 9,
    title: "Vowel Clarity",
    description: "Perfect your vowel sounds for crystal-clear pronunciation",
    difficulty: "Beginner",
    duration: "6 min",
    tags: ["Vowels", "Clarity"],
    category: "Pronunciation",
    instructions: [
      "Practice each vowel sound individually: a, e, i, o, u",
      "Say each vowel with your mouth open wide enough",
      "Hold each vowel sound for 2-3 seconds",
      "Practice vowel sounds in words, focusing on clarity",
      "Read sentences emphasizing clear vowel pronunciation"
    ],
    practiceText: "Clear vowel sounds are essential for understandable speech. Vowels carry the melody of language and are crucial for comprehension. Practice reading this passage with special attention to making each vowel sound distinct and clear: 'The quick brown fox jumps over the lazy dog. A perfect example of clear vowel pronunciation.'",
    tips: [
      "Open your mouth wider than you think necessary",
      "Practice in front of a mirror to see mouth shape",
      "Focus on one vowel sound at a time",
      "Record yourself to hear improvements"
    ],
    benefits: [
      "Improves overall speech clarity",
      "Makes speech more understandable",
      "Enhances pronunciation accuracy",
      "Builds foundation for advanced skills"
    ]
  },
  10: {
    id: 10,
    title: "Public Speaking Prep",
    description: "Prepare for presentations with confidence-building exercises",
    difficulty: "Advanced",
    duration: "15 min",
    tags: ["Public Speaking", "Confidence"],
    category: "Performance",
    instructions: [
      "Visualize yourself giving a successful presentation",
      "Practice your opening line until it feels natural",
      "Rehearse key transitions between main points",
      "Practice your conclusion with confidence",
      "Do a full run-through, including gestures and movement",
      "Time yourself to ensure you stay within your limit"
    ],
    practiceText: "Public speaking requires preparation, practice, and confidence. Whether you're presenting to a small team or a large audience, thorough preparation is key to success. Practice your material until you know it well, but not so well that you sound robotic. Find the balance between preparation and natural delivery.",
    tips: [
      "Know your material thoroughly but don't memorize word-for-word",
      "Practice in front of a mirror or record yourself",
      "Prepare for potential questions from the audience",
      "Arrive early to familiarize yourself with the space",
      "Use breathing exercises to calm nerves before speaking"
    ],
    benefits: [
      "Builds confidence for public speaking",
      "Reduces anxiety and nervousness",
      "Improves presentation delivery",
      "Enhances audience engagement"
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
                <SpeechRecorder drillId={drill.id} />
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