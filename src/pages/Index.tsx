import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileUp,
  ArrowRight,
  Leaf,
  Cpu,
  Zap,
  Library,
  BookOpen,
  ArrowDown,
  FileText,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useLessonContext } from "@/contexts/LessonContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Demo content stats - only shown after entering demo mode
const demoStats = [
  { value: "TBCL", label: "Level 5", icon: Zap },
  { value: "40+", label: "核心生詞", icon: Library },
  { value: "13", label: "語法點", icon: BookOpen },
];

// SaaS product features
const productFeatures = [
  { icon: Library, label: "生詞自動提取" },
  { icon: BookOpen, label: "語法點分析" },
  { icon: Zap, label: "教學模組生成" },
];

const parsingIcons = [FileText, Brain, Sparkles, CheckCircle2];

// File type detection helpers
const isPdf = (file: File | null): boolean => {
  if (!file) return false;
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
};

const isDocx = (file: File | null): boolean => {
  if (!file) return false;
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  );
};

const isTextFile = (file: File | null): boolean => {
  if (!file) return false;
  const textTypes = ["text/plain", "text/markdown", "text/csv"];
  const textExtensions = [".txt", ".md", ".csv"];
  return textTypes.includes(file.type) || textExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
};

// Unified text extraction function
const extractTextFromFile = async (file: File): Promise<string> => {
  if (isPdf(file)) {
    // Extract text from PDF using pdfjs-dist
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pageTexts: string[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const strings = (textContent.items as Array<{ str?: string }>).map((it) => it.str ?? "");
      pageTexts.push(strings.join(" "));
    }
    return pageTexts.join("\n\n");
  }

  if (isDocx(file)) {
    // Extract text from DOCX using mammoth
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (isTextFile(file)) {
    // Read plain text files directly
    return await file.text();
  }

  throw new Error(`Unsupported file type: ${file.type || file.name}`);
};

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startParsing, parsingStep, parsingSteps, setCustomLessonData } = useLessonContext();

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setIsParsing(true);
    setErrorMessage("");

    try {
      // Extract text client-side for ALL file types
      const extractedText = await extractTextFromFile(selectedFile);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract any text from the file. Please try a different file.");
      }

      // Send only content_text to the edge function
      const { data, error } = await supabase.functions.invoke("analyze-file", {
        body: { content_text: extractedText },
      });

      // Map API response to LessonData structure
      const result = data;

      const newLessonData = {
        dialogue: {
          content: {
            title: result.dialogue?.title || result.essay?.title || "自訂課程",
            warmUp: [] as string[],
            characters: [] as { name: string; role: string }[],
            setting: "",
            lines: result.dialogue?.lines || [],
          },
          vocabulary: (result.dialogue?.vocabulary || []).map((v: any) => ({
            word: v.word || "",
            pinyin: v.pinyin || "",
            level: typeof v.level === "number" ? v.level : parseInt(v.level) || 0,
            english: v.english || "",
            partOfSpeech: v.partOfSpeech || "",
            example: v.example || "",
            japanese: v.japanese || "",
            korean: v.korean || "",
            vietnamese: v.vietnamese || "",
          })),
          grammar: (result.dialogue?.grammar || []).map((g: any) => ({
            pattern: g.pattern || "",
            level: typeof g.level === "number" ? g.level : parseInt(g.level) || 0,
            english: g.english || "",
            example: g.example || "",
          })),
          references: result.dialogue?.references || [],
        },
        essay: {
          content: {
            title: result.essay?.title || "",
            warmUp: [] as string[],
            paragraphs: result.essay?.paragraphs || [],
          },
          vocabulary: (result.essay?.vocabulary || []).map((v: any) => ({
            word: v.word || "",
            pinyin: v.pinyin || "",
            level: typeof v.level === "number" ? v.level : parseInt(v.level) || 0,
            english: v.english || "",
            partOfSpeech: v.partOfSpeech || "",
            example: v.example || "",
            japanese: v.japanese || "",
            korean: v.korean || "",
            vietnamese: v.vietnamese || "",
          })),
          grammar: (result.essay?.grammar || []).map((g: any) => ({
            pattern: g.pattern || "",
            level: typeof g.level === "number" ? g.level : parseInt(g.level) || 0,
            english: g.english || "",
            example: g.example || "",
          })),
          references: result.essay?.references || [],
        },
        summary: result.summary || "",
        mainLevel: result.main_level || "",
        activities: result.activities || [],
      };

      // Update context with custom lesson data
      setCustomLessonData(newLessonData);

      toast({
        title: "分析完成！",
        description: "正在跳轉至教學模組...",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMessage(msg || "Analysis failed");
      toast({
        title: "分析失敗",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const canAnalyze = !!selectedFile && !isAnalyzing;

  const handleFileParsing = async (demoMode: boolean) => {
    setIsParsing(true);
    await startParsing(demoMode);
    setIsParsing(false);
    navigate("/dashboard");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDemoClick = () => {
    handleFileParsing(true); // Demo mode - load hardcoded data
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.csv,.pdf,.docx"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Multi-step Parsing Overlay */}
      <AnimatePresence>
        {isParsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="max-w-md w-full mx-auto px-6">
              {/* Central Icon Animation */}
              <motion.div
                className="flex justify-center mb-8"
                key={parsingStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center">
                  {isAnalyzing ? (
                    <Brain className="w-12 h-12 text-gold animate-pulse" />
                  ) : (
                    (() => {
                      const IconComponent = parsingIcons[parsingStep] || FileText;
                      return <IconComponent className="w-12 h-12 text-gold" />;
                    })()
                  )}
                </div>
              </motion.div>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-primary-foreground text-lg font-medium">
                  {isAnalyzing ? "AI 正在分析您的檔案..." : parsingSteps[parsingStep]}
                </p>
                <p className="text-primary-foreground/60 text-sm mt-2">
                  {isAnalyzing ? "Analyzing with GPT-4o..." : "Processing..."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-secondary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isAnalyzing ? "90%" : `${((parsingStep + 1) / parsingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Editorial Cover Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Split Background */}
        <div className="absolute inset-0">
          {/* Left side - Tech/Semiconductor gradient */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-navy via-navy-light to-primary" />
          {/* Right side - Green/Sustainability gradient */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-sage via-sage-dark to-secondary" />
          {/* Center blend overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 circuit-pattern opacity-30" />
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-transparent to-navy/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Tagline - Product Focused */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/20 border border-gold/40"
            >
              <span className="text-sm font-medium text-gold-light tracking-wider uppercase">
                AI-Powered Teaching Preparation Platform
              </span>
            </motion.div>

            {/* Main Title - SaaS Product Style */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                智慧華語備課系統
                <span className="block font-serif text-2xl sm:text-3xl lg:text-4xl text-gold font-medium mt-3">
                  AI-Powered Lesson Preparation System
                </span>
              </motion.h1>
            </div>

            {/* Subtitle - Product Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl text-primary-foreground/80 font-light max-w-2xl mx-auto"
            >
              一鍵文章轉換，學生自學不亂，老師備課不慢 <br />
              智慧華語備課系統，讓學習不再限於教材
            </motion.p>

            {/* Features Row - Product Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-6 pt-4"
            >
              {productFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20"
                >
                  <feature.icon className="w-4 h-4 text-gold" />
                  <span className="text-sm text-primary-foreground/80">{feature.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons - Two Distinct Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Button 1: File Upload - Ghost/Outline style */}
              <button
                onClick={handleUploadClick}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-gold/60 bg-transparent hover:bg-gold/10 text-gold font-semibold text-lg transition-all hover:border-gold hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                檔案上傳
                <span className="text-sm font-normal opacity-70">File Upload</span>
              </button>

              {/* Button 2: Browse Demo Course - Primary Solid style (Highlighted) */}
              <button
                onClick={handleDemoClick}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gold hover:bg-gold-dark text-navy font-semibold text-lg transition-all shadow-lg hover:shadow-gold/30 hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                瀏覽示範課程
                <span className="text-sm font-normal opacity-70">Browse Demo</span>
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ArrowDown className="w-6 h-6 text-primary-foreground/50" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* File Upload Section */}
      <section id="upload" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <Cpu className="w-4 h-4" />
              教師備課入口
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">上傳課程資料</h2>
            <p className="text-muted-foreground">拖曳檔案或點擊下方區域，系統將自動解析並整理成教學模組</p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging ? "border-gold bg-gold/10" : "border-border hover:border-gold/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? "bg-gold/20" : "bg-muted"
                }`}
              >
                <FileUp className={`w-8 h-8 transition-colors ${isDragging ? "text-gold" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {selectedFile ? selectedFile.name : "拖曳檔案至此或點擊上傳"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">支援 TXT、MD、CSV、PDF、DOCX 格式</p>
              </div>
            </div>
          </motion.div>

          {/* File Selected State */}
          {selectedFile && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <FileText className="w-8 h-8 text-gold" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || "Unknown type"}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={runAnalysis}
                disabled={!canAnalyze}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                  canAnalyze
                    ? "bg-gold hover:bg-gold-dark text-navy shadow-lg hover:shadow-gold/30"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-5 h-5 animate-pulse" />
                    AI 分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    開始 AI 分析
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Demo Button Alternative */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">或者先體驗示範課程</p>
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              瀏覽示範課程
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
