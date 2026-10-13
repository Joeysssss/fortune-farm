import {
  CATEGORY_MAP,
  formatMoney,
  getAnimalLook,
  getLevelFromAmount,
  getLevelRangeLabel,
} from '../data';
import type { Animal, Expense } from '../types';
import { LEVEL_NAMES, MAX_LEVEL } from '../types';

interface Props {
  animals: Animal[];
  expenses: Expense[];
  selectedIds: string[];
  canMerge: boolean;
  onMerge: () => void;
  onClearSelection: () => void;
}

export function SidePanel({
  animals,
  expenses,
  selectedIds,
  canMerge,
  onMerge,
  onClearSelection,
}: Props) {
  const selected = selectedIds
    .map((id) => animals.find((a) => a.id === id))
    .filter(Boolean) as Animal[];

  const byCategory = animals.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="side-panel">
      {selected.length > 0 && (
        <div className="merge-box">
          <h3>合併動物</h3>
          <p>
            選取兩隻相同類型、相同等級的動物，即可合併升級
            {selected[0] && selected[0].level >= MAX_LEVEL
              ? '（已達最高等級）'
              : ''}
          </p>
          <div className="merge-box__picks">
            {selected.map((a) => {
              const look = getAnimalLook(a.category, a.level);
              return (
                <div key={a.id} className="merge-box__chip">
                  <span>{look.emoji}</span>
                  <span>
                    {look.animal} · Lv.{a.level} {LEVEL_NAMES[a.level - 1]}
                  </span>
                </div>
              );
            })}
            {selected.length === 1 && (
              <div className="merge-box__chip merge-box__chip--ghost">
                再選一隻同類
              </div>
            )}
          </div>
          <div className="merge-box__actions">
            <button
              type="button"
              className="btn-primary"
              disabled={!canMerge}
              onClick={onMerge}
            >
              合併升級
            </button>
            <button type="button" className="btn-ghost" onClick={onClearSelection}>
              取消
            </button>
          </div>
        </div>
      )}

      <div className="herd">
        <h3>牧場圖鑑</h3>
        {animals.length === 0 ? (
          <p className="herd__empty">還沒有動物喔</p>
        ) : (
          <ul className="herd__list">
            {Object.entries(byCategory).map(([catId, count]) => {
              const cat = CATEGORY_MAP[catId as keyof typeof CATEGORY_MAP];
              return (
                <li key={catId}>
                  <span className="herd__emoji">{cat.emoji}</span>
                  <span className="herd__name">{cat.animal}</span>
                  <span className="herd__meta">{cat.label}</span>
                  <span className="herd__count">×{count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="ledger">
        <h3>最近記帳</h3>
        {expenses.length === 0 ? (
          <p className="ledger__empty">尚無紀錄</p>
        ) : (
          <ul className="ledger__list">
            {expenses.slice(0, 8).map((e) => {
              const cat = CATEGORY_MAP[e.category];
              const level = getLevelFromAmount(e.category, e.amount);
              const look = getAnimalLook(e.category, level);
              return (
                <li key={e.id}>
                  <span className="ledger__emoji">{look.emoji}</span>
                  <div className="ledger__info">
                    <strong>
                      {cat.label} · Lv.{level}
                    </strong>
                    <span>
                      {e.note || look.animal} · {getLevelRangeLabel(e.category, level)}
                    </span>
                  </div>
                  <span className="ledger__amount">{formatMoney(e.amount)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
