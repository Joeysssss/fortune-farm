import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAnimalLook,
  getLevelFromAmount,
  randomPosition,
  uid,
} from '../data';
import type { Animal, CategoryId, Expense, FarmState } from '../types';
import { MAX_LEVEL } from '../types';

const STORAGE_KEY = 'fortune-farm-v1';

function sumExpenseAmounts(expenseIds: string[], expenses: Expense[]): number {
  const idSet = new Set(expenseIds);
  return expenses
    .filter((e) => idSet.has(e.id))
    .reduce((sum, e) => sum + e.amount, 0);
}

/** 移除舊版 priceTier；未合併過的動物改依類別金額區間重算等級 */
function migrateState(raw: FarmState): FarmState {
  const animals = raw.animals.map((a) => {
    const legacy = a as Animal & { priceTier?: string };
    const { priceTier, ...rest } = legacy;
    if (priceTier && rest.expenseIds.length === 1) {
      const total = sumExpenseAmounts(rest.expenseIds, raw.expenses);
      if (total > 0) {
        return {
          ...rest,
          level: getLevelFromAmount(rest.category, total),
        };
      }
    }
    return rest;
  });
  return { ...raw, animals };
}

function loadState(): FarmState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateState(JSON.parse(raw) as FarmState);
  } catch {
    /* ignore */
  }
  return { expenses: [], animals: [], selectedIds: [] };
}

function saveState(state: FarmState) {
  const { selectedIds: _, ...persist } = state;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...persist, selectedIds: [] }),
  );
}

export type Toast = {
  id: string;
  message: string;
  emoji?: string;
};

export function useFarmStore() {
  const [state, setState] = useState<FarmState>(loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastSpawnId, setLastSpawnId] = useState<string | null>(null);
  const [lastMergeId, setLastMergeId] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const pushToast = useCallback((message: string, emoji?: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, message, emoji }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  const totalSpent = useMemo(
    () => state.expenses.reduce((s, e) => s + e.amount, 0),
    [state.expenses],
  );

  const addExpense = useCallback(
    (amount: number, category: CategoryId, note: string) => {
      const animalId = uid();
      const expenseId = uid();
      const level = getLevelFromAmount(category, amount);
      let spawned = false;

      setState((prev) => {
        const pos = randomPosition(prev.animals);
        const animal: Animal = {
          id: animalId,
          category,
          level,
          x: pos.x,
          y: pos.y,
          bornAt: Date.now(),
          expenseIds: [expenseId],
        };
        const expense: Expense = {
          id: expenseId,
          amount,
          category,
          note,
          createdAt: Date.now(),
          animalId,
        };
        spawned = true;
        return {
          ...prev,
          expenses: [expense, ...prev.expenses],
          animals: [...prev.animals, animal],
        };
      });

      if (spawned) {
        setLastSpawnId(animalId);
        window.setTimeout(() => setLastSpawnId(null), 900);
        const look = getAnimalLook(category, level);
        pushToast(`牧場誕生了 Lv.${level} ${look.animal}！`, look.emoji);
      }
    },
    [pushToast],
  );

  const toggleSelect = useCallback((id: string) => {
    setState((prev) => {
      const animal = prev.animals.find((a) => a.id === id);
      if (!animal) return prev;

      if (prev.selectedIds.includes(id)) {
        return {
          ...prev,
          selectedIds: prev.selectedIds.filter((x) => x !== id),
        };
      }

      if (prev.selectedIds.length === 0) {
        return { ...prev, selectedIds: [id] };
      }

      const first = prev.animals.find((a) => a.id === prev.selectedIds[0]);
      if (
        !first ||
        first.category !== animal.category ||
        first.level !== animal.level
      ) {
        return { ...prev, selectedIds: [id] };
      }

      if (prev.selectedIds.length >= 2) {
        return { ...prev, selectedIds: [id] };
      }

      return { ...prev, selectedIds: [...prev.selectedIds, id] };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedIds: [] }));
  }, []);

  const canMerge = useMemo(() => {
    if (state.selectedIds.length !== 2) return false;
    const [a, b] = state.selectedIds.map((id) =>
      state.animals.find((x) => x.id === id),
    );
    if (!a || !b) return false;
    return (
      a.category === b.category &&
      a.level === b.level &&
      a.level < MAX_LEVEL
    );
  }, [state.animals, state.selectedIds]);

  const mergeSelected = useCallback(() => {
    if (state.selectedIds.length !== 2) return;
    const [idA, idB] = state.selectedIds;
    const a = state.animals.find((x) => x.id === idA);
    const b = state.animals.find((x) => x.id === idB);
    if (!a || !b) return;
    if (a.category !== b.category || a.level !== b.level) return;
    if (a.level >= MAX_LEVEL) return;

    const merged: Animal = {
      id: uid(),
      category: a.category,
      level: a.level + 1,
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      bornAt: Date.now(),
      expenseIds: [...a.expenseIds, ...b.expenseIds],
    };

    setState((prev) => ({
      ...prev,
      animals: [
        ...prev.animals.filter((x) => x.id !== idA && x.id !== idB),
        merged,
      ],
      selectedIds: [],
    }));

    setLastMergeId(merged.id);
    window.setTimeout(() => setLastMergeId(null), 1200);

    const look = getAnimalLook(merged.category, merged.level);
    pushToast(`${look.animal}升級到 Lv.${merged.level}！`, look.emoji);
  }, [pushToast, state.animals, state.selectedIds]);

  const removeAnimal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      animals: prev.animals.filter((a) => a.id !== id),
      selectedIds: prev.selectedIds.filter((x) => x !== id),
      expenses: prev.expenses.filter((e) => e.animalId !== id),
    }));
  }, []);

  return {
    ...state,
    totalSpent,
    toasts,
    lastSpawnId,
    lastMergeId,
    canMerge,
    addExpense,
    toggleSelect,
    clearSelection,
    mergeSelected,
    removeAnimal,
  };
}
