export interface VocabularyItem {
  word: string;
  pinyin: string;
  level: number | string; // Can be 1-7 or "無收錄" for unlisted words
  english: string;
  partOfSpeech?: string;
  example?: string;
  japanese?: string;
  korean?: string;
  vietnamese?: string;
}

export interface GrammarPoint {
  pattern: string;
  level: number;
  english: string;
  example: string;
}

export interface Reference {
  id: string;
  author: string;
  year: string;
  title: string;
  source?: string;
  url: string;
}

export interface ActivityItem {
  title: string;
  description: string;
}

// 會話生詞 (Dialogue Vocabulary) - From 3-3 PDF
export const dialogueVocabulary: VocabularyItem[] = [
  {
    word: "論壇",
    pinyin: "lùntán",
    level: 7,
    english: "Forum",
    partOfSpeech: "Noun",
    example: "本屆亞太經濟論壇將針對區域貿易協定進行深入探討。",
    japanese: "フォーラム",
    korean: "포럼",
    vietnamese: "Diễn đàn",
  },
  {
    word: "秘密",
    pinyin: "mìmì",
    level: 5,
    english: "Secret",
    partOfSpeech: "Noun / Adj.",
    example: "這份商業計畫書涉及公司最高機密，請務必妥善保管，不得外洩。",
    japanese: "秘密",
    korean: "비밀",
    vietnamese: "Bí mật",
  },
  {
    word: "武器",
    pinyin: "wǔqì",
    level: 5,
    english: "Weapon",
    partOfSpeech: "Noun",
    example: "精準的市場數據分析，是我們在談判桌上最有力的武器。",
    japanese: "武器",
    korean: "무기",
    vietnamese: "Vũ khí",
  },
  {
    word: "產業",
    pinyin: "chǎnyè",
    level: 5,
    english: "Industry",
    partOfSpeech: "Noun",
    example: "政府正積極推動傳統產業數位轉型，以提升國際競爭力。",
    japanese: "産業",
    korean: "산업",
    vietnamese: "Ngành công nghiệp",
  },
  {
    word: "供應",
    pinyin: "gōngyìng",
    level: 5,
    english: "Supply",
    partOfSpeech: "Verb / Noun",
    example: "受疫情影響，全球電子產品供應鏈出現斷鏈危機，導致出貨延遲。",
    japanese: "供給",
    korean: "공급",
    vietnamese: "Cung cấp",
  },
  {
    word: "過程",
    pinyin: "guòchéng",
    level: 5,
    english: "Process",
    partOfSpeech: "Noun",
    example: "在產品製造過程中，我們必須嚴格控管每一個環節的品質。",
    japanese: "過程",
    korean: "과정",
    vietnamese: "Quá trình",
  },
  {
    word: "研發",
    pinyin: "yánfā",
    level: 5,
    english: "R&D",
    partOfSpeech: "Verb / Noun",
    example: "本公司每年投入營收的百分之十作為新產品的研發經費。",
    japanese: "研究開発",
    korean: "연구 개발",
    vietnamese: "Nghiên cứu và phát triển",
  },
  {
    word: "平衡",
    pinyin: "pínghéng",
    level: 5,
    english: "Balance",
    partOfSpeech: "Verb / Noun",
    example: "如何在經濟發展與環境保護之間取得平衡，是當前的重要課題。",
    japanese: "バランス",
    korean: "균형",
    vietnamese: "Cân bằng",
  },
  {
    word: "再生",
    pinyin: "zàishēng",
    level: 6,
    english: "Renewable",
    partOfSpeech: "Adj. / Verb",
    example: "為了減少對化石燃料的依賴，我們應積極開發太陽能等再生能源。",
    japanese: "再生可能な",
    korean: "재생",
    vietnamese: "Tái tạo",
  },
  {
    word: "節能",
    pinyin: "jiénéng",
    level: 5,
    english: "Energy-saving",
    partOfSpeech: "Noun / Adj.",
    example: "這棟綠建築採用了最先進的節能設計，大幅降低了電力消耗。",
    japanese: "省エネルギー",
    korean: "에너지 절약",
    vietnamese: "Tiết kiệm năng lượng",
  },
  {
    word: "面向",
    pinyin: "miànxiàng",
    level: 5,
    english: "Aspect",
    partOfSpeech: "Noun",
    example: "這項社會議題涉及多個面向，需要跨部門的合作才能解決。",
    japanese: "側面",
    korean: "측면",
    vietnamese: "Khía cạnh",
  },
  {
    word: "廠商",
    pinyin: "chǎngshāng",
    level: 5,
    english: "Manufacturer / Vendor",
    partOfSpeech: "Noun",
    example: "採購部門正在評估各家廠商的報價與交貨能力。",
    japanese: "メーカー",
    korean: "제조업체",
    vietnamese: "Nhà sản xuất",
  },
  {
    word: "觀點",
    pinyin: "guāndiǎn",
    level: 5,
    english: "Viewpoint",
    partOfSpeech: "Noun",
    example: "對於這個爭議性話題，各方專家學者都提出了不同的觀點。",
    japanese: "観点",
    korean: "관점",
    vietnamese: "Quan điểm",
  },
  {
    word: "落伍",
    pinyin: "luòwǔ",
    level: 5,
    english: "Outdated",
    partOfSpeech: "Adj.",
    example: "這種傳統的管理模式已經落伍，無法適應現代快速變化的市場。",
    japanese: "時代遅れの",
    korean: "뒤떨어진",
    vietnamese: "Lạc hậu",
  },
  {
    word: "稱得上",
    pinyin: "chēngdéshàng",
    level: 5,
    english: "Can be called / Worthy of",
    partOfSpeech: "Verb Phrase",
    example: "這家餐廳的料理稱得上是城裡最道地的台灣味。",
    japanese: "〜と言える",
    korean: "~라고 할 수 있다",
    vietnamese: "Có thể gọi là",
  },
  {
    word: "一流",
    pinyin: "yīliú",
    level: 6,
    english: "First-class",
    partOfSpeech: "Adj.",
    example: "這家飯店提供一流的服務與設施，深受國際商務旅客喜愛。",
    japanese: "一流の",
    korean: "일류",
    vietnamese: "Hạng nhất",
  },
];

