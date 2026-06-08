"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Star, Lightning, Drop, Flame, Coin, Cards, Lock } from "@phosphor-icons/react";
import Modal from "@/components/ui/Modal";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { majorCardImagePath, minorCardImagePath } from "@/lib/assets";
import { MAJOR_ARCANA_IDS, SUIT_META } from "@/lib/tarot-data";

const FILTERS = [
  { id: "all",       label: "全部",    icon: Cards   },
  { id: "major",     label: "大阿卡纳", icon: Star    },
  { id: "cups",      label: "圣杯",    icon: Drop    },
  { id: "swords",    label: "宝剑",    icon: Lightning},
  { id: "wands",     label: "权杖",    icon: Flame   },
  { id: "pentacles", label: "星币",    icon: Coin    },
] as const;

// ── 小阿卡纳文件名前缀映射 ─────────────────────────────────────
const SUIT_RANKS = ["ace","02","03","04","05","06","07","08","09","10","page","knight","queen","king"];
const SUIT_NAMES: Record<string, string[]> = {
  cups:      ["圣杯王牌","圣杯二","圣杯三","圣杯四","圣杯五","圣杯六","圣杯七","圣杯八","圣杯九","圣杯十","圣杯侍从","圣杯骑士","圣杯皇后","圣杯国王"],
  swords:    ["宝剑王牌","宝剑二","宝剑三","宝剑四","宝剑五","宝剑六","宝剑七","宝剑八","宝剑九","宝剑十","宝剑侍从","宝剑骑士","宝剑皇后","宝剑国王"],
  wands:     ["权杖王牌","权杖二","权杖三","权杖四","权杖五","权杖六","权杖七","权杖八","权杖九","权杖十","权杖侍从","权杖骑士","权杖皇后","权杖国王"],
  pentacles: ["星币王牌","星币二","星币三","星币四","星币五","星币六","星币七","星币八","星币九","星币十","星币侍从","星币骑士","星币皇后","星币国王"],
};
const MAJOR_NAMES = ["愚者","魔术师","女祭司","女皇","皇帝","教皇","恋人","战车","力量","隐士","命运之轮","正义","倒吊人","死神","节制","恶魔","塔","星星","月亮","太阳","审判","世界"];
const MAJOR_MEANINGS: Record<string, { upright: string; reversed: string; keywords: string[] }> = {
  the_fool:          { upright:"新的开始、天真无畏、自由探索", reversed:"鲁莽冲动、缺乏计划、天真幼稚", keywords:["新开始","冒险","自由","天真"] },
  the_magician:      { upright:"意志力、技巧、创造力与资源", reversed:"操控欲、技能浪费、诡计", keywords:["意志","创造","技巧","资源"] },
  the_high_priestess:{ upright:"直觉、神秘知识、内在智慧", reversed:"压抑直觉、隐藏秘密、脱离现实", keywords:["直觉","神秘","内省","智慧"] },
  the_empress:       { upright:"丰盛、母性、自然之美与创造", reversed:"依赖、创造力受阻、过度保护", keywords:["丰盛","母性","创造","自然"] },
  the_emperor:       { upright:"权威、结构、稳定与掌控", reversed:"专制、僵化、权力滥用", keywords:["权威","结构","稳定","掌控"] },
  the_hierophant:    { upright:"传统、精神指引、制度与信仰", reversed:"叛逆传统、个人信仰、非正统", keywords:["传统","信仰","指引","制度"] },
  the_lovers:        { upright:"爱情、选择、价值观的结合", reversed:"错误选择、价值观冲突、不忠", keywords:["爱情","选择","和谐","价值"] },
  the_chariot:       { upright:"意志力、决断、掌控与胜利", reversed:"失控、侵略性、缺乏方向", keywords:["意志","胜利","决断","掌控"] },
  strength:          { upright:"内在力量、勇气、耐心与慈悲", reversed:"自我怀疑、软弱、过度情绪化", keywords:["力量","勇气","耐心","慈悲"] },
  the_hermit:        { upright:"内省、独处、精神追求与指引", reversed:"孤立、拒绝帮助、逃避现实", keywords:["内省","独处","智慧","指引"] },
  wheel_of_fortune:  { upright:"命运转变、循环、好运降临", reversed:"厄运、抗拒变化、打破循环", keywords:["命运","循环","转变","机遇"] },
  justice:           { upright:"公正、真理、因果与平衡", reversed:"不公、逃避责任、偏见", keywords:["公正","真理","平衡","因果"] },
  the_hanged_man:    { upright:"暂停、牺牲、换个视角看问题", reversed:"拖延、无意义牺牲、固执", keywords:["暂停","牺牲","视角","等待"] },
  death:             { upright:"结束与转变、蜕变、新生", reversed:"抗拒变化、停滞不前、恐惧终结", keywords:["转变","结束","新生","蜕变"] },
  temperance:        { upright:"节制、平衡、调和与耐心", reversed:"失衡、过度、缺乏耐心", keywords:["节制","平衡","调和","耐心"] },
  the_devil:         { upright:"束缚、物欲、执念与阴暗面", reversed:"解脱束缚、重获自由、面对阴影", keywords:["束缚","执念","物欲","阴影"] },
  the_tower:         { upright:"突变、崩塌、打破旧有结构", reversed:"避免灾难、内在动荡、恐惧变化", keywords:["突变","崩塌","解放","启示"] },
  the_star:          { upright:"希望、灵感、内心平静与信念", reversed:"失望、绝望、缺乏信念", keywords:["希望","灵感","宁静","信念"] },
  the_moon:          { upright:"幻象、直觉、潜意识与恐惧", reversed:"困惑消散、真相浮现、恐惧释放", keywords:["直觉","幻象","潜意识","恐惧"] },
  the_sun:           { upright:"光明、活力、喜悦与成功", reversed:"内在快乐、低调、过度乐观", keywords:["喜悦","成功","活力","自信"] },
  judgement:         { upright:"审判、觉醒、召唤与重生", reversed:"自我怀疑、拒绝自省、错失机会", keywords:["觉醒","重生","审判","召唤"] },
  the_world:         { upright:"完成、整合、成就与圆满", reversed:"未竟之事、缺乏完结、延迟", keywords:["完成","圆满","整合","成就"] },
};

