import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, RotateCcw } from "lucide-react";

interface VocabularyCardProps {
  word: string;
  pinyin?: string;
  level: number | string;
  english: string;
  partOfSpeech?: string;
  example?: string;
  japanese?: string;
  korean?: string;
  vietnamese?: string;
}

const VocabularyCard = ({ 
  word, 
  pinyin, 
  level, 
  english, 
  partOfSpeech, 
  example,
  japanese,
  korean,
  vietnamese 
}: VocabularyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const normalizedLevel = level === 0 || level === "0" || level === "無收錄" || level === "無" ? "無" : level;

  return (
    <div 
      className="h-64 perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl bg-card border border-border shadow-card p-6 flex flex-col items-center justify-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              normalizedLevel === "無"
                ? "bg-muted text-muted-foreground"
                : normalizedLevel === 7 || normalizedLevel === '7'
                  ? "bg-navy text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
            }`}>
              {normalizedLevel === "無" ? "無收錄" : `Level ${normalizedLevel}`}
            </span>
          </div>
          
          <h3 className="font-serif text-3xl font-bold text-foreground mb-1">
            {word}
          </h3>
          
          {pinyin && (
            <p className="text-base text-muted-foreground mb-1">
              {pinyin}
            </p>
          )}
          
          {partOfSpeech && (
            <span className="text-sm text-muted-foreground italic">
              {partOfSpeech}
            </span>
          )}
          
          <button 
            onClick={handlePlayAudio}
            className="mt-3 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="播放發音"
          >
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <p className="absolute bottom-4 text-xs text-muted-foreground flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            點擊翻轉
          </p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl bg-navy p-5 flex flex-col backface-hidden overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                normalizedLevel === "無" ? "text-muted-foreground" : "text-gold"
              }`}>
                {normalizedLevel === "無" ? "無收錄" : `Level ${normalizedLevel}`}
              </span>
              {partOfSpeech && (
                <span className="text-xs text-white/60">{partOfSpeech}</span>
              )}
            </div>
            
            {/* Word */}
            <h3 className="text-lg font-bold text-white mb-2">{word}</h3>
            
            {/* Multilingual Translations */}
            <div className="grid grid-cols-1 gap-1 text-xs text-white/80 border-t border-white/10 pt-2 mb-3">
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">EN</span> <span>{english || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">JP</span> <span>{japanese || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">KR</span> <span>{korean || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">VN</span> <span>{vietnamese || "—"}</span></div>
            </div>

            {/* Example Sentence */}
            {example && (
              <div className="mt-auto bg-white/10 rounded-lg p-3">
                <p className="text-xs text-gold mb-1 font-medium">例句 Example:</p>
                <p className="text-sm text-white leading-relaxed">
                  {example}
                </p>
              </div>
            )}
          </div>
          
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/50 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            點擊翻回
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VocabularyCard;