// 短文生詞 (Essay Vocabulary) - From 3-4 PDF
export const essayVocabulary: VocabularyItem[] = [
  {
    word: "聯想",
    pinyin: "liánxiǎng",
    level: 5,
    english: "Associate / Association",
    partOfSpeech: "Verb / Noun",
    example: "看到這幅畫，讓人不禁聯想起童年的美好時光。",
    japanese: "連想",
    korean: "연상",
    vietnamese: "Liên tưởng",
  },
  {
    word: "領域",
    pinyin: "lǐngyù",
    level: 6,
    english: "Field / Domain",
    partOfSpeech: "Noun",
    example: "他在人工智慧領域深耕多年，已是該產業的頂尖專家。",
    japanese: "分野",
    korean: "영역",
    vietnamese: "Lĩnh vực",
  },
  {
    word: "稱呼",
    pinyin: "chēnghu",
    level: 5,
    english: "Address / Title",
    partOfSpeech: "Verb / Noun",
    example: "初次見面時，不知該如何稱呼對方才恰當。",
    japanese: "呼び方",
    korean: "호칭",
    vietnamese: "Xưng hô",
  },
  {
    word: "永續",
    pinyin: "yǒngxù",
    level: 6,
    english: "Sustainability",
    partOfSpeech: "Noun / Adj.",
    example: "企業經營不應只看短期獲利，更應重視環境與社會的永續發展。",
    japanese: "持続可能な",
    korean: "지속가능한",
    vietnamese: "Bền vững",
  },
  {
    word: "憂慮",
    pinyin: "yōulǜ",
    level: 5,
    english: "Worry / Concern",
    partOfSpeech: "Verb / Noun",
    example: "經濟前景不明，民眾對未來普遍感到憂慮。",
    japanese: "心配",
    korean: "우려",
    vietnamese: "Lo lắng",
  },
  {
    word: "考量",
    pinyin: "kǎoliáng",
    level: 5,
    english: "Consideration",
    partOfSpeech: "Verb / Noun",
    example: "決策時需將各方利益納入考量，才能做出平衡的判斷。",
    japanese: "考慮",
    korean: "고려",
    vietnamese: "Cân nhắc",
  },
  {
    word: "利益",
    pinyin: "lìyì",
    level: 5,
    english: "Interest / Benefit",
    partOfSpeech: "Noun",
    example: "企業不應只追求自身利益，也應兼顧社會責任。",
    japanese: "利益",
    korean: "이익",
    vietnamese: "Lợi ích",
  },
  {
    word: "決策",
    pinyin: "juécè",
    level: 5,
    english: "Decision-making",
    partOfSpeech: "Noun / Verb",
    example: "重大決策前，管理層會進行詳細的風險評估。",
    japanese: "意思決定",
    korean: "의사결정",
    vietnamese: "Quyết sách",
  },
  {
    word: "典範",
    pinyin: "diǎnfàn",
    level: 5,
    english: "Model / Paradigm",
    partOfSpeech: "Noun",
    example: "這家企業的經營模式已成為業界效法的典範。",
    japanese: "模範",
    korean: "모범",
    vietnamese: "Điển hình",
  },
  {
    word: "訂單",
    pinyin: "dìngdān",
    level: 5,
    english: "Order (commercial)",
    partOfSpeech: "Noun",
    example: "工廠接獲大量訂單，正全力趕工生產中。",
    japanese: "注文書",
    korean: "주문서",
    vietnamese: "Đơn đặt hàng",
  },
  {
    word: "吃驚",
    pinyin: "chījīng",
    level: 5,
    english: "Surprised / Astonished",
    partOfSpeech: "Verb / Adj.",
    example: "聽到這個消息，大家都感到非常吃驚。",
    japanese: "驚く",
    korean: "놀라다",
    vietnamese: "Kinh ngạc",
  },
  {
    word: "遭遇",
    pinyin: "zāoyù",
    level: 5,
    english: "Encounter / Experience",
    partOfSpeech: "Verb / Noun",
    example: "面對突發狀況時，冷靜應對是解決遭遇困難的關鍵。",
    japanese: "遭遇する",
    korean: "조우하다",
    vietnamese: "Gặp phải",
  },
  {
    word: "負面",
    pinyin: "fùmiàn",
    level: 5,
    english: "Negative",
    partOfSpeech: "Adj.",
    example: "長期的負面情緒會對身心健康造成不良影響。",
    japanese: "ネガティブな",
    korean: "부정적인",
    vietnamese: "Tiêu cực",
  },
  {
    word: "績效",
    pinyin: "jīxiào",
    level: 5,
    english: "Performance",
    partOfSpeech: "Noun",
    example: "公司每季度都會對員工的工作績效進行評估。",
    japanese: "業績",
    korean: "실적",
    vietnamese: "Hiệu suất",
  },
  {
    word: "逐漸",
    pinyin: "zhújiàn",
    level: 5,
    english: "Gradually",
    partOfSpeech: "Adv.",
    example: "經過多年努力，這項技術已逐漸成熟並投入應用。",
    japanese: "徐々に",
    korean: "점차",
    vietnamese: "Dần dần",
  },
  {
    word: "終究",
    pinyin: "zhōngjiū",
    level: 6,
    english: "In the end / After all",
    partOfSpeech: "Adv.",
    example: "不切實際的計畫終究難以成功。",
    japanese: "結局",
    korean: "결국",
    vietnamese: "Cuối cùng",
  },
  {
    word: "犧牲",
    pinyin: "xīshēng",
    level: 6,
    english: "Sacrifice",
    partOfSpeech: "Verb / Noun",
    example: "為了達成目標，他不惜犧牲個人休息時間。",
    japanese: "犠牲",
    korean: "희생",
    vietnamese: "Hy sinh",
  },
  {
    word: "迎合",
    pinyin: "yínghé",
    level: 6,
    english: "Cater to / Pander to",
    partOfSpeech: "Verb",
    example: "產品設計應迎合消費者需求，才能提升市場競爭力。",
    japanese: "迎合する",
    korean: "영합하다",
    vietnamese: "Chiều theo",
  },
];

