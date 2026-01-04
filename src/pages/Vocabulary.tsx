import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Library, Search, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import VocabularyCard from "@/components/VocabularyCard";
import { dialogueVocabulary, essayVocabulary } from "@/data/content";
import { Input } from "@/components/ui/input";

const allVocabulary = [...dialogueVocabulary, ...essayVocabulary];

const Vocabulary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  const filteredVocabulary = useMemo(() => {
    return allVocabulary.filter((vocab) => {
      const matchesSearch = 
        vocab.word.includes(searchTerm) ||
        vocab.english.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === null || vocab.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, levelFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
              <Library className="w-4 h-4" />
              生詞庫
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              核心詞彙庫
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              收錄本課程所有 Level 6-7 商務華語核心詞彙，點擊卡片查看詳細釋義
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜尋詞彙（中文或英文）..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLevelFilter(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  levelFilter === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Filter className="w-4 h-4" />
                全部
              </button>
              <button
                onClick={() => setLevelFilter(6)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  levelFilter === 6
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Level 6
              </button>
              <button
                onClick={() => setLevelFilter(7)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  levelFilter === 7
                    ? 'bg-navy text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Level 7
              </button>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-muted-foreground mb-6"
          >
            共找到 {filteredVocabulary.length} 個詞彙
          </motion.p>

          {/* Vocabulary Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredVocabulary.map((vocab, index) => (
              <motion.div
                key={`${vocab.word}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (index % 8) }}
              >
                <VocabularyCard
                  word={vocab.word}
                  level={vocab.level}
                  english={vocab.english}
                  partOfSpeech={vocab.partOfSpeech}
                  example={vocab.example}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredVocabulary.length === 0 && (
            <div className="text-center py-16">
              <Library className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">找不到符合的詞彙</p>
              <p className="text-sm text-muted-foreground mt-1">請嘗試其他搜尋條件</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vocabulary;
