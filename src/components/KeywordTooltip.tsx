import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeywordData {
  word: string;
  level?: number;
  english?: string;
  japanese?: string;
  korean?: string;
  example?: string;
  imageAlt?: string;
}

interface KeywordTooltipProps {
  keyword: KeywordData;
  children: React.ReactNode;
}

const KeywordTooltip = ({ keyword, children }: KeywordTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

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
              {/* Image placeholder */}
              <div className="h-32 bg-muted flex items-center justify-center">
                <img
                  src={`https://via.placeholder.com/320x128?text=${encodeURIComponent(keyword.imageAlt || keyword.word)}`}
                  alt={keyword.imageAlt || keyword.word}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-semibold text-lg text-foreground">
                    {keyword.word}
                  </h4>
                  {keyword.level && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      Level {keyword.level}
                    </span>
                  )}
                </div>

                {/* Definitions */}
                <div className="space-y-1.5 text-sm">
                  {keyword.english && (
                    <p className="flex gap-2">
                      <span className="font-medium text-muted-foreground w-8">EN</span>
                      <span className="text-foreground">{keyword.english}</span>
                    </p>
                  )}
                  {keyword.japanese && (
                    <p className="flex gap-2">
                      <span className="font-medium text-muted-foreground w-8">JP</span>
                      <span className="text-foreground">{keyword.japanese}</span>
                    </p>
                  )}
                  {keyword.korean && (
                    <p className="flex gap-2">
                      <span className="font-medium text-muted-foreground w-8">KR</span>
                      <span className="text-foreground">{keyword.korean}</span>
                    </p>
                  )}
                </div>

                {/* Example */}
                {keyword.example && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">例句</p>
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