// 會話語法點 - From 3-3 PDF (以, 好在, 隨著)
export const dialogueGrammar: GrammarPoint[] = [
  {
    pattern: "以",
    level: 5,
    english: "In order to / By means of",
    example: "台積電承諾2030年前百分百使用再生能源以響應國際趨勢。",
  },
  {
    pattern: "好在",
    level: 5,
    english: "Fortunately / Luckily",
    example: "好在有像你這樣的研究者，能提供不同觀點。",
  },
  {
    pattern: "隨著",
    level: 5,
    english: "Along with / As (something changes)",
    example: "隨著時代改變，半導體產業僅憑技術已落伍。",
  },
];

// 短文語法點 - From 3-4 PDF
export const essayGrammar: GrammarPoint[] = [
  {
    pattern: "小自……大至……",
    level: 5,
    english: "Ranging from small...to large...",
    example: "小自夜市美食，大至壯麗山群，還是在國際科技領域中家喻戶曉的「台積電」？",
  },
  {
    pattern: "視……而定",
    level: 5,
    english: "Depend on...",
    example: "在未來的決策與投資，都須視環保與否而定。",
  },
  {
    pattern: "因而",
    level: 5,
    english: "Therefore / As a result",
    example: "在力求進步的同時，亦需考量社會的利益，因而在未來的決策與投資，都須視環保與否而定。",
  },
  {
    pattern: "一旦",
    level: 5,
    english: "Once / In case",
    example: "一旦遭遇乾旱或電力短缺，整條供應鏈都將因對環境的依賴而受到衝擊。",
  },
  {
    pattern: "換句話說",
    level: 5,
    english: "In other words",
    example: "換句話說，在半導體與水田之間，我們終能找出一條不必非此即彼的路徑。",
  },
];

