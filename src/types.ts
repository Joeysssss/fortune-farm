export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'home'
  | 'education'
  | 'health'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  animal: string;
  emoji: string;
  color: string;
  softColor: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  createdAt: number;
  animalId: string;
}

export interface Animal {
  id: string;
  category: CategoryId;
  /** 由該類別金額區間決定；合併後 +1 */
  level: number;
  x: number;
  y: number;
  bornAt: number;
  expenseIds: string[];
}

export interface FarmState {
  expenses: Expense[];
  animals: Animal[];
  selectedIds: string[];
}

export const MAX_LEVEL = 5;

export const LEVEL_NAMES = ['幼崽', '成長', '成年', '精英', '傳說'] as const;
