export interface VocabularyItem {
  word: string;
  level: number;
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

// 會話生詞
export const dialogueVocabulary: VocabularyItem[] = [
  {
    word: "論壇",
    level: 7,
    english: "Forum",
    partOfSpeech: "Noun",
    example: "2020 年，產業論壇上討論了永續發展議題。",
    japanese: "フォーラム",
    korean: "포럼",
    vietnamese: "Diễn đàn",
  },
  {
    word: "秘密",
    level: 5,
    english: "Secret",
    partOfSpeech: "Noun / Adj.",
    example: "最近聽聞妳去歐洲考察，有沒有帶回什麼「秘密武器」？",
    japanese: "秘密",
    korean: "비밀",
    vietnamese: "Bí mật",
  },
  {
    word: "武器",
    level: 5,
    english: "Weapon",
    partOfSpeech: "Noun",
    example: "秘密沒有，武器倒是有。",
    japanese: "武器",
    korean: "무기",
    vietnamese: "Vũ khí",
  },
  {
    word: "產業",
    level: 5,
    english: "Industry",
    partOfSpeech: "Noun",
    example: "半導體產業不但是國內經濟的翹楚。",
    japanese: "産業",
    korean: "산업",
    vietnamese: "Ngành công nghiệp",
  },
  {
    word: "供應鏈",
    level: 5,
    english: "Supply Chain",
    partOfSpeech: "Noun",
    example: "再尖端的技術也可能將被供應鏈拒於門外。",
    japanese: "サプライチェーン",
    korean: "공급망",
    vietnamese: "Chuỗi cung ứng",
  },
  {
    word: "研發",
    level: 5,
    english: "R&D (Research and Development)",
    partOfSpeech: "Verb / Noun",
    example: "像我們這樣的研發部門，該如何平衡創新與永續？",
    japanese: "研究開発",
    korean: "연구 개발",
    vietnamese: "Nghiên cứu và phát triển",
  },
  {
    word: "碳",
    level: 7,
    english: "Carbon",
    partOfSpeech: "Noun",
    example: "致力減少碳的排放量將會成為圭臬。",
    japanese: "炭素",
    korean: "탄소",
    vietnamese: "Carbon",
  },
  {
    word: "永續",
    level: 6,
    english: "Sustainability",
    partOfSpeech: "Noun / Adj.",
    example: "數以萬計的企業開始重視永續發展。",
    japanese: "持続可能な",
    korean: "지속가능한",
    vietnamese: "Bền vững",
  },
  {
    word: "福祉",
    level: 7,
    english: "Well-being / Welfare",
    partOfSpeech: "Noun",
    example: "進步的同時，需考量社會的福祉。",
    japanese: "福祉",
    korean: "복지",
    vietnamese: "Phúc lợi",
  },
  {
    word: "晶片",
    level: 7,
    english: "Chip",
    partOfSpeech: "Noun",
    example: "製造一塊晶片，平均耗水量竟超過一萬公升。",
    japanese: "チップ",
    korean: "칩",
    vietnamese: "Con chip",
  },
  {
    word: "考察",
    level: 6,
    english: "To investigate / inspect",
    partOfSpeech: "Verb",
    example: "最近聽聞妳去歐洲考察，有沒有帶回什麼「秘密武器」？",
    japanese: "視察する",
    korean: "조사하다",
    vietnamese: "Khảo sát",
  },
  {
    word: "過程",
    level: 5,
    english: "Process",
    partOfSpeech: "Noun",
    example: "半導體產業的晶圓製造過程耗能極高。",
    japanese: "過程",
    korean: "과정",
    vietnamese: "Quá trình",
  },
  {
    word: "節能",
    level: 5,
    english: "Energy-saving",
    partOfSpeech: "Noun / Adj.",
    example: "台積電投資高效能的節能設備。",
    japanese: "省エネルギー",
    korean: "에너지 절약",
    vietnamese: "Tiết kiệm năng lượng",
  },
  {
    word: "平衡",
    level: 5,
    english: "Balance",
    partOfSpeech: "Verb / Noun",
    example: "該如何平衡創新與永續？",
    japanese: "バランス",
    korean: "균형",
    vietnamese: "Cân bằng",
  },
  {
    word: "再生",
    level: 6,
    english: "Renewable",
    partOfSpeech: "Adj. / Verb",
    example: "台積電承諾 2030 年前百分百使用再生能源。",
    japanese: "再生可能な",
    korean: "재생",
    vietnamese: "Tái tạo",
  },
  {
    word: "面向",
    level: 5,
    english: "Aspect / Orientation",
    partOfSpeech: "Noun",
    example: "應該優先聚焦在哪個面向？",
    japanese: "側面",
    korean: "측면",
    vietnamese: "Khía cạnh",
  },
  {
    word: "廠商",
    level: 5,
    english: "Manufacturer / Vendor",
    partOfSpeech: "Noun",
    example: "大客戶要求供應商跟進。",
    japanese: "メーカー",
    korean: "제조업체",
    vietnamese: "Nhà sản xuất",
  },
  {
    word: "觀點",
    level: 5,
    english: "Viewpoint",
    partOfSpeech: "Noun",
    example: "有像你這樣的研究者，能提供跨界的視角。",
    japanese: "観点",
    korean: "관점",
    vietnamese: "Quan điểm",
  },
  {
    word: "落伍",
    level: 5,
    english: "Outdated",
    partOfSpeech: "Adj.",
    example: "憑技術工藝的領先已經落伍。",
    japanese: "時代遅れの",
    korean: "뒤떨어진",
    vietnamese: "Lạc hậu",
  },
  {
    word: "一流",
    level: 5,
    english: "First-class",
    partOfSpeech: "Adj.",
    example: "必須證明能為地球與社會帶來正面影響，才稱得上一流。",
    japanese: "一流の",
    korean: "일류",
    vietnamese: "Hạng nhất",
  },
  {
    word: "碳中和",
    level: 6,
    english: "Carbon neutrality",
    partOfSpeech: "Noun",
    example: "蘋果、輝達都設定了碳中和目標。",
    japanese: "カーボンニュートラル",
    korean: "탄소 중립",
    vietnamese: "Trung hòa carbon",
  },
  {
    word: "當務之急",
    level: 7,
    english: "A top priority / urgent matter",
    partOfSpeech: "Noun",
    example: "我認為「環境」面向是當務之急。",
    japanese: "急務",
    korean: "시급한 일",
    vietnamese: "Việc cấp bách",
  },
  {
    word: "借鏡",
    level: 7,
    english: "To learn from / take as a lesson",
    partOfSpeech: "Verb",
    example: "這足以給台灣借鏡。",
    japanese: "手本にする",
    korean: "거울삼다",
    vietnamese: "Lấy làm gương",
  },
  {
    word: "躍躍欲試",
    level: 7,
    english: "Eager to try / Raring to go",
    partOfSpeech: "Adj.",
    example: "我們躍躍欲試。可是話說回來，這些計畫的落地成本高。",
    japanese: "試してみたくてうずうずする",
    korean: "해보고 싶어 안달이다",
    vietnamese: "Háo hức muốn thử",
  },
  {
    word: "脫穎而出",
    level: 7,
    english: "To stand out from the crowd",
    partOfSpeech: "Verb",
    example: "應該優先聚焦在哪個面向，才能真正脫穎而出？",
    japanese: "頭角を現す",
    korean: "두각을 나타내다",
    vietnamese: "Nổi bật",
  },
];

// 短文生詞
export const essayVocabulary: VocabularyItem[] = [
  {
    word: "家喻戶曉",
    level: 7,
    english: "Widely known / Household name",
    partOfSpeech: "Adj.",
    example: "蘋果推出的智慧型手機成為家喻戶曉的科技產品。",
    japanese: "誰もが知っている",
    korean: "누구나 다 아는",
    vietnamese: "Ai ai cũng biết",
  },
  {
    word: "稱號",
    level: 7,
    english: "Title / Designation",
    partOfSpeech: "Noun",
    example: "黃仁勳被臺灣媒體賦予「AI 教父」的稱號。",
    japanese: "称号",
    korean: "칭호",
    vietnamese: "Danh hiệu",
  },
  {
    word: "力求",
    level: 6,
    english: "Strive for",
    partOfSpeech: "Verb",
    example: "我們公司力求突破傳統，才能受到市場青睞。",
    japanese: "努力する",
    korean: "노력하다",
    vietnamese: "Nỗ lực",
  },
  {
    word: "兼顧",
    level: 6,
    english: "Take into account both",
    partOfSpeech: "Verb",
    example: "科技的發展需兼顧經濟效益與社會責任。",
    japanese: "両立させる",
    korean: "겸하여 돌보다",
    vietnamese: "Cân nhắc cả hai",
  },
  {
    word: "致力",
    level: 6,
    english: "Devote to",
    partOfSpeech: "Verb",
    example: "這家企業致力於開發可再生能源技術。",
    japanese: "専念する",
    korean: "전념하다",
    vietnamese: "Tận tâm",
  },
  {
    word: "圭臬",
    level: 7,
    english: "Standard / Guiding principle",
    partOfSpeech: "Noun",
    example: "聯合國的永續發展目標早已成為各國制定相關政策的圭臬。",
    japanese: "規範",
    korean: "규범",
    vietnamese: "Tiêu chuẩn",
  },
  {
    word: "優勢",
    level: 6,
    english: "Advantage",
    partOfSpeech: "Noun",
    example: "臺灣在半導體產業具有明顯市場優勢。",
    japanese: "優位",
    korean: "우위",
    vietnamese: "Lợi thế",
  },
  {
    word: "乾旱",
    level: 6,
    english: "Drought",
    partOfSpeech: "Noun",
    example: "氣候變遷的危機使非洲多地連年乾旱。",
    japanese: "干ばつ",
    korean: "가뭄",
    vietnamese: "Hạn hán",
  },
  {
    word: "短缺",
    level: 6,
    english: "Shortage",
    partOfSpeech: "Noun",
    example: "疫情期間，世界各地傳遍了醫療器材短缺的消息。",
    japanese: "不足",
    korean: "부족",
    vietnamese: "Thiếu hụt",
  },
  {
    word: "非同小可",
    level: 7,
    english: "Of great importance / Not trivial",
    partOfSpeech: "Adj.",
    example: "這對環境產生的負面影響非同小可。",
    japanese: "ただ事ではない",
    korean: "보통 일이 아닌",
    vietnamese: "Không phải chuyện nhỏ",
  },
  {
    word: "排放",
    level: 7,
    english: "Emission",
    partOfSpeech: "Noun / Verb",
    example: "製造業需要五年內將溫室氣體排放量降低三成。",
    japanese: "排出",
    korean: "배출",
    vietnamese: "Phát thải",
  },
  {
    word: "長年",
    level: 6,
    english: "For many years",
    partOfSpeech: "Adv.",
    example: "這家通訊設備公司長年投入 5G 技術研發。",
    japanese: "長年",
    korean: "오랫동안",
    vietnamese: "Nhiều năm",
  },
  {
    word: "一舉兩得",
    level: 6,
    english: "Kill two birds with one stone",
    partOfSpeech: "Idiom",
    example: "使用太陽能不但能省電，也能減少碳排放，可說是一舉兩得。",
    japanese: "一石二鳥",
    korean: "일거양득",
    vietnamese: "Một công đôi việc",
  },
  {
    word: "氣魄",
    level: 7,
    english: "Boldness / Grandeur",
    partOfSpeech: "Noun",
    example: "既護半導體之氣魄，亦守田地之豐饒。",
    japanese: "気概",
    korean: "기백",
    vietnamese: "Khí phách",
  },
  {
    word: "豐饒",
    level: 7,
    english: "Abundance / Fertility",
    partOfSpeech: "Adj. / Noun",
    example: "讓我們能更有效地管理資源，使其豐饒。",
    japanese: "豊穣",
    korean: "풍요",
    vietnamese: "Màu mỡ",
  },
  {
    word: "不二法門",
    level: 7,
    english: "The only way / Best approach",
    partOfSpeech: "Noun",
    example: "讓「矽島」共榮的不二法門。",
    japanese: "唯一の方法",
    korean: "유일한 방법",
    vietnamese: "Cách duy nhất",
  },
];

// 會話語法點
export const dialogueGrammar: GrammarPoint[] = [
  {
    pattern: "帶沒帶回…",
    level: 6,
    english: "A-not-A question structure in past context (Did you bring back...or not?)",
    example: "近來得知邱研究員去歐洲考察，帶沒帶回「秘密武器」？",
  },
  {
    pattern: "要是…，再…也…",
    level: 6,
    english: "Conditional: If..., then even... will...",
    example: "要是台灣不跟著這麼做，再先進的技術也將被供應鏈拒絕。",
  },
  {
    pattern: "事實上",
    level: 5,
    english: "In fact...",
    example: "許多民眾對人工智慧存有隱私疑慮，事實上，若在正確管制下，能有效提升醫療與教育的效率。",
  },
  {
    pattern: "難免",
    level: 5,
    english: "Unavoidably / Inevitably",
    example: "科技快速發展的同時，難免會出現法律與倫理上的灰色地帶。",
  },
  {
    pattern: "（可是）話說回來",
    level: 6,
    english: "Having said that / On the other hand",
    example: "無人機的確讓物流更快速，可是話說回來，它也引發了對空域安全與個資外洩的擔憂。",
  },
  {
    pattern: "由此看來",
    level: 6,
    english: "From this perspective / Thus",
    example: "多數新創企業開始重視 ESG 原則，由此看來，永續已不再只是口號。",
  },
  {
    pattern: "好在",
    level: 6,
    english: "Fortunately / Luckily",
    example: "那次電力中斷導致資料庫系統癱瘓，好在技術團隊平時經常演練備援流程。",
  },
  {
    pattern: "憑",
    level: 6,
    english: "By virtue of / Relying on",
    example: "這位年輕的工程師憑一篇有關量子運算的論文，獲得國際科技獎項。",
  },
];

// 短文語法點
export const essayGrammar: GrammarPoint[] = [
  {
    pattern: "小自…大至…",
    level: 5,
    english: "Ranging from...to...",
    example: "小自個人手機使用，大至國家電網系統，能源效率都成為現代科技的重點。",
  },
  {
    pattern: "視…而定",
    level: 5,
    english: "Depend on...",
    example: "一件產品的市場策略常常視當地文化與需求而定。",
  },
  {
    pattern: "既…也…",
    level: 5,
    english: "Both... and...",
    example: "既護半導體之氣魄，也守田地之豐饒。",
  },
  {
    pattern: "非…即…",
    level: 6,
    english: "Either... or...",
    example: "在晶片與水田之間，我們終能找出一條不必非此即彼的路徑。",
  },
  {
    pattern: "反之",
    level: 5,
    english: "Conversely / On the contrary",
    example: "良好的規範能促進人工智慧的創新及維持道德；反之，若缺乏監管，它會有認知錯誤的行為模式。",
  },
  {
    pattern: "竟",
    level: 5,
    english: "Unexpectedly / Surprisingly",
    example: "製造一塊晶片，平均耗水量竟超過一萬公升。",
  },
  {
    pattern: "於是",
    level: 5,
    english: "Therefore / And so",
    example: "團隊發現此新材料極具研究價值，於是立即成立小組，進行下一步實驗。",
  },
  {
    pattern: "換句話說",
    level: 5,
    english: "In other words",
    example: "5G 的速度將會更快，換句話說，它的速度能徹底改變物聯網的發展模式。",
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

// 會話對話內容
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
      text: "張經理，秘密沒有，武器倒是有。歐洲產業所有碳排放量等相關資訊，都得公開。要是台灣不跟著這麼做，再先進的技術也將被供應鏈拒絕。",
    },
    {
      speaker: "張輝",
      text: "不過，半導體產業的製造過程消耗極大，像我們這樣的研發部門，該如何平衡創新與環保？",
    },
    {
      speaker: "邱麗",
      text: "壓力確實巨大，不過眾人已採取行動。例如台積電承諾 2030 年前百分百使用再生能源，並投資節能設備。",
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
      text: "哪裡。如今，半導體產業僅憑技術已落伍，必須證明能為地球與社會帶來正面影響，才稱得上一流。",
    },
  ],
};

