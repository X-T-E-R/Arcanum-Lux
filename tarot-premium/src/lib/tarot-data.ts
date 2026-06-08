import type { Spread, SpreadPosition } from "@/types/card";

export const SPREADS: Spread[] = [
  {
    id: "single_card",
    name: "单牌占卜",
    nameEn: "Single Card",
    description: "一张牌，一个启示。适合日常提问与快速洞察。",
    cardCount: 1,
    positions: [
      {
        index: 0,
        name: "启示",
        nameEn: "The Message",
        description: "这张牌是宇宙给你的核心信息",
        x: 0,
        y: 0,
      },
    ],
  },
  {
    id: "three_card",
    name: "三牌牌阵",
    nameEn: "Three Card Spread",
    description: "过去、现在、未来的经典三牌展开，揭示时间的脉络。",
    cardCount: 3,
    positions: [
      {
        index: 0,
        name: "过去",
        nameEn: "Past / Situation",
        description: "影响你当前处境的因素",
        x: -220,
        y: 0,
      },
      {
        index: 1,
        name: "现在",
        nameEn: "Present / Action",
        description: "当前的行动与态度",
        x: 0,
        y: 0,
      },
      {
        index: 2,
        name: "未来",
        nameEn: "Future / Outcome",
        description: "当前路径的可能走向",
        x: 220,
        y: 0,
      },
    ],
  },
  {
    id: "celtic_cross",
    name: "凯尔特十字",
    nameEn: "Celtic Cross",
    description: "最全面的十牌展开，深入剖析复杂问题的各个层面。",
    cardCount: 10,
    positions: [
      { index: 0, name: "现状", nameEn: "Present Situation", description: "你当前所处的核心情境", x: 0, y: 0 },
      { index: 1, name: "挑战", nameEn: "Challenge", description: "横亘在前的主要障碍", x: 0, y: 0, rotation: 90 },
      { index: 2, name: "远因", nameEn: "Distant Past", description: "深层的根源与基础", x: -180, y: 120 },
      { index: 3, name: "近因", nameEn: "Recent Past", description: "最近发生的影响事件", x: -180, y: 0 },
      { index: 4, name: "可能结果", nameEn: "Possible Outcome", description: "最有可能的发展方向", x: 0, y: 180 },
      { index: 5, name: "近未来", nameEn: "Near Future", description: "即将发生的变化", x: 180, y: 0 },
      { index: 6, name: "你的态度", nameEn: "Your Approach", description: "你面对问题的方式与心态", x: 320, y: 120 },
      { index: 7, name: "外在影响", nameEn: "External Influences", description: "他人与环境的影响", x: 320, y: 40 },
      { index: 8, name: "希望与恐惧", nameEn: "Hopes & Fears", description: "内心深处的期望与担忧", x: 320, y: -40 },
      { index: 9, name: "最终结果", nameEn: "Final Outcome", description: "问题的最终走向与总结", x: 320, y: -120 },
    ],
  },
  {
    id: "relationship_cross",
    name: "关系牌阵",
    nameEn: "Relationship Spread",
    description: "七牌展开，透视关系中双方的真实状态与未来走向。",
    cardCount: 7,
    positions: [
      { index: 0, name: "你", nameEn: "You", description: "你在这段关系中的状态", x: -180, y: 0 },
      { index: 1, name: "对方", nameEn: "Partner", description: "对方在这段关系中的状态", x: 180, y: 0 },
      { index: 2, name: "关系", nameEn: "Relationship", description: "这段关系的本质", x: 0, y: 0 },
      { index: 3, name: "联结", nameEn: "What Unites", description: "将你们联系在一起的力量", x: 0, y: -120 },
      { index: 4, name: "分歧", nameEn: "What Divides", description: "造成距离的因素", x: 0, y: 120 },
      { index: 5, name: "建议", nameEn: "Advice", description: "塔罗给出的行动建议", x: -180, y: -120 },
      { index: 6, name: "未来潜力", nameEn: "Future Potential", description: "关系的发展方向", x: 180, y: -120 },
    ],
  },
];

export const MAJOR_ARCANA_IDS = [
  "the_fool", "the_magician", "the_high_priestess", "the_empress",
  "the_emperor", "the_hierophant", "the_lovers", "the_chariot",
  "strength", "the_hermit", "wheel_of_fortune", "justice",
  "the_hanged_man", "death", "temperance", "the_devil",
  "the_tower", "the_star", "the_moon", "the_sun",
  "judgement", "the_world",
];

export const SUIT_META: Record<string, { name: string; nameEn: string; element: string; color: string }> = {
  cups: { name: "圣杯", nameEn: "Cups", element: "水", color: "#60A5FA" },
  swords: { name: "宝剑", nameEn: "Swords", element: "风", color: "#94A3B8" },
  wands: { name: "权杖", nameEn: "Wands", element: "火", color: "#FB923C" },
  pentacles: { name: "星币", nameEn: "Pentacles", element: "土", color: "#34D399" },
};
