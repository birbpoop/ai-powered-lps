import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FileText, 
  Library, 
  BookOpen, 
  Users,
  ExternalLink
} from "lucide-react";
import Navigation from "@/components/Navigation";
import KeywordTooltip from "@/components/KeywordTooltip";
import VocabularyFlashcard from "@/components/VocabularyFlashcard";
import SimplifiedAudioAnalyzer from "@/components/SimplifiedAudioAnalyzer";
import { 
  dialogueContent, 
  dialogueVocabulary, 
  dialogueGrammar,
  essayContent,
  essayVocabulary,
  essayGrammar,
  VocabularyItem,
  dialogueReferences,
  essayReferences
} from "@/data/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Create keyword maps
const allVocabulary = [...dialogueVocabulary, ...essayVocabulary];
const keywordMap: Record<string, VocabularyItem> = {};
allVocabulary.forEach(v => {
  keywordMap[v.word] = v;
});

const highlightKeywords = (text: string) => {
  const keywords = Object.keys(keywordMap);
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  
  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sortedKeywords.join('|')})`, 'g');
  
  let match;
  const allMatches: { index: number; word: string }[] = [];
  
  while ((match = regex.exec(text)) !== null) {
    allMatches.push({ index: match.index, word: match[0] });
  }
  
  allMatches.forEach((m, i) => {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    const keyword = keywordMap[m.word];
    parts.push(
      <KeywordTooltip key={`${m.word}-${i}`} keyword={keyword}>
        {m.word}
      </KeywordTooltip>
    );
    lastIndex = m.index + m.word.length;
  });
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

const warmUpQuestions = [
  "你平常注意環保議題嗎？舉一個你做過的永續行動。",
  "你認為企業在推動永續發展上，扮演了什麼樣的角色？",
  "請概述或猜測何為聯合國推動之「環境、社會與管治」？",
  "如何在科技與環境之間取捨？何者為優先考量？",
];

// APA Reference component
const APAReference = ({ author, year, title, source, url }: { 
  author: string; 
  year: string; 
  title: string; 
  source?: string;
  url: string;
}) => (
  <p className="text-xs text-muted-foreground leading-relaxed pl-6 -indent-6">
    {author}. ({year}). <em>{title}</em>.{source && ` ${source}.`}{" "}
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gold hover:text-gold-dark inline-flex items-center gap-1 break-all"
    >
      {url.length > 60 ? url.substring(0, 60) + "..." : url}
      <ExternalLink className="w-3 h-3 shrink-0" />
    </a>
  </p>
);

const Dashboard = () => {
  const practiceWords = dialogueVocabulary.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              TBCL Level 5 | Advanced Business Mandarin
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
              課程內容總覽
            </h1>
            <p className="text-muted-foreground">
              永續發展與半導體產業
            </p>
          </motion.div>

          {/* Accordion Sections */}
          <Accordion type="multiple" defaultValue={["warmup"]} className="space-y-4">
            {/* Section 1: Warm-up */}
            <AccordionItem value="warmup" id="warmup" className="border border-border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-serif text-lg font-semibold text-foreground">課前暖身</h2>
                    <p className="text-sm text-muted-foreground">Warm-up Questions</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ol className="space-y-4">
                  {warmUpQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3 text-foreground leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-gold/10 text-gold text-sm font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Content */}
            <AccordionItem value="content" id="content" className="border border-border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-serif text-lg font-semibold text-foreground">內容</h2>
                    <p className="text-sm text-muted-foreground">Dialogue & Short Passage</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-10">
                {/* Block A: Conversation */}
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gold/20 text-gold rounded text-sm font-bold">A</span>
                    會話篇 - {dialogueContent.title}
                  </h3>
                  <div className="space-y-4 mb-6">
                    {dialogueContent.lines.slice(0, 6).map((line, index) => (
                      <div key={index} className="pl-4 border-l-2 border-gold/30">
                        <p className="text-sm font-medium text-gold mb-1">{line.speaker}：</p>
                        <p className="text-foreground leading-relaxed">
                          {highlightKeywords(line.text)}
                        </p>
                      </div>
                    ))}
                    <p className="text-sm text-muted-foreground italic">...（查看完整對話請前往會話篇頁面）</p>
                  </div>
                  
                  {/* APA References - Dialogue */}
                  <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-gold space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-2">References:</p>
                    {dialogueReferences.map((ref) => (
                      <APAReference 
                        key={ref.id}
                        author={ref.author}
                        year={ref.year}
                        title={ref.title}
                        source={ref.source}
                        url={ref.url}
                      />
                    ))}
                  </div>
                </div>

                {/* Block B: Short Passage */}
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded text-sm font-bold">B</span>
                    短文篇 - {essayContent.title}
                  </h3>
                  <div className="mb-6">
                    <p className="text-foreground leading-loose indent-8">
                      {highlightKeywords(essayContent.paragraphs[0])}
                    </p>
                    <p className="text-sm text-muted-foreground italic mt-2">...（查看完整短文請前往短文篇頁面）</p>
                  </div>
                  
                  {/* APA References - Essay */}
                  <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-secondary space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-2">References:</p>
                    {essayReferences.map((ref) => (
                      <APAReference 
                        key={ref.id}
                        author={ref.author}
                        year={ref.year}
                        title={ref.title}
                        source={ref.source}
                        url={ref.url}
                      />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Vocabulary Bank */}
            <AccordionItem value="vocabulary" className="border border-border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                    <Library className="w-4 h-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-serif text-lg font-semibold text-foreground">生詞庫</h2>
                    <p className="text-sm text-muted-foreground">Vocabulary Bank</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allVocabulary.slice(0, 9).map((vocab, index) => (
                    <VocabularyFlashcard key={index} vocabulary={vocab} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  前往生詞庫頁面查看全部 {allVocabulary.length} 個詞彙
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Grammar Points */}
            <AccordionItem value="grammar" id="grammar" className="border border-border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-serif text-lg font-semibold text-foreground">語法點</h2>
                    <p className="text-sm text-muted-foreground">Grammar Points</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-3">
                  {[...dialogueGrammar.slice(0, 2), ...essayGrammar.slice(0, 2)].map((grammar, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-serif font-bold text-foreground">
                          {grammar.pattern}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gold/10 text-gold">
                          Level {grammar.level}
                        </span>
                      </div>
                      <p className="text-sm text-gold font-medium mb-1">{grammar.english}</p>
                      <p className="text-sm text-muted-foreground">
                        {grammar.example}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Classroom Activity */}
            <AccordionItem value="activity" className="border border-border rounded-xl overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                    <Users className="w-4 h-4 text-navy" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-serif text-lg font-semibold text-foreground">課堂活動</h2>
                    <p className="text-sm text-muted-foreground">Classroom Activity</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                {/* Activity Description */}
                <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                  <h3 className="font-medium text-foreground mb-2">模擬辯論與銷售提案</h3>
                  <p className="text-sm text-muted-foreground">
                    Simulation Debate & Sales Pitch
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    「半導體產業會/不會阻撓環境的發展」
                  </p>
                </div>

                {/* AI Pronunciation Coach */}
                <div>
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded text-xs">AI</span>
                    發音教練 Pronunciation Coach
                  </h3>
                  <div className="grid gap-4">
                    {practiceWords.map((word, index) => (
                      <SimplifiedAudioAnalyzer 
                        key={index}
                        targetText={word.word}
                        targetPinyin={word.pinyin}
                      />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
