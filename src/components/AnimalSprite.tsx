import type { CSSProperties } from 'react';
import {
  CATEGORY_MAP,
  getAnimalLook,
  getLevelRangeLabel,
} from '../data';
import type { Animal } from '../types';
import { LEVEL_NAMES } from '../types';

interface Props {
  animal: Animal;
  selected: boolean;
  isSpawning: boolean;
  isMerging: boolean;
  onSelect: (id: string) => void;
}

export function AnimalSprite({
  animal,
  selected,
  isSpawning,
  isMerging,
  onSelect,
}: Props) {
  const cat = CATEGORY_MAP[animal.category];
  const look = getAnimalLook(animal.category, animal.level);
  const size = 0.85 + animal.level * 0.18;

  return (
    <button
      type="button"
      className={[
        'animal',
        `animal--lv-${animal.level}`,
        selected ? 'animal--selected' : '',
        isSpawning ? 'animal--spawn' : '',
        isMerging ? 'animal--merge' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          left: `${animal.x}%`,
          top: `${animal.y}%`,
          '--animal-scale': size,
          '--animal-color': cat.color,
          '--animal-soft': cat.softColor,
          zIndex: Math.round(animal.y) + (selected ? 50 : 0),
        } as CSSProperties
      }
      onClick={() => onSelect(animal.id)}
      aria-label={`${look.animal} Lv.${animal.level}`}
      title={`${cat.label} · ${look.animal} · Lv.${animal.level} ${LEVEL_NAMES[animal.level - 1]}（${getLevelRangeLabel(animal.category, animal.level)}）`}
    >
      <span className="animal__shadow" />
      <span className="animal__body" style={{ fontSize: `${1.6 + animal.level * 0.22}rem` }}>
        {look.emoji}
      </span>
      <span className="animal__badge">Lv.{animal.level}</span>
      {selected && <span className="animal__ring" />}
    </button>
  );
}
