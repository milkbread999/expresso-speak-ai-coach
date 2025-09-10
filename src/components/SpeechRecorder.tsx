import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Pause, RotateCcw, TrendingUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RecordingState = 'idle' | 'recording' | 'stopped' | 'analyzing';

export const SpeechRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Array<{category: string, score: number, feedback: string}> | null>(null);
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
        // Use the actual recorded format instead of forcing wav
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        console.log("🎯 Recording stopped");
        console.log("📊 Recorded blob info:", {
          size: blob.size,
          type: blob.type,
          actualMimeType: mediaRecorder.mimeType
        });
        
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
        description: "Click analyze to get AI feedback and transcription",
      });
    }
  };

  const analyzeRecording = async () => {
    if (!audioURL) return;
  
    setRecordingState("analyzing");
    setAnalysisProgress(0);
  
    const blob = await fetch(audioURL).then((res) => res.blob());
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
  
    try {
      // Step 1: Transcribe
      setAnalysisProgress(25);
      console.log("Starting transcription...");
      
      const transcriptionRes = await fetch("http://localhost:5000/api/speech-to-text-whisper", {
        method: "POST",
        body: formData,
      });
  
      console.log("Transcription response status:", transcriptionRes.status);
      
      if (!transcriptionRes.ok) {
        const errorText = await transcriptionRes.text();
        console.error("Transcription error response:", errorText);
        throw new Error(`Transcription failed: ${transcriptionRes.status} - ${errorText}`);
      }
  
      const transcriptionData = await transcriptionRes.json();
      console.log("Transcription response:", transcriptionData);
      
      if (!transcriptionData.transcription) {
        throw new Error("No transcription received from server");
      }
      
      const { transcription } = transcriptionData;
      setTranscript(transcription);
      setAnalysisProgress(50);
      
      toast({
        title: "Transcription complete",
        description: "Now analyzing your speech...",
      });
  
      // Step 2: Analyze
      setAnalysisProgress(75);
      console.log("Starting analysis with transcription:", transcription);
      
      const analysisRes = await fetch("http://localhost:5000/api/analyze-transcription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
  
      console.log("Analysis response status:", analysisRes.status);
      
      if (!analysisRes.ok) {
        const errorText = await analysisRes.text();
        console.error("Analysis error response:", errorText);
        throw new Error(`Analysis failed: ${analysisRes.status} - ${errorText}`);
      }
  
      const analysisData = await analysisRes.json();
      console.log("Analysis response:", analysisData);
      
      const { analysis } = analysisData;
      
      // Check if analysis exists and is valid
      if (!analysis) {
        throw new Error("Analysis response is empty or undefined");
      }
      
      let parsedFeedback;
      try {
        // Try to parse if it's a JSON string
        if (typeof analysis === 'string') {
          parsedFeedback = JSON.parse(analysis);
        } else {
          // If it's already an object, use it directly
          parsedFeedback = analysis;
        }
        
        // Validate the structure
        if (!Array.isArray(parsedFeedback)) {
          throw new Error("Analysis should be an array of feedback items");
        }
        
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Raw analysis data:", analysis);
        throw new Error(`Invalid analysis format: ${parseError.message}`);
      }
      
      setFeedback(parsedFeedback);
      setAnalysisProgress(100);
      setRecordingState("stopped");
  
      toast({
        title: "Analysis complete",
        description: "Your transcript and detailed AI feedback are ready!",
      });
      
    } catch (error) {
      console.error("Analysis failed:", error);
      
      // Show different messages based on error type
      let errorMessage = "Please try again";
      let errorTitle = "Analysis failed";
      
      if (error.message.includes("500")) {
        errorMessage = "Server error - check your backend logs";
        errorTitle = "Server Error (500)";
      } else if (error.message.includes("404")) {
        errorMessage = "API endpoint not found - check your server routes";
        errorTitle = "Endpoint Not Found (404)";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to server - is it running on port 5000?";
        errorTitle = "Connection Failed";
      } else if (error.message.includes("Transcription failed")) {
        errorMessage = error.message;
        errorTitle = "Transcription Error";
      } else {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      
      setRecordingState("stopped");
      setAnalysisProgress(0);
    }
  };
  

  const resetRecording = () => {
    setRecordingState('idle');
    setDuration(0);
    setAudioURL(null);
    setTranscript(null);
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
                  : 'bg-gradient-hero hover:opacity-90'
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
            className="bg-gradient-hero hover:opacity-90"
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

      {/* Transcript Display */}
      {transcript && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Speech Transcript</h4>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-blue-100 dark:border-blue-700">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
              
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Words: {transcript.split(/\s+/).filter(word => word.length > 0).length} | 
                Characters: {transcript.length}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
     
    </div>
  );
};