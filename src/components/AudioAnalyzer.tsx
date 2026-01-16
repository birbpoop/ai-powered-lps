import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, RotateCcw, Star, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AudioMetrics {
  intensity: number;
  pitchStability: number;
  harmonicity: number;
  spectralClarity: number;
  energyDistribution: number;
}

interface AnalysisResult {
  overallClarity: number;
  clarityLevel: string;
  stars: number;
  metrics: AudioMetrics;
  suggestions: string[];
}

interface AudioAnalyzerProps {
  targetText: string;
  onComplete?: (result: AnalysisResult) => void;
}

const AudioAnalyzer = ({ targetText, onComplete }: AudioAnalyzerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Simulate Praat analysis based on Python logic
  const simulateAnalysis = useCallback((audioData: Float32Array): AnalysisResult => {
    // Calculate simulated metrics based on audio characteristics
    const rms = Math.sqrt(audioData.reduce((sum, val) => sum + val * val, 0) / audioData.length);
    
    // Simulate intensity score (40-80 dB is good)
    const meanDb = 20 * Math.log10(Math.max(rms, 0.0001)) + 80;
    let intensityScore: number;
    if (meanDb < 40) {
      intensityScore = Math.max(0, (meanDb / 40) * 50);
    } else if (meanDb > 80) {
      intensityScore = Math.max(50, 100 - (meanDb - 80) * 2);
    } else {
      intensityScore = 50 + ((meanDb - 40) / 40) * 50;
    }
    intensityScore = Math.min(100, Math.max(0, intensityScore + (Math.random() * 10 - 5)));

    // Simulate pitch stability (CV < 5% is excellent, > 20% is poor)
    const pitchVariation = 5 + Math.random() * 15;
    let pitchScore: number;
    if (pitchVariation < 5) {
      pitchScore = 100;
    } else if (pitchVariation > 20) {
      pitchScore = 50 - Math.min(30, (pitchVariation - 20) * 2);
    } else {
      pitchScore = 100 - (pitchVariation - 5) * (50 / 15);
    }
    pitchScore = Math.min(100, Math.max(0, pitchScore + (Math.random() * 10 - 5)));

    // Simulate harmonicity (HNR > 15 dB is excellent, < 5 dB is poor)
    const hnr = 8 + Math.random() * 12;
    let harmonicityScore: number;
    if (hnr > 15) {
      harmonicityScore = 90 + Math.min(10, (hnr - 15) / 5 * 10);
    } else if (hnr < 5) {
      harmonicityScore = Math.max(0, (hnr / 5) * 50);
    } else {
      harmonicityScore = 50 + ((hnr - 5) / 10) * 40;
    }
    harmonicityScore = Math.min(100, Math.max(0, harmonicityScore + (Math.random() * 10 - 5)));

    // Simulate spectral clarity (centroid around 2000Hz is ideal)
    const centroid = 1500 + Math.random() * 1000;
    const centroidScore = 100 - Math.min(50, Math.abs(centroid - 2000) / 20);
    const spectralScore = Math.min(100, Math.max(0, centroidScore + (Math.random() * 10 - 5)));

    // Simulate energy distribution (CV < 10% is excellent, > 30% is poor)
    const energyCV = 10 + Math.random() * 20;
    let energyScore: number;
    if (energyCV < 10) {
      energyScore = 100;
    } else if (energyCV > 30) {
      energyScore = 50 - Math.min(30, energyCV - 30);
    } else {
      energyScore = 100 - (energyCV - 10) * (50 / 20);
    }
    energyScore = Math.min(100, Math.max(0, energyScore + (Math.random() * 10 - 5)));

    // Calculate overall clarity with weights from Python script
    const overallClarity = 
      intensityScore * 0.15 +
      pitchScore * 0.25 +
      harmonicityScore * 0.30 +
      spectralScore * 0.20 +
      energyScore * 0.10;

    // Determine clarity level
    let clarityLevel: string;
    let stars: number;
    if (overallClarity >= 80) {
      clarityLevel = "優秀";
      stars = 5;
    } else if (overallClarity >= 65) {
      clarityLevel = "良好";
      stars = 4;
    } else if (overallClarity >= 50) {
      clarityLevel = "尚可";
      stars = 3;
    } else {
      clarityLevel = "需加強";
      stars = 2;
    }

    // Generate suggestions based on metrics
    const suggestions: string[] = [];
    if (intensityScore < 50) {
      suggestions.push("音量偏小，建議提高發音音量");
    } else if (intensityScore > 85) {
      suggestions.push("音量過大，建議適度降低避免失真");
    }
    if (pitchScore < 60) {
      suggestions.push("音高不夠穩定，建議保持穩定的發音氣息");
    }
    if (harmonicityScore < 60) {
      suggestions.push("發音中雜音較多，建議在安靜環境下錄音");
    }
    if (spectralScore < 60) {
      suggestions.push("發音清晰度欠佳，建議注意咬字和口型");
    }
    if (energyScore < 60) {
      suggestions.push("能量分佈不均勻，建議保持穩定的發音力度");
    }
    if (suggestions.length === 0) {
      suggestions.push("發音表現優秀！繼續保持！");
    }

    return {
      overallClarity: Math.round(overallClarity),
      clarityLevel,
      stars,
      metrics: {
        intensity: Math.round(intensityScore),
        pitchStability: Math.round(pitchScore),
        harmonicity: Math.round(harmonicityScore),
        spectralClarity: Math.round(spectralScore),
        energyDistribution: Math.round(energyScore),
      },
      suggestions,
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsAnalyzing(true);
        
        // Simulate noise cancellation visual
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get audio data for analysis
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
        const audioData = audioBuffer.getChannelData(0);
        
        // Simulate analysis
        await new Promise(resolve => setTimeout(resolve, 500));
        const analysisResult = simulateAnalysis(audioData);
        
        setResult(analysisResult);
        setIsAnalyzing(false);
        onComplete?.(analysisResult);

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Animate audio level
      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(average / 255 * 100);
        }
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }
  };

  const reset = () => {
    setResult(null);
    setIsAnalyzing(false);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
      />
    ));
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      {/* Target Text */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">練習發音</p>
          <p className="text-lg font-serif font-medium text-foreground">{targetText}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => speak(targetText)}
          className="shrink-0"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Recording Controls */}
      {!result && !isAnalyzing && (
        <div className="flex flex-col items-center gap-4 py-4">
          <motion.div
            className="relative"
            animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                isRecording ? 'bg-destructive' : 'bg-secondary hover:bg-secondary/90'
              }`}
            >
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-destructive/30"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute inset-0 w-full h-full rounded-full ${
                isRecording ? 'text-primary-foreground' : 'text-secondary-foreground'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </motion.div>
          
          <p className="text-sm text-muted-foreground">
            {isRecording ? "點擊停止錄音" : "點擊開始錄音"}
          </p>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="w-full max-w-xs">
              <Progress value={audioLevel} className="h-2" />
            </div>
          )}
        </div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center gap-4 py-8">
          <motion.div
            className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-muted-foreground">正在分析發音清晰度...</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Overall Score */}
            <div className="text-center py-4">
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(result.stars)}
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {result.overallClarity}
                <span className="text-lg text-muted-foreground">/100</span>
              </p>
              <p className={`text-lg font-medium ${
                result.stars >= 4 ? 'text-secondary' : result.stars >= 3 ? 'text-yellow-600' : 'text-destructive'
              }`}>
                {result.clarityLevel}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "音量強度", value: result.metrics.intensity },
                { label: "音高穩定", value: result.metrics.pitchStability },
                { label: "諧波比", value: result.metrics.harmonicity },
                { label: "頻譜清晰", value: result.metrics.spectralClarity },
                { label: "能量分佈", value: result.metrics.energyDistribution },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${
                      metric.value >= 70 ? '[&>div]:bg-secondary' : 
                      metric.value >= 50 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-destructive'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">改善建議</p>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重新錄音
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioAnalyzer;