// 課室活動
export const classroomActivities = [
  {
    id: "debate",
    title: "模擬辯論賽",
    description: "學生們分成三組：一組正方，一組反方，一組為裁判。各方五分鐘，一回合共十分鐘，分別用三回合，進行「半導體產業會/不會阻撓環境的發展」。以裁判方決定贏家，並進行點評。",
    fields: ["正方論點", "反方論點", "裁判講評"],
  },
  {
    id: "sales",
    title: "王牌銷售員",
    description: "假設你為一位業務銷售人員，請向台下的潛在客戶推銷自家的晶片產品（如：手機、手錶……）。如何凸顯產品優點；如何消除買家對產品的疑慮。分析半導體業的窒礙及突破關鍵。",
    fields: ["銷售人員姓名", "吸引原因", "產品疑慮", "是否解答疑惑"],
  },
];

// 會話對話內容 - From 3-3 PDF
export const dialogueContent = {
  title: "永續發展下的產業挑戰",
  warmUp: [
    "你平常注意環保議題嗎？舉一個你做過的永續行動。",
    "你認為企業在推動永續發展上，扮演了什麼樣的角色？",
  ],
  characters: [
    { name: "張輝", role: "半導體公司技術經理" },
    { name: "邱麗", role: "環境永續研究員，剛從歐洲回來" },
  ],
  setting: "2020 年，產業論壇",
  lines: [
    {
      speaker: "張輝",
      text: "近來得知邱研究員去歐洲考察，帶沒帶回「秘密武器」？",
    },
    {
      speaker: "邱麗",
      text: "張經理，秘密沒有，武器倒是有。歐洲產業所有碳排放量等等相關資訊，都得公開。要是台灣不跟著這麼做，再先進的技術也將被供應鏈拒絕。",
    },
    {
      speaker: "張輝",
      text: "不過，半導體產業的製造過程消耗極大，像我們這樣的研發部門，該如何平衡創新與環保？",
    },
    {
      speaker: "邱麗",
      text: "壓力確實巨大，不過眾人已採取行動。例如台積電承諾2030年前百分百使用再生能源以響應國際趨勢，並投資節能設備。",
    },
    {
      speaker: "張輝",
      text: "那麼，你認為我們企業，應當優先專注在哪個面向，才能跟上腳步？",
    },
    {
      speaker: "邱麗",
      text: "我當然認為「環境」是關鍵，畢竟大客戶們，如同蘋果、輝達都設定了碳中和目標，要求廠商配合。",
    },
    {
      speaker: "張輝",
      text: "我們企業直接面對市場壓力，還得負責技術創新。好在有像你這樣的研究者，能提供不同觀點。",
    },
    {
      speaker: "邱麗",
      text: "哪裡。隨著時代改變，半導體產業僅憑技術已落伍，須證明能為地球與社會帶來正面影響，才稱得上一流。",
    },
  ],
};

