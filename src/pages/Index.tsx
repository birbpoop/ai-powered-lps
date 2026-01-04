import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Library, 
  Users, 
  ClipboardCheck,
  ArrowRight,
  Cpu,
  Leaf,
  Zap
} from "lucide-react";
import Navigation from "@/components/Navigation";

const features = [
  {
    icon: BookOpen,
    title: "會話篇",
    description: "透過情境對話學習高階商務用語",
    path: "/dialogue",
    color: "bg-secondary",
  },
  {
    icon: FileText,
    title: "短文篇",
    description: "深入探討半導體與永續發展議題",
    path: "/essay",
    color: "bg-navy",
  },
  {
    icon: Library,
    title: "生詞庫",
    description: "收錄 Level 6-7 核心商務詞彙",
    path: "/vocabulary",
    color: "bg-secondary",
  },
  {
    icon: Users,
    title: "課室活動",
    description: "模擬辯論與銷售演練互動",
    path: "/activities",
    color: "bg-navy",
  },
  {
    icon: ClipboardCheck,
    title: "自我檢測",
    description: "線上測驗即時評估學習成效",
    path: "/quiz",
    color: "bg-secondary",
  },
];

const stats = [
  { value: "CEFR", label: "5-7 級", icon: Zap },
  { value: "20+", label: "核心生詞", icon: Library },
  { value: "13", label: "語法點", icon: BookOpen },
];

const Index = () => {
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
              <Cpu className="w-4 h-4 text-secondary" />
              <span className="text-sm text-primary-foreground/80">高階商務華語數位教材</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              矽島的抉擇
            </h1>
            
            <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-3xl mx-auto mb-4 font-light">
              在半導體與水田之間
            </p>
            
            <p className="text-lg text-primary-foreground/60 max-w-2xl mx-auto mb-12">
              探索台灣科技產業的永續發展挑戰，提升您的高階商務華語能力
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dialogue"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-sage-dark transition-all shadow-glow"
              >
                開始學習
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/vocabulary"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 font-medium hover:bg-primary-foreground/20 transition-all"
              >
                瀏覽生詞庫
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-20"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-serif font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
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

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              課程內容
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              系統化的高階商務華語學習模組，涵蓋對話、閱讀、詞彙與實踐
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={feature.path}
                  className="group block h-full p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-secondary font-medium">
                    進入學習
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
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
                <img 
                  src="https://via.placeholder.com/600x450?text=Silicon+Island+Taiwan"
                  alt="Taiwan semiconductor industry representing Silicon Island"
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
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
              <img src="/favicon.png" alt="矽島的抉擇" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-xl font-semibold">矽島的抉擇</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            高階商務華語數位教材 · CEFR Level 5-7
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
