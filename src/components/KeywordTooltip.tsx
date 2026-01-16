import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

interface KeywordData {
  word: string;
  level?: number;
  english?: string;
  japanese?: string;
  korean?: string;
  vietnamese?: string;
  example?: string;
  partOfSpeech?: string;
}

interface KeywordTooltipProps {
  keyword: KeywordData;
  children: React.ReactNode;
}

const KeywordTooltip = ({ keyword, children }: KeywordTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b-2 border-secondary border-dashed cursor-help text-navy font-medium hover:text-secondary transition-colors">
        {children}
      </span>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-80"
          >
            <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-semibold text-xl text-foreground">
                      {keyword.word}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(keyword.word);
                      }}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                      aria-label="發音"
                    >
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {keyword.partOfSpeech && (
                      <span className="text-xs text-muted-foreground italic">
                        {keyword.partOfSpeech}
                      </span>
                    )}
                    {keyword.level && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        keyword.level >= 7 
                          ? 'bg-navy text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        L{keyword.level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Multilingual Definitions */}
                <div className="space-y-1.5 text-sm bg-muted/50 rounded-lg p-3">
                  {keyword.english && (
                    <p className="flex gap-2">
                      <span className="font-medium text-navy min-w-[28px]">EN</span>
                      <span className="text-foreground">{keyword.english}</span>
                    </p>
                  )}
                  {keyword.japanese && (
                    <p className="flex gap-2">
                      <span className="font-medium text-navy min-w-[28px]">JP</span>
                      <span className="text-foreground">{keyword.japanese}</span>
                    </p>
                  )}
                  {keyword.korean && (
                    <p className="flex gap-2">
                      <span className="font-medium text-navy min-w-[28px]">KR</span>
                      <span className="text-foreground">{keyword.korean}</span>
                    </p>
                  )}
                  {keyword.vietnamese && (
                    <p className="flex gap-2">
                      <span className="font-medium text-navy min-w-[28px]">VN</span>
                      <span className="text-foreground">{keyword.vietnamese}</span>
                    </p>
                  )}
                </div>

                {/* Example */}
                {keyword.example && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">例句</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {keyword.example}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-3 h-3 bg-card border-r border-b border-border rotate-45 transform -translate-y-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default KeywordTooltip;