// 短文內容 - From 3-4 PDF
export const essayContent = {
  title: "矽島的抉擇——在半導體與水田之間",
  warmUp: [
    "請概述或猜測何為聯合國推動之「環境、社會與管治」？",
    "如何在科技與環境之間取捨？何者為優先考量？",
  ],
  paragraphs: [
    "當提到臺灣這個寶島時，您聯想起了什麼？小自夜市美食，大至壯麗山群，還是在國際科技領域中家喻戶曉的「台積電」？半導體產業不但是國內經濟的翹楚，它更持續為臺灣奠定在全球的經濟地位，甚至讓「矽島」這個稱號逐漸成為世界稱呼臺灣的新代名詞。然而，在全球邁向永續轉型之際，科技榮景背後，也悄悄埋下環境與資源失衡的憂慮。",
    "聯合國在 2006 年以永續社會責任（CSR）為基底所推動的另一個框架：環境、社會與管治（ESG），規範企業需平衡經濟與環境責任。在力求進步的同時，亦需考量社會的利益，因而在未來的決策與投資，都須視環保與否而定。在未來，致力減少碳的排放量將會成為典範，表現出色的企業占盡市場優勢、搶先取得商機與訂單，反之則被淘汰。",
    "吃驚的是，製造一塊晶片，平均耗水量竟超過一萬公升，且需要穩定電力，意味著一旦遭遇乾旱或電力短缺，整條供應鏈都將因對環境的依賴而受到衝擊。而這對環境產生的負面影響非同小可。在 2020 年，台積電為全球碳排放量第一名的半導體公司，總量高達 1,550 萬公噸。台積電被譽為「護國神山」，但若這座山脈是建立於高消耗的基礎上，長年下來，是否為了利益，犧牲人民未來？",
    "所幸，面對國際情勢，業界並非毫無作為。台積電更將供應鏈的碳足跡與績效列入公司重要指標。儘管用電高於整體水準，工業研究院的研究顯示，當台積電的製程每用 1 度電生產時，其晶片產品可為全球節省 4 度電。於是當產品全面啟用時，每年可減少碳排放 4,473 公噸，電則可省 891 萬度，如此一舉兩得的事，也給了自然一個喘息的空間。",
    "一味追求產值的時代逐漸過去，「又要馬兒好，又要馬兒不吃草」終究難以長久。換句話說，在半導體與水田之間，我們終能找出一條不必非此即彼的路徑，讓科技與土地並肩，不是遷就一方，而是讓「矽島」共榮的不二法門。",
  ],
};

// 參考文獻 - 會話篇 (From 3-3 PDF)
export const dialogueReferences: Reference[] = [
  {
    id: "d1",
    author: "SEMI Taiwan",
    year: "2021",
    title: "SEMI ESG Sustainability Initiative Ceremony [Video]",
    source: "YouTube",
    url: "https://www.youtube.com/live/ZJvt8R31RqI?si=EboJ3h79bwZMpY",
  },
  {
    id: "d2",
    author: "Greenpeace Taiwan",
    year: "2021",
    title: "Apple commits to 100% carbon neutrality by 2030, Taiwan suppliers should accelerate transition",
    source: "Greenpeace",
    url: "https://www.greenpeace.org/taiwan/update/21361/apple-%E6%89%BF%E8%AB%BE-2030-%E5%AF%A6%E7%8F%BE100%E7%A2%B3%E4%B8%AD%E5%92%8C%EF%BC%8C%E8%87%BA%E7%81%A3%E8%98%8B%E6%9E%9C%E4%BE%9B%E6%87%89%E9%8F%88%E5%B0%A0%E5%95%86%E6%87%89%E5%8A%A0%E9%80%9F/",
  },
  {
    id: "d3",
    author: "TSMC",
    year: "n.d.",
    title: "ESG at TSMC",
    source: "",
    url: "https://esg.tsmc.com/zh-Hant",
  },
];

// 參考文獻 - 短文篇 (From 3-4 PDF)
export const essayReferences: Reference[] = [
  {
    id: "e1",
    author: "Dun & Bradstreet",
    year: "n.d.",
    title: "ESG Registered",
    source: "",
    url: "https://www.dnb.com.tw/ESG-registered/",
  },
  {
    id: "e2",
    author: "United Way of Taiwan",
    year: "n.d.",
    title: "News and Updates",
    source: "",
    url: "https://www.unitedway.org.tw/view.aspx?SNo=4828&RID=cfce3c3c-8a60-4ce7-ac73-520a30992c74&srsltid=AfmBOoq5wtPQammcfrgNMQfZod9CVONrbJz3M9rjb1pwDBNCtEjiW9HL",
  },
  {
    id: "e3",
    author: "TSMC",
    year: "n.d.",
    title: "ESG at TSMC",
    source: "",
    url: "https://esg.tsmc.com/zh-Hant",
  },
];

// Combined references for backwards compatibility
export const references: Reference[] = [...dialogueReferences, ...essayReferences];