// 短文內容
export const essayContent = {
  title: "矽島的抉擇——在半導體與水田之間",
  warmUp: [
    "請概述或猜測何為聯合國推動之「環境、社會與管治」？",
    "如何在科技與環境之間取捨？何者為優先考量？",
  ],
  paragraphs: [
    "當提到臺灣這個寶島時，您聯想起了什麼？小自夜市美食，大至壯麗山群，還是在國際科技領域中家喻戶曉的「台積電」？半導體產業不但是國內經濟的翹楚，它更持續為臺灣奠定在全球的經濟地位，甚至讓「矽島」這個稱號逐漸成為世界稱呼臺灣的新代名詞。然而，在全球邁向永續轉型之際，科技榮景背後，也悄然埋下環境與資源失衡的隱憂。",
    "聯合國在 2006 年以永續社會責任（CSR）為基底所推動的另一個框架：環境、社會與管治（ESG），規範企業需平衡經濟與環境責任。在力求進步的同時，亦需兼顧社會的福祉，因此在未來的決策與投資，都須視環保與否而定。在未來，致力減少碳的排放量將會成為圭臬，表現出色的企業占盡市場優勢、搶先取得商機與訂單，反之則被淘汰。",
    "詫異的是，製造一塊晶片，平均耗水量竟超過一萬公升，且需要穩定電力，意味著一旦遭遇乾旱或電力短缺，整條供應鏈都將因對環境的依賴而受到衝擊。而這對環境產生的負面影響非同小可。在 2020 年，台積電為全球碳排放量第一名的半導體公司，總量高達 1,550 萬公噸。台積電被譽為「護國神山」，但若這座山脈是建立於高消耗的基礎上，長年下來，是否為了利益，犧牲人民未來？",
    "所幸，面對國際情勢，業界並非毫無作為。台積電更將供應鏈的碳足跡與績效列入公司重要指標。儘管用電高於整體水準，工業研究院的研究顯示，當台積電的製程每用 1 度電生產時，其晶片產品可為全球節省 4 度電。於是當產品全面啟用時，每年可減少碳排放 4,473 公噸，電則可省 891 萬度，如此一舉兩得的事，也給了自然一個喘息的空間。",
    "一味追求產值的時代已然過去，「又要馬兒好，又要馬兒不吃草」終究難以長久。換句話說，在晶片與水田之間，我們終能找出一條不必非此即彼的路徑——既護半導體之氣魄，亦守田地之豐饒。讓科技與土地攜手並行，不再是遷就一方，便是讓「矽島」共榮的不二法門。",
  ],
};

