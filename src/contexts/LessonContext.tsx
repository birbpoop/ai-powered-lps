import { createContext, useContext, useState, ReactNode } from "react";
import { 
  dialogueContent, 
  dialogueVocabulary, 
  dialogueGrammar,
  essayContent,
  essayVocabulary,
  essayGrammar,
  dialogueReferences,
  essayReferences,
  VocabularyItem,
  GrammarPoint,
  Reference
} from "@/data/content";

interface LessonData {
  dialogue: {
    content: typeof dialogueContent;
    vocabulary: VocabularyItem[];
    grammar: GrammarPoint[];
    references: Reference[];
  };
  essay: {
    content: typeof essayContent;
    vocabulary: VocabularyItem[];
    grammar: GrammarPoint[];
    references: Reference[];
  };
}

interface LessonContextType {
  isParsed: boolean;
  isParsingComplete: boolean;
  lessonData: LessonData | null;
  parsingStep: number;
  parsingSteps: string[];
  startParsing: () => Promise<void>;
  resetParsing: () => void;
}

const parsingStepsData = [
  "正在讀取檔案內容... (Reading File Content...)",
  "正在提取課文結構... (Extracting Text Structures...)",
  "正在進行生詞與語法分析... (NLP Entity Recognition...)",
  "正在生成教學模組... (Generating Modules...)",
];

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider = ({ children }: { children: ReactNode }) => {
  const [isParsed, setIsParsed] = useState(false);
  const [isParsingComplete, setIsParsingComplete] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [parsingStep, setParsingStep] = useState(0);

  const startParsing = async () => {
    setIsParsed(false);
    setIsParsingComplete(false);
    setParsingStep(0);

    // Simulate multi-step parsing with delays
    for (let i = 0; i < parsingStepsData.length; i++) {
      setParsingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // After parsing complete, populate with demo data
    const parsedData: LessonData = {
      dialogue: {
        content: dialogueContent,
        vocabulary: dialogueVocabulary,
        grammar: dialogueGrammar,
        references: dialogueReferences,
      },
      essay: {
        content: essayContent,
        vocabulary: essayVocabulary,
        grammar: essayGrammar,
        references: essayReferences,
      },
    };

    setLessonData(parsedData);
    setIsParsed(true);
    setIsParsingComplete(true);
  };

  const resetParsing = () => {
    setIsParsed(false);
    setIsParsingComplete(false);
    setLessonData(null);
    setParsingStep(0);
  };

  return (
    <LessonContext.Provider
      value={{
        isParsed,
        isParsingComplete,
        lessonData,
        parsingStep,
        parsingSteps: parsingStepsData,
        startParsing,
        resetParsing,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return context;
};
