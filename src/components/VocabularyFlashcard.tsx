import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, RotateCw } from "lucide-react";
import { VocabularyItem } from "@/data/content";

interface VocabularyFlashcardProps {
  vocabulary: VocabularyItem;
}

const VocabularyFlashcard = ({ vocabulary }: VocabularyFlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the card from flipping
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative h-64 cursor-pointer perspective-1000"
      onClick={handleCardClick}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-card border border-border shadow-card flex flex-col items-center justify-center p-6 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`px-3 py-1 text-xs font-medium rounded-full mb-3 ${
            vocabulary.level === "無收錄"
              ? 'bg-muted text-muted-foreground'
              : typeof vocabulary.level === 'number' && vocabulary.level >= 7 
                ? 'bg-navy text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
          }`}>
            {vocabulary.level === "無收錄" ? "無收錄" : `TBCL Level ${vocabulary.level}`}
          </div>
          
          <h3 className="font-serif text-4xl font-bold text-foreground mb-1">
            {vocabulary.word}
          </h3>
          
          {/* Pinyin */}
          <p className="text-lg text-muted-foreground mb-2">
            {vocabulary.pinyin}
          </p>
          
          {vocabulary.partOfSpeech && (
            <p className="text-sm text-muted-foreground italic mb-3">
              {vocabulary.partOfSpeech}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayAudio}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="發音"
            >
              <Volume2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="w-3 h-3" />
              <span>點擊翻轉</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-navy p-5 backface-hidden overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            {/* Header with level and part of speech */}
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                vocabulary.level === "無收錄" ? "text-muted-foreground" : "text-gold"
              }`}>
                {vocabulary.level === "無收錄" ? "無收錄" : `Level ${vocabulary.level}`}
              </span>
              {vocabulary.partOfSpeech && (
                <span className="text-xs text-white/60">{vocabulary.partOfSpeech}</span>
              )}
            </div>
            
            {/* Word and English */}
            <h3 className="text-xl font-bold text-white mb-1">{vocabulary.word}</h3>
            <p className="text-sm text-white/80 mb-3">{vocabulary.english}</p>
            
            {/* Multilingual Translations Grid */}
            <div className="grid grid-cols-1 gap-1.5 text-xs text-white/80 mb-3 border-t border-white/10 pt-2">
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">EN</span> <span>{vocabulary.english || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">JP</span> <span>{vocabulary.japanese || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">KR</span> <span>{vocabulary.korean || "—"}</span></div>
              <div className="flex gap-2"><span className="opacity-50 w-6 shrink-0">VN</span> <span>{vocabulary.vietnamese || "—"}</span></div>
            </div>

            {/* Dynamic Example Sentence - Always at bottom */}
            <div className="mt-auto bg-white/10 rounded-lg p-3">
              <p className="text-xs text-gold mb-1 font-medium">例句 Example:</p>
              <p className="text-sm text-white leading-relaxed">
                {vocabulary.example || "No example available."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VocabularyFlashcard;
