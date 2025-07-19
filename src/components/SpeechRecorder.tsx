import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RecordingState = 'idle' | 'recording' | 'stopped' | 'analyzing';

export const SpeechRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access and try again",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast({
        title: "Recording stopped",
        description: "Click analyze to get AI feedback",
      });
    }
  };

  const analyzeRecording = async () => {
    if (!audioURL) return;

    setRecordingState('analyzing');
    setAnalysisProgress(0);

    // Simulate AI analysis with progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simulate AI feedback
          const feedbackOptions = [
            "Great clarity! Your consonants are well-articulated. Try speaking 10% slower for even better precision.",
            "Good volume control. Work on emphasizing key words more distinctly to improve engagement.",
            "Excellent pacing! Your speech rhythm is natural. Consider adding more vocal variety for emphasis.",
            "Clear pronunciation overall. Focus on completing word endings for maximum clarity.",
            "Strong vocal projection! Try varying your tone more to keep listeners engaged."
          ];
          
          const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
          setFeedback(randomFeedback);
          setRecordingState('stopped');
          
          toast({
            title: "Analysis complete",
            description: "Your AI feedback is ready!",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setDuration(0);
    setAudioURL(null);
    setFeedback(null);
    setAnalysisProgress(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStateDisplay = () => {
    switch (recordingState) {
      case 'recording':
        return { text: 'Recording...', color: 'destructive' };
      case 'stopped':
        return { text: 'Ready to analyze', color: 'default' };
      case 'analyzing':
        return { text: 'Analyzing...', color: 'default' };
      default:
        return { text: 'Ready to record', color: 'secondary' };
    }
  };

  const stateDisplay = getRecordingStateDisplay();

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Button
              size="lg"
              variant={recordingState === 'recording' ? 'destructive' : 'default'}
              className={`w-24 h-24 rounded-full text-xl ${
                recordingState === 'recording' 
                  ? 'animate-pulse-record' 
                  : 'bg-gradient-primary hover:opacity-90'
              }`}
              onClick={recordingState === 'recording' ? stopRecording : startRecording}
              disabled={recordingState === 'analyzing'}
            >
              {recordingState === 'recording' ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
            
            {recordingState === 'recording' && (
              <div className="absolute -right-2 -top-2">
                <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-destructive-foreground rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant={stateDisplay.color as any} className="text-sm">
            {stateDisplay.text}
          </Badge>
          {(recordingState === 'recording' || recordingState === 'stopped') && (
            <p className="text-2xl font-mono font-semibold text-foreground">
              {formatTime(duration)}
            </p>
          )}
        </div>
      </div>

      {/* Analysis Progress */}
      {recordingState === 'analyzing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Analyzing your speech...</span>
            <span>{analysisProgress}%</span>
          </div>
          <Progress value={analysisProgress} className="h-2" />
        </div>
      )}

      {/* Audio Playback */}
      {audioURL && recordingState !== 'analyzing' && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Play className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recorded Audio</span>
              </div>
              <audio controls src={audioURL} className="h-8" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {recordingState === 'stopped' && (
        <div className="flex justify-center space-x-3">
          <Button
            onClick={analyzeRecording}
            className="bg-gradient-primary hover:opacity-90"
          >
            Analyze Speech
          </Button>
          <Button
            variant="outline"
            onClick={resetRecording}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}

      {/* AI Feedback */}
      {feedback && (
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4 text-success-foreground" />
                </div>
                <h4 className="font-semibold text-success">AI Feedback</h4>
              </div>
              <p className="text-foreground leading-relaxed">{feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};