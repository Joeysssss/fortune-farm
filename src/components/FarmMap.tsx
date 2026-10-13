import type { Animal } from '../types';
import { AnimalSprite } from './AnimalSprite';

interface Props {
  animals: Animal[];
  selectedIds: string[];
  lastSpawnId: string | null;
  lastMergeId: string | null;
  onSelect: (id: string) => void;
}

export function FarmMap({
  animals,
  selectedIds,
  lastSpawnId,
  lastMergeId,
  onSelect,
}: Props) {
  return (
    <section className="farm" aria-label="牧場地圖">
      <div className="farm__sky">
        <div className="farm__sun" />
        <div className="farm__cloud farm__cloud--1" />
        <div className="farm__cloud farm__cloud--2" />
        <div className="farm__cloud farm__cloud--3" />
      </div>

      <div className="farm__hills">
        <svg viewBox="0 0 800 220" preserveAspectRatio="none" className="farm__hill-svg">
          <path
            d="M0,140 C80,90 160,160 260,110 C360,60 420,150 520,100 C620,50 700,130 800,90 L800,220 L0,220 Z"
            fill="#7BA86A"
          />
          <path
            d="M0,170 C100,130 180,190 300,150 C420,110 500,180 620,140 C720,110 760,160 800,145 L800,220 L0,220 Z"
            fill="#8FBA78"
          />
        </svg>
      </div>

      <div className="farm__meadow">
        <div className="farm__barn" aria-hidden="true">
          <div className="farm__barn-roof" />
          <div className="farm__barn-body">
            <div className="farm__barn-door" />
          </div>
        </div>

        <div className="farm__tree farm__tree--1" aria-hidden="true">
          <div className="farm__tree-crown" />
          <div className="farm__tree-trunk" />
        </div>
        <div className="farm__tree farm__tree--2" aria-hidden="true">
          <div className="farm__tree-crown" />
          <div className="farm__tree-trunk" />
        </div>

        <div className="farm__fence" aria-hidden="true" />

        {animals.length === 0 && (
          <div className="farm__empty">
            <p>牧場還空蕩蕩的</p>
            <span>記下一筆消費，動物就會出現喔</span>
          </div>
        )}

        {animals.map((animal) => (
          <AnimalSprite
            key={animal.id}
            animal={animal}
            selected={selectedIds.includes(animal.id)}
            isSpawning={animal.id === lastSpawnId}
            isMerging={animal.id === lastMergeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
