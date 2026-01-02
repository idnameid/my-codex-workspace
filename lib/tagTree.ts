export type TagNode = {
  id: string;
  label_ko: string;
  children?: TagNode[];
};

export const tagTree: TagNode[] = [
  {
    id: "SENTENCE_STRUCTURE",
    label_ko: "문장 구조",
    children: [
      { id: "SENTENCE_STRUCTURE.SV", label_ko: "SV" },
      { id: "SENTENCE_STRUCTURE.SVC", label_ko: "SVC" },
      { id: "SENTENCE_STRUCTURE.SVO", label_ko: "SVO" },
      { id: "SENTENCE_STRUCTURE.SVOO", label_ko: "SVOO" },
      { id: "SENTENCE_STRUCTURE.SVOC", label_ko: "SVOC" }
    ]
  },
  {
    id: "NOUN_PHRASE",
    label_ko: "명사구",
    children: [
      { id: "NOUN_PHRASE.COUNTABLE", label_ko: "가산/불가산" },
      { id: "NOUN_PHRASE.DETERMINERS", label_ko: "한정사" },
      { id: "NOUN_PHRASE.QUANTIFIERS", label_ko: "수량 표현" },
      { id: "NOUN_PHRASE.A_NUMBER_OF", label_ko: "a number of vs the number of" }
    ]
  },
  {
    id: "MODIFIERS",
    label_ko: "수식어",
    children: [
      { id: "MODIFIERS.ADJ_POSITION", label_ko: "형용사 위치" },
      { id: "MODIFIERS.ADV_POSITION", label_ko: "부사 위치" },
      { id: "MODIFIERS.PREPOSITIONAL_PHRASES", label_ko: "전치사구 수식" }
    ]
  },
  {
    id: "CLAUSES",
    label_ko: "절",
    children: [
      { id: "CLAUSES.COORDINATION", label_ko: "등위접속" },
      { id: "CLAUSES.NOUN", label_ko: "명사절" },
      { id: "CLAUSES.RELATIVE", label_ko: "관계절" },
      { id: "CLAUSES.ADVERB", label_ko: "부사절" }
    ]
  },
  {
    id: "VERB_SYSTEM",
    label_ko: "동사 체계",
    children: [
      { id: "VERB_SYSTEM.TENSE", label_ko: "시제" },
      { id: "VERB_SYSTEM.ASPECT", label_ko: "상" },
      { id: "VERB_SYSTEM.VOICE", label_ko: "태" },
      { id: "VERB_SYSTEM.MODALS", label_ko: "조동사" },
      { id: "VERB_SYSTEM.NON_FINITES", label_ko: "준동사" }
    ]
  },
  {
    id: "PREPOSITIONS",
    label_ko: "전치사",
    children: [
      { id: "PREPOSITIONS.PATTERNS", label_ko: "전치사 + 명사구" }
    ]
  }
];

export const flattenTags = (nodes: TagNode[]): TagNode[] => {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenTags(node.children) : [])]);
};
