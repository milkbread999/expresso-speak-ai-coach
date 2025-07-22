import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, RotateCcw, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RecordingState = 'idle' | 'recording' | 'stopped' | 'analyzing';

export const SpeechRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Array<{ category: string, score: number, feedback: string }> | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);

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
      if (timerRef.current) clearInterval(timerRef.current);

      toast({
        title: "Recording stopped",
        description: "Click analyze to get AI feedback",
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
      // Transcription
      const transcriptionRes = await fetch("http://localhost:5000/api/speech-to-text-whisper", {
        method: "POST",
        body: formData,
      });

      const { transcription } = await transcriptionRes.json();
      setTranscript(transcription);

      // Analysis
      const analysisRes = await fetch("http://localhost:5000/api/analyze-transcription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });

      const { analysis } = await analysisRes.json();
      console.log("Received analysis:", analysis);
      const parsedFeedback = analysis; // assuming backend returns a JSON string
      setFeedback(parsedFeedback);
      setRecordingState("stopped");

      toast({
        title: "Analysis complete",
        description: "Your detailed AI feedback and transcript are ready!",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
      setRecordingState("stopped");
    }
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setDuration(0);
    setAudioURL(null);
    setFeedback(null);
    setTranscript(null);
    setAnalysisProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStateDisplay = () => {
    switch (recordingState) {
      case 'recording': return { text: 'Recording...', color: 'destructive' };
      case 'stopped': return { text: 'Ready to analyze', color: 'default' };
      case 'analyzing': return { text: 'Analyzing...', color: 'default' };
      default: return { text: 'Ready to record', color: 'secondary' };
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
              className={`w-24 h-24 rounded-full text-xl ${recordingState === 'recording' ? 'animate-pulse-record' : 'bg-gradient-hero hover:opacity-90'}`}
              onClick={recordingState === 'recording' ? stopRecording : startRecording}
              disabled={recordingState === 'analyzing'}
            >
              {recordingState === 'recording' ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
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
      {recordingState === 'stopped' && !feedback && (
        <div className="flex justify-center space-x-3">
          <Button onClick={analyzeRecording} className="bg-gradient-hero hover:opacity-90">
            Analyze Speech
          </Button>
          <Button variant="outline" onClick={resetRecording}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">Transcript</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Feedback */}

      {feedback && (
  <Card className="bg-muted/50">
    <CardContent className="p-4">
      <h4 className="text-lg font-semibold text-foreground mb-2">AI Feedback</h4>
      <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
        {typeof feedback === 'string' ? feedback : JSON.stringify(feedback, null, 2)}
      </pre>
    </CardContent>
  </Card>
)}



      {/* {feedback && (
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success-foreground" />
                </div>
                <h4 className="font-semibold text-success">Detailed AI Analysis</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.map((item, index) => (
                  <div key={index} className="bg-card/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-foreground capitalize">{item.category}</h5>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">{item.score}/100</div>
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${item.score >= 85
                                ? 'bg-success'
                                : item.score >= 70
                                  ? 'bg-accent'
                                  : 'bg-destructive'
                              }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{item.feedback}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Overall Score</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {Math.round(feedback.reduce((acc, item) => acc + item.score, 0) / feedback.length)}/100
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(() => {
                      const avg = feedback.reduce((acc, item) => acc + item.score, 0) / feedback.length;
                      return avg >= 85 ? 'Excellent!' : avg >= 70 ? 'Good job!' : 'Keep practicing!';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};
