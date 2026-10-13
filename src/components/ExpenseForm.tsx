import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import {
  CATEGORIES,
  getAnimalLook,
  getLevelFromAmount,
  getLevelRangeLabel,
} from '../data';
import type { CategoryId } from '../types';
import { LEVEL_NAMES } from '../types';

interface Props {
  onSubmit: (amount: number, category: CategoryId, note: string) => void;
}

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [note, setNote] = useState('');

  const preview = useMemo(() => {
    const value = Number(amount);
    if (!value || value <= 0) return null;
    const level = getLevelFromAmount(category, value);
    const look = getAnimalLook(category, level);
    return { level, look, range: getLevelRangeLabel(category, level) };
  }, [amount, category]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    onSubmit(value, category, note.trim());
    setAmount('');
    setNote('');
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2 className="expense-form__title">記一筆消費</h2>
      <p className="expense-form__hint">
        每種類別有獨立金額區間；金額決定誕生動物的等級與外觀
      </p>

      <label className="field">
        <span>金額</span>
        <div className="field__money">
          <span className="field__currency">NT$</span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </label>

      <fieldset className="categories">
        <legend>消費類型</legend>
        <div className="categories__grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`categories__item ${category === cat.id ? 'is-active' : ''}`}
              style={
                {
                  '--cat-color': cat.color,
                  '--cat-soft': cat.softColor,
                } as CSSProperties
              }
              onClick={() => setCategory(cat.id)}
            >
              <span className="categories__emoji">{cat.emoji}</span>
              <span className="categories__label">{cat.label}</span>
              <span className="categories__animal">{cat.animal}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {preview && (
        <p className="expense-form__preview" aria-live="polite">
          <span className="expense-form__preview-emoji">{preview.look.emoji}</span>
          將誕生 Lv.{preview.level} {LEVEL_NAMES[preview.level - 1]}{' '}
          {preview.look.animal}
          <span className="expense-form__preview-range">（{preview.range}）</span>
        </p>
      )}

      <label className="field">
        <span>備註（選填）</span>
        <input
          type="text"
          placeholder="例如：午餐便當"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={40}
        />
      </label>

      <button type="submit" className="btn-primary" disabled={!amount || Number(amount) <= 0}>
        放進牧場
      </button>
    </form>
  );
}
