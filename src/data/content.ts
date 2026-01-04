export interface VocabularyItem {
  word: string;
  level: number;
  english: string;
  partOfSpeech?: string;
  example?: string;
  japanese?: string;
  korean?: string;
}

export interface GrammarPoint {
  pattern: string;
  level: number;
  english: string;
  example: string;
}

// 會話生詞
export const dialogueVocabulary: VocabularyItem[] = [
  {
    word: "考察",
    level: 6,
    english: "To investigate / inspect",
    partOfSpeech: "動詞",
    example: "最近聽聞妳去歐洲考察，有沒有帶回什麼「秘密武器」？",
    japanese: "視察する",
    korean: "조사하다",
  },
  {
    word: "受益",
    level: 6,
    english: "To benefit from",
    partOfSpeech: "動詞",
    example: "許多企業都從這項政策中受益。",
    japanese: "恩恵を受ける",
    korean: "혜택을 받다",
  },
  {
    word: "當務之急",
    level: 7,
    english: "A top priority / urgent matter",
    partOfSpeech: "名詞",
    example: "我認為「環境」面向是當務之急。",
    japanese: "急務",
    korean: "시급한 일",
  },
  {
    word: "借鏡",
    level: 7,
    english: "To learn from / take as a lesson",
    partOfSpeech: "動詞",
    example: "這足以給台灣借鏡。",
    japanese: "手本にする",
    korean: "거울삼다",
  },
  {
    word: "好說",
    level: 7,
    english: "You're too kind / It's nothing",
    partOfSpeech: "客套語",
    example: "好說，好說。對半導體產業來說，憑技術工藝的領先已經落伍。",
    japanese: "いえいえ",
    korean: "별말씀을요",
  },
  {
    word: "躍躍欲試",
    level: 7,
    english: "Eager to try / Raring to go",
    partOfSpeech: "形容詞",
    example: "我們躍躍欲試。可是話說回來，這些計畫的落地成本高。",
    japanese: "試してみたくてうずうずする",
    korean: "해보고 싶어 안달이다",
  },
  {
    word: "脫穎而出",
    level: 7,
    english: "To stand out from the crowd",
    partOfSpeech: "動詞",
    example: "應該優先聚焦在哪個面向，才能真正脫穎而出？",
    japanese: "頭角を現す",
    korean: "두각을 나타내다",
  },
  {
    word: "碳中和",
    level: 6,
    english: "Carbon neutrality",
    partOfSpeech: "名詞",
    example: "蘋果、輝達都設定了碳中和目標。",
    japanese: "カーボンニュートラル",
    korean: "탄소 중립",
  },
];

// 短文生詞
export const essayVocabulary: VocabularyItem[] = [
  {
    word: "家喻戶曉",
    level: 7,
    english: "Widely known / Household name",
    partOfSpeech: "形容詞",
    example: "蘋果推出的智慧型手機成為家喻戶曉的科技產品。",
    japanese: "誰もが知っている",
    korean: "누구나 다 아는",
  },
  {
    word: "稱號",
    level: 7,
    english: "Title / Designation",
    partOfSpeech: "名詞",
    example: "黃仁勳被臺灣媒體賦予「AI 教父」的稱號。",
    japanese: "称号",
    korean: "칭호",
  },
  {
    word: "永續",
    level: 6,
    english: "Sustainability",
    partOfSpeech: "名詞/形容詞",
    example: "數以萬計的企業開始重視永續發展，以降低對環境的傷害。",
    japanese: "持続可能な",
    korean: "지속가능한",
  },
  {
    word: "力求",
    level: 6,
    english: "Strive for",
    partOfSpeech: "動詞",
    example: "我們公司力求突破傳統，才能受到市場青睞。",
    japanese: "努力する",
    korean: "노력하다",
  },
  {
    word: "兼顧",
    level: 6,
    english: "Take into account both",
    partOfSpeech: "動詞",
    example: "科技的發展需兼顧經濟效益與社會責任。",
    japanese: "両立させる",
    korean: "겸하여 돌보다",
  },
  {
    word: "福祉",
    level: 7,
    english: "Well-being / Welfare",
    partOfSpeech: "名詞",
    example: "政府冀望透過智慧城市的建設，提升市民的福祉。",
    japanese: "福祉",
    korean: "복지",
  },
  {
    word: "圭臬",
    level: 7,
    english: "Standard / Guiding principle",
    partOfSpeech: "名詞",
    example: "聯合國的永續發展目標早已成為各國制定相關政策的圭臬。",
    japanese: "規範",
    korean: "규범",
  },
  {
    word: "非同小可",
    level: 7,
    english: "Of great importance / Not trivial",
    partOfSpeech: "形容詞",
    example: "這對環境產生的負面影響非同小可。",
    japanese: "ただ事ではない",
    korean: "보통 일이 아닌",
  },
  {
    word: "一舉兩得",
    level: 6,
    english: "Kill two birds with one stone",
    partOfSpeech: "成語",
    example: "使用太陽能不但能省電，也能減少碳排放，可說是一舉兩得。",
    japanese: "一石二鳥",
    korean: "일거양득",
  },
  {
    word: "氣魄",
    level: 7,
    english: "Boldness / Grandeur",
    partOfSpeech: "名詞",
    example: "既護半導體之氣魄，亦守田地之豐饒。",
    japanese: "気概",
    korean: "기백",
  },
  {
    word: "豐饒",
    level: 7,
    english: "Abundance / Fertility",
    partOfSpeech: "形容詞/名詞",
    example: "讓我們能更有效地管理資源，使其豐饒。",
    japanese: "豊穣",
    korean: "풍요",
  },
  {
    word: "不二法門",
    level: 7,
    english: "The only way / Best approach",
    partOfSpeech: "名詞",
    example: "讓「矽島」共榮的不二法門。",
    japanese: "唯一の方法",
    korean: "유일한 방법",
  },
];

