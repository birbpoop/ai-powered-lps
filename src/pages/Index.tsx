import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload,
  FileUp,
  ArrowRight,
  Leaf,
  Cpu,
  Zap,
  Library,
  BookOpen
} from "lucide-react";
import Navigation from "@/components/Navigation";

const stats = [
  { value: "TBCL", label: "Level 5", icon: Zap },
  { value: "40+", label: "核心生詞", icon: Library },
  { value: "13", label: "語法點", icon: BookOpen },
];

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

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
    // Simulate file upload and navigate to dashboard
    navigate("/dashboard");
  };

  const handleUploadClick = () => {
    // Simulate file upload and navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 circuit-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-sm text-primary-foreground/80">TBCL Level 5 - Sustainability & Semiconductors</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              華語教師備課系統
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-4">
              Mandarin Teacher Preparation System
            </p>
            
            <p className="text-base text-primary-foreground/60 max-w-xl mx-auto mb-12">
              TBCL Level 5 - 主題：永續發展與半導體產業
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12"
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
                >
                  <stat.icon className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-xl font-serif font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="hsl(var(--background))"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* File Upload Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              開始備課
            </h2>
            <p className="text-muted-foreground">
              上傳您的課程資料，系統將自動解析並整理成教學模組
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-secondary bg-secondary/10"
                : "border-border hover:border-secondary/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging ? "bg-secondary" : "bg-muted"
              }`}>
                {isDragging ? (
                  <FileUp className="w-8 h-8 text-secondary-foreground" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragging ? "放開以上傳檔案" : "檔案上傳"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                拖曳檔案至此處，或點擊選擇檔案
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-sage-dark transition-all"
              >
                檔案上傳
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              支援格式：.docx, .pdf, .txt
            </p>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">
              或使用預設課程內容
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              瀏覽示範課程
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
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
                    <div className="w-2 h-2 rounded-full bg-secondary" />
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
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-navy to-navy-light overflow-hidden shadow-elevated">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <Cpu className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-2xl font-serif font-bold">矽島台灣</p>
                    <p className="text-sm opacity-70">Silicon Island Taiwan</p>
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
