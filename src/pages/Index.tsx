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
  CheckCircle2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useLessonContext } from "@/contexts/LessonContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";

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

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>(
    "請協助我：1) 摘要重點 2) 列出生詞與語法點 3) 提出 3 個可操作的課堂活動。"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startParsing, parsingStep, parsingSteps, setCustomLessonData } = useLessonContext();

  type AiLessonJson = {
    main_level?: string;
    dialogue?: {
      title?: string;
      lines?: Array<{ speaker: string; text: string }>;
      vocabulary?: Array<Record<string, unknown>>;
      grammar?: Array<Record<string, unknown>>;
    };
    essay?: {
      title?: string;
      paragraphs?: string[];
      vocabulary?: Array<Record<string, unknown>>;
      grammar?: Array<Record<string, unknown>>;
    };
    activities?: Array<{ title: string; description: string }>;
  };

  const toString = (v: unknown) => (typeof v === "string" ? v : "");
  const toNumber = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const normalizeLessonJson = (raw: AiLessonJson) => {
    const dialogueLines = (raw.dialogue?.lines ?? [])
      .filter((l) => l && typeof l.speaker === "string" && typeof l.text === "string")
      .map((l) => ({ speaker: l.speaker, text: l.text }));

    const speakers = Array.from(new Set(dialogueLines.map((l) => l.speaker)));

    const mapVocab = (arr: Array<Record<string, unknown>> | undefined) =>
      (arr ?? []).map((v) => ({
        word: toString(v.word),
        pinyin: toString(v.pinyin),
        level: Math.max(0, Math.min(7, toNumber(v.level))),
        english: toString(v.english),
        partOfSpeech: toString(v.partOfSpeech),
        example: toString(v.example),
        japanese: toString(v.japanese),
        korean: toString(v.korean),
        vietnamese: toString(v.vietnamese),
      }))
      .filter((v) => v.word.trim().length > 0);

    const mapGrammar = (arr: Array<Record<string, unknown>> | undefined) =>
      (arr ?? []).map((g) => ({
        pattern: toString(g.pattern),
        level: Math.max(1, Math.min(7, toNumber(g.level) || 1)),
        english: toString(g.english),
        example: toString(g.example),
      }))
      .filter((g) => g.pattern.trim().length > 0);

    const lessonData = {
      main_level: raw.main_level,
      dialogue: {
        content: {
          title: raw.dialogue?.title || "自訂課程（對話）",
          warmUp: [],
          characters: speakers.map((name) => ({ name, role: "" })),
          setting: "",
          lines: dialogueLines,
        },
        vocabulary: mapVocab(raw.dialogue?.vocabulary),
        grammar: mapGrammar(raw.dialogue?.grammar),
        references: [],
      },
      essay: {
        content: {
          title: raw.essay?.title || "自訂課程（短文）",
          warmUp: [],
          paragraphs: (raw.essay?.paragraphs ?? []).filter((p) => typeof p === "string" && p.trim().length > 0),
        },
        vocabulary: mapVocab(raw.essay?.vocabulary),
        grammar: mapGrammar(raw.essay?.grammar),
        references: [],
      },
      activities: (raw.activities ?? []).filter((a) => a?.title && a?.description),
    };

    return lessonData;
  };

  const isPdf = (file: File | null) => {
    if (!file) return false;
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  const extractPdfText = async (file: File) => {
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
  };

  const uploadToStorage = async (file: File) => {
    // PDFs are parsed on the frontend; no need to upload to storage.
    if (isPdf(file)) {
      setFileUrl(null);
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setFileUrl(null);

    try {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("user-uploads").getPublicUrl(path);
      if (!data?.publicUrl) {
        throw new Error("Failed to create public URL");
      }
      setFileUrl(data.publicUrl);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMessage(msg || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const body: Record<string, unknown> = {
        user_prompt: userPrompt,
        file_type: selectedFile.type,
      };

      if (isPdf(selectedFile)) {
        const text = await extractPdfText(selectedFile);
        body.content_text = text;
      } else {
        if (!fileUrl) throw new Error("File URL missing. Please re-upload the file.");
        body.file_url = fileUrl;
      }

      const { data, error } = await supabase.functions.invoke("analyze-file", { body });

      if (error) throw error;
      const lessonJson = data as AiLessonJson;
      const parsedLesson = normalizeLessonJson(lessonJson);
      setCustomLessonData(parsedLesson);
      navigate("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMessage(msg || "Analysis failed");
      toast({
        variant: "destructive",
        title: "分析失敗",
        description: msg || "Analysis failed",
      });
    } finally {
      setIsAnalyzing(false);
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
      void uploadToStorage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      void uploadToStorage(file);
    }
  };

  const canAnalyze =
    !!selectedFile &&
    !isUploading &&
    !isAnalyzing &&
    (isPdf(selectedFile) ? true : !!fileUrl);

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
        accept=".txt,.md,.csv,.pdf"
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
                  {(() => {
                    const IconComponent = parsingIcons[parsingStep] || FileText;
                    return <IconComponent className="w-12 h-12 text-gold" />;
                  })()}
                </div>
              </motion.div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {parsingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index <= parsingStep ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      index === parsingStep 
                        ? 'bg-gold/20 border border-gold/40' 
                        : index < parsingStep 
                          ? 'bg-secondary/10' 
                          : 'bg-muted/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      index < parsingStep 
                        ? 'bg-secondary text-secondary-foreground' 
                        : index === parsingStep 
                          ? 'bg-gold text-navy' 
                          : 'bg-muted/30 text-muted-foreground'
                    }`}>
                      {index < parsingStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        index <= parsingStep ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {step}
                      </p>
                    </div>
                    {index === parsingStep && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gold"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-secondary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((parsingStep + 1) / parsingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-center text-primary-foreground/60 text-sm mt-3">
                  {Math.round(((parsingStep + 1) / parsingSteps.length) * 100)}% 完成
                </p>
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
              一鍵生成生詞、語法與教學活動，提升備課效率
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
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
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
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              上傳課程資料
            </h2>
            <p className="text-muted-foreground">
              拖曳檔案或點擊下方區域，系統將自動解析並整理成教學模組
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-gold bg-gold/10"
                : "border-border hover:border-gold/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging ? "bg-gold" : "bg-muted"
              }`}>
                {isDragging ? (
                  <FileUp className="w-8 h-8 text-navy" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragging ? "放開以上傳檔案" : "檔案上傳"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                支援格式：.txt, .md, .csv, .pdf
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy font-medium hover:bg-gold-dark transition-all"
              >
                選擇檔案
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Upload + Analyze */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-6 space-y-4"
          >
            {selectedFile && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">已選擇檔案</p>
                    <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                    {fileUrl && (
                      <p className="text-xs text-muted-foreground truncate mt-1">{fileUrl}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        void runAnalysis();
                      }}
                      disabled={!canAnalyze}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading
                        ? "上傳中..."
                        : isAnalyzing
                          ? "分析中..."
                          : "開始分析"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">分析指令（Prompt）</p>
                  <Textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="請輸入你希望 AI 對檔案做什麼分析..."
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Note: analysis result is now structured JSON and immediately hydrates the Dashboard view. */}
          </motion.div>

          {/* Quick Start - Demo Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">
              或使用預設課程內容快速體驗
            </p>
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              瀏覽示範課程
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                智慧教學輔助
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                一鍵生成教學模組
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                上傳您的課程資料，系統將自動解析文本內容，運用 NLP 技術提取關鍵詞彙與語法結構，
                並生成完整的教學模組，大幅提升華語教師的備課效率。
              </p>
              <ul className="space-y-3">
                {[
                  "自動提取課文中的核心詞彙",
                  "智慧分析語法結構與句型",
                  "生成互動式教學活動",
                  "多語翻譯即時查閱",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated relative">
                {/* Split visual - Product illustration */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                    <Cpu className="w-20 h-20 text-primary-foreground/30" />
                  </div>
                  <div className="w-1/2 bg-gradient-to-bl from-sage to-sage-dark flex items-center justify-center">
                    <Leaf className="w-20 h-20 text-secondary-foreground/30" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-navy/80 via-transparent to-transparent">
                  <div className="text-center text-primary-foreground">
                    <p className="text-3xl font-serif font-bold">智慧備課</p>
                    <p className="text-sm opacity-70">AI-Powered Preparation</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-gold/20 rounded-full">
                      <span className="text-xs text-gold">效率 × 品質</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-background">
                <img src="/favicon.png" alt="智慧華語備課系統" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-xl font-semibold">智慧華語備課系統</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
              AI-Powered Lesson Preparation System
          </p>
          <p className="text-primary-foreground/40 text-xs mt-4">
            © 2026 聯合大學華語文學系學生團隊
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
