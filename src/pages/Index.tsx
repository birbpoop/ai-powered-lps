import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Loader2
} from "lucide-react";
import Navigation from "@/components/Navigation";

const stats = [
  { value: "TBCL", label: "Level 5", icon: Zap },
  { value: "40+", label: "核心生詞", icon: Library },
  { value: "13", label: "語法點", icon: BookOpen },
];

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    simulateFileUpload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateFileUpload();
    }
  };

  const simulateFileUpload = () => {
    setIsLoading(true);
    // Simulate parsing time
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-gold" />
            </motion.div>
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-primary-foreground mb-2">
                解析教材中...
              </p>
              <p className="text-primary-foreground/60">
                Parsing Material...
              </p>
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
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/20 border border-gold/40"
            >
              <span className="text-sm font-medium text-gold-light tracking-wider uppercase">
                TBCL Level 5 | Advanced Business Mandarin
              </span>
            </motion.div>

            {/* Main Title - Editorial Style */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                矽島的抉擇
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gold font-medium"
              >
                在半導體與水田之間
              </motion.p>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl text-primary-foreground/80 font-light max-w-2xl mx-auto"
            >
              永續發展下的產業挑戰
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-8 pt-4"
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-gold" />
                    <span className="text-2xl font-serif font-bold text-primary-foreground">{stat.value}</span>
                  </div>
                  <span className="text-xs text-primary-foreground/60 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Upload Button - Center Stage - Triggers File Explorer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-8"
            >
              <button
                onClick={handleUploadClick}
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gold hover:bg-gold-dark text-navy font-semibold text-lg transition-all shadow-lg hover:shadow-gold/30 hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                檔案上傳
                <span className="text-sm font-normal opacity-70">File Upload</span>
              </button>
            </motion.div>

            {/* Scroll indicator */}
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
                支援格式：.docx, .pdf, .txt
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy font-medium hover:bg-gold-dark transition-all"
              >
                選擇檔案
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick Start */}
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
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
            >
              瀏覽示範課程
              <ArrowRight className="w-4 h-4" />
            </Link>
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
                <Leaf className="w-4 h-4" />
                ESG 與永續發展
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                探索科技與環境的平衡
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                本教材聚焦於台灣半導體產業面臨的永續發展挑戰，透過真實的商務情境對話與深度短文，
                幫助學習者掌握 ESG（環境、社會、管治）相關的高階華語詞彙與表達方式。
              </p>
              <ul className="space-y-3">
                {[
                  "深入理解半導體產業的環境影響",
                  "學習 ESG 相關專業術語",
                  "培養正反方論述能力",
                  "提升商務場合的溝通技巧",
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
                {/* Split visual */}
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
                    <p className="text-3xl font-serif font-bold">矽島台灣</p>
                    <p className="text-sm opacity-70">Silicon Island Taiwan</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-gold/20 rounded-full">
                      <span className="text-xs text-gold">永續 × 創新</span>
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
              <img src="/favicon.png" alt="華語教師備課系統" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-xl font-semibold">華語教師備課系統</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            Mandarin Teacher Preparation System · TBCL Level 5
          </p>
          <p className="text-primary-foreground/40 text-xs mt-4">
            © 2024 高階商務華語教材研發團隊
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