interface GalleryCard { id: string; name: string; arcana: "major"|"minor"; suit: string|null; number: number; imagePath: string }

function buildAllCards(): GalleryCard[] {
  const major: GalleryCard[] = MAJOR_ARCANA_IDS.map((id, i) => ({
    id, name: MAJOR_NAMES[i], arcana: "major", suit: null, number: i,
    imagePath: majorCardImagePath(id),
  }));
  const minor: GalleryCard[] = [];
  for (const suit of ["cups","swords","wands","pentacles"] as const) {
    SUIT_RANKS.forEach((rank, i) => {
      minor.push({
        id: `${rank}_of_${suit}`,
        name: SUIT_NAMES[suit][i],
        arcana: "minor", suit,
        number: i,
        imagePath: minorCardImagePath(suit, rank === "ace" ? "ace" : rank.padStart(2, "0")),
      });
    });
  }
  return [...major, ...minor];
}

const ALL_CARDS = buildAllCards();

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GalleryCard | null>(null);

  const filtered = useMemo(() => {
    let cards = ALL_CARDS;
    if (filter === "major") cards = cards.filter(c => c.arcana === "major");
    else if (filter !== "all") cards = cards.filter(c => c.suit === filter);
    if (search) cards = cards.filter(c => c.name.includes(search) || c.id.includes(search.toLowerCase()));
    return cards;
  }, [filter, search]);

  const meaning = selected ? MAJOR_MEANINGS[selected.id] : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div variants={staggerItem} className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-gold-100 mb-2">卡牌画廊</h1>
          <p className="text-gold-200/40">探索全部 78 张塔罗牌</p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(f => {
            const Icon = f.icon;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-ui transition-all ${
                  filter === f.id
                    ? "bg-gold-400/[0.1] text-gold-300 border border-gold-400/20"
                    : "text-gold-200/40 hover:text-gold-300 border border-transparent hover:border-gold-400/10"
                }`}>
                <Icon size={14} />{f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Search */}
        <motion.div variants={staggerItem} className="mb-8 max-w-xs">
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/30" />
            <input
              className="w-full pl-8 pr-4 py-2 bg-midnight/40 border border-gold-400/[0.08] rounded-lg text-sm text-gold-100 placeholder:text-gold-200/20 focus:outline-none focus:border-gold-400/30 font-ui"
              placeholder="搜索卡牌…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3"
          variants={staggerContainer}>
          {filtered.map((card, i) => (
            <motion.div key={card.id} variants={staggerItem}>
              <button className="w-full group" onClick={() => setSelected(card)}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden border border-gold-400/10 group-hover:border-gold-400/35 transition-all duration-300 relative bg-[#0d0b1e]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imagePath}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-contain p-0.5"
                    loading="lazy"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-gold-400/0 group-hover:bg-gold-400/[0.06] transition-all duration-300" />
                </div>
                <p className="mt-1.5 text-center text-[10px] font-heading text-gold-200/40 group-hover:text-gold-300 transition-colors leading-tight">
                  {card.name}
                </p>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gold-200/20">
            <p className="font-body text-lg">没有找到匹配的卡牌</p>
          </div>
        )}
      </motion.div>

      {/* Card detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} maxWidth="max-w-3xl">
        {selected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card art */}
            <div className="aspect-[2/3] rounded-xl overflow-hidden border border-gold-400/10 bg-[#0d0b1e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.imagePath} alt={selected.name} className="w-full h-full object-contain p-1" />
            </div>
            {/* Info */}
            <div>
              <p className="font-mono text-xs text-gold-400/40 mb-1">
                {selected.arcana === "major" ? "Major Arcana" : SUIT_META[selected.suit!]?.nameEn} · #{selected.number}
              </p>
              <h3 className="font-heading text-2xl font-semibold text-gold-100 mb-6">{selected.name}</h3>

              {meaning ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-ui text-gold-400/50 uppercase tracking-wider mb-2">正位含义</p>
                    <p className="text-sm text-gold-200/60 leading-relaxed">{meaning.upright}</p>
                  </div>
                  <div>
                    <p className="text-xs font-ui text-gold-400/50 uppercase tracking-wider mb-2">逆位含义</p>
                    <p className="text-sm text-gold-200/60 leading-relaxed">{meaning.reversed}</p>
                  </div>
                  <div>
                    <p className="text-xs font-ui text-gold-400/50 uppercase tracking-wider mb-2">关键词</p>
                    <div className="flex flex-wrap gap-2">
                      {meaning.keywords.map(kw => (
                        <span key={kw} className="px-3 py-1 rounded-full text-xs bg-gold-400/[0.08] text-gold-300 border border-gold-400/10">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-ui text-gold-400/50 uppercase tracking-wider mb-2">花色</p>
                    <p className="text-sm text-gold-200/60">{SUIT_META[selected.suit!]?.name} · {SUIT_META[selected.suit!]?.element}元素</p>
                  </div>
                  <p className="text-sm text-gold-200/30 italic">详细解读将在占卜中由 AI 为你呈现</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