// 會話語法點
export const dialogueGrammar: GrammarPoint[] = [
  {
    pattern: "事實上",
    level: 5,
    english: "In fact...",
    example: "許多民眾對人工智慧存有隱私疑慮，事實上，若在正確管制下，能有效提升醫療與教育的效率。",
  },
  {
    pattern: "再…也…",
    level: 5,
    english: "Even if...",
    example: "目前這種濾水設備再先進也無法完全解決部分地區的飲水問題。",
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
    pattern: "反之",
    level: 5,
    english: "Conversely / On the contrary",
    example: "良好的規範能促進人工智慧的創新及維持道德；反之，若缺乏監管，它會有認知錯誤的行為模式。",
  },
  {
    pattern: "竟",
    level: 5,
    english: "Unexpectedly / Surprisingly",
    example: "當時這套系統能自行撰寫報告，引起業界高度關注，現在則被認為是基本技能了。科技進步竟如此迅速。",
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
      text: "邱研究員，好久不見。最近聽聞妳去歐洲考察，有沒有帶回什麼「秘密武器」？畢竟現在不只比誰跑得快，還得看誰「穿得綠」。",
    },
    {
      speaker: "邱麗",
      text: "張經理，秘密沒有，武器倒是有。事實上，歐洲那邊的企業所有碳排放量、勞工權益、公司治理的細節都得攤在陽光下。這足以給台灣借鏡，要是不這麼做，再尖端的技術也可能將被供應鏈拒於門外。",
    },
    {
      speaker: "張輝",
      text: "可我們半導體產業的晶圓製造過程耗能極高，且經濟成長和永續發展難免被視為對立，像我們這樣的技術部門，該如何平衡創新與永續？",
    },
    {
      speaker: "邱麗",
      text: "由此看來，壓力確實大，但大家已開始付諸行動。像是台積電承諾 2030 年前百分百使用再生能源，並投資高效能的節能設備。還有其他企業開始採用海水冷卻系統，減少對淡水資源的依賴。你們公司有沒有考慮這類轉型？",
    },
    {
      speaker: "張輝",
      text: "我們躍躍欲試。可是話說回來，這些計畫的落地成本高，短期內很難看到回報。你認為像我們這樣的企業，應該優先聚焦在哪個面向，才能真正脫穎而出？",
    },
    {
      speaker: "邱麗",
      text: "這取決於你們的市場定位。至於台灣在全球半導體供應鏈的領導地位，我認為「環境」面向是當務之急，因為大客戶們，像是蘋果、輝達都設定了碳中和目標，要求供應商跟進。但「管治」也不容忽視，比如透明的供應鏈管理或反腐敗機制，能增加國際客戶的信任。",
    },
    {
      speaker: "張輝",
      text: "由此看來，我們企業要直接面對市場壓力，還得承擔技術創新的責任。不過好在有像你這樣的研究者，能提供跨界的視角。",
    },
    {
      speaker: "邱麗",
      text: "好說，好說。對半導體產業來說，憑技術工藝的領先已經落伍，必須證明創新能為地球和社會帶來正面影響。這也是未來十年，台灣半導體企業在全球市場站穩腳跟的關鍵。",
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