// 參考文獻
export const references: Reference[] = [
  {
    id: "1",
    author: "SEMI Taiwan",
    year: "2021",
    title: "SEMI半導體產業ESG永續倡議行動儀式",
    source: "YouTube",
    url: "https://www.youtube.com/live/ZJvt8R31RqI?si=qnHL7LqYl5ZPTaHF",
  },
  {
    id: "2",
    author: "National Academy for Educational Research",
    year: "n.d.",
    title: "Analysis of solution strategies for biofuel demand inducing food crisis",
    source: "Research Summary, No. 24",
    url: "https://epaper.naer.edu.tw/edm?eg_name=ResearchSummary&edm_no=24&content_no=597",
  },
  {
    id: "3",
    author: "National Academy for Educational Research",
    year: "n.d.",
    title: "Energy saving and carbon reduction for sustainable life development",
    source: "Research Summary, No. 43",
    url: "https://epaper.naer.edu.tw/edm?eg_name=ResearchSummary&edm_no=43&content_no=1170",
  },
  {
    id: "4",
    author: "National Academy for Educational Research",
    year: "n.d.",
    title: "Analysis of solution strategies for greenhouse gas emission problems",
    source: "Research Summary, No. 25",
    url: "https://epaper.naer.edu.tw/edm?eg_name=ResearchSummary&edm_no=25&content_no=619",
  },
];
