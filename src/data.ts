import type { Category, CategoryId } from './types';
import { MAX_LEVEL } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: '餐飲',
    animal: '豬',
    emoji: '🐷',
    color: '#E87A6B',
    softColor: '#FDE8E4',
  },
  {
    id: 'transport',
    label: '交通',
    animal: '馬',
    emoji: '🐴',
    color: '#8B6B4A',
    softColor: '#F3EBE3',
  },
  {
    id: 'shopping',
    label: '購物',
    animal: '羊',
    emoji: '🐑',
    color: '#6B8F71',
    softColor: '#E8F0E9',
  },
  {
    id: 'entertainment',
    label: '娛樂',
    animal: '雞',
    emoji: '🐔',
    color: '#E8A838',
    softColor: '#FDF3E0',
  },
  {
    id: 'home',
    label: '居家',
    animal: '牛',
    emoji: '🐄',
    color: '#5A7A8C',
    softColor: '#E6EEF2',
  },
  {
    id: 'education',
    label: '學習',
    animal: '兔',
    emoji: '🐰',
    color: '#C47A9A',
    softColor: '#F8EAF0',
  },
  {
    id: 'health',
    label: '醫療',
    animal: '貓',
    emoji: '🐱',
    color: '#7A8CC4',
    softColor: '#EBEEF8',
  },
  {
    id: 'other',
    label: '其他',
    animal: '狗',
    emoji: '🐶',
    color: '#9A7B5A',
    softColor: '#F2EBE3',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

/**
 * 各類別 Lv.1–4 的金額上限（含）；超過 Lv.4 上限即為 Lv.5。
 * 單位：新臺幣（TWD）
 */
export const CATEGORY_LEVEL_CAPS: Record<
  CategoryId,
  readonly [number, number, number, number]
> = {
  food: [100, 300, 600, 1000],
  transport: [50, 150, 500, 1500],
  shopping: [200, 500, 1500, 5000],
  entertainment: [100, 300, 800, 2000],
  home: [300, 1000, 3000, 10000],
  education: [100, 500, 1500, 5000],
  health: [200, 500, 1500, 5000],
  other: [100, 500, 1000, 3000],
};

type LevelLook = { emoji: string; animal: string };

/** 各類別 Lv.1–5 對應外觀 */
const LEVEL_LOOKS: Record<
  CategoryId,
  readonly [LevelLook, LevelLook, LevelLook, LevelLook, LevelLook]
> = {
  food: [
    { emoji: '🐷', animal: '小豬' },
    { emoji: '🐽', animal: '肥豬' },
    { emoji: '🐖', animal: '壯豬' },
    { emoji: '🐗', animal: '野豬' },
    { emoji: '🐗', animal: '金豬' },
  ],
  transport: [
    { emoji: '🐴', animal: '小馬' },
    { emoji: '🐎', animal: '駿馬' },
    { emoji: '🏇', animal: '賽馬' },
    { emoji: '🦄', animal: '獨角獸' },
    { emoji: '🦓', animal: '星斑馬' },
  ],
  shopping: [
    { emoji: '🐑', animal: '小羊' },
    { emoji: '🐏', animal: '公羊' },
    { emoji: '🐐', animal: '山羊' },
    { emoji: '🦙', animal: '羊駝' },
    { emoji: '🦙', animal: '金羊駝' },
  ],
  entertainment: [
    { emoji: '🐤', animal: '小雞' },
    { emoji: '🐔', animal: '母雞' },
    { emoji: '🐓', animal: '公雞' },
    { emoji: '🦃', animal: '火雞' },
    { emoji: '🦚', animal: '孔雀' },
  ],
  home: [
    { emoji: '🐄', animal: '乳牛' },
    { emoji: '🐂', animal: '公牛' },
    { emoji: '🐃', animal: '水牛' },
    { emoji: '🦬', animal: '野牛' },
    { emoji: '🐮', animal: '聖牛' },
  ],
  education: [
    { emoji: '🐰', animal: '小兔' },
    { emoji: '🐇', animal: '兔子' },
    { emoji: '🐇', animal: '智兔' },
    { emoji: '🐹', animal: '學霸鼠' },
    { emoji: '🦫', animal: '博士狸' },
  ],
  health: [
    { emoji: '🐱', animal: '小貓' },
    { emoji: '🐈', animal: '貓咪' },
    { emoji: '😺', animal: '笑貓' },
    { emoji: '😻', animal: '愛心貓' },
    { emoji: '🦁', animal: '獅子' },
  ],
  other: [
    { emoji: '🐶', animal: '小狗' },
    { emoji: '🐕', animal: '狗狗' },
    { emoji: '🦮', animal: '導盲犬' },
    { emoji: '🐕‍🦺', animal: '工作犬' },
    { emoji: '🐺', animal: '狼犬' },
  ],
};

export function getLevelFromAmount(category: CategoryId, amount: number): number {
  const caps = CATEGORY_LEVEL_CAPS[category];
  for (let i = 0; i < caps.length; i += 1) {
    if (amount <= caps[i]) return i + 1;
  }
  return MAX_LEVEL;
}

export function getLevelRangeLabel(category: CategoryId, level: number): string {
  const caps = CATEGORY_LEVEL_CAPS[category];
  const lv = Math.min(Math.max(level, 1), MAX_LEVEL);
  if (lv === 1) return `NT$1–${caps[0].toLocaleString('zh-TW')}`;
  if (lv === MAX_LEVEL) {
    return `NT$${(caps[3] + 1).toLocaleString('zh-TW')} 以上`;
  }
  const prev = caps[lv - 2];
  const curr = caps[lv - 1];
  return `NT$${(prev + 1).toLocaleString('zh-TW')}–${curr.toLocaleString('zh-TW')}`;
}

export function getAnimalLook(category: CategoryId, level: number): LevelLook {
  const lv = Math.min(Math.max(level, 1), MAX_LEVEL);
  return LEVEL_LOOKS[category][lv - 1];
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Random position on the farm meadow (percent) */
export function randomPosition(existing: { x: number; y: number }[] = []): {
  x: number;
  y: number;
} {
  let attempts = 0;
  while (attempts < 40) {
    const x = 12 + Math.random() * 76;
    const y = 28 + Math.random() * 55;
    const tooClose = existing.some(
      (p) => Math.hypot(p.x - x, p.y - y) < 10,
    );
    if (!tooClose) return { x, y };
    attempts += 1;
  }
  return {
    x: 12 + Math.random() * 76,
    y: 28 + Math.random() * 55,
  };
}
