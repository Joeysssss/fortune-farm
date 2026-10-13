import { formatMoney } from '../data';

interface Props {
  totalSpent: number;
  animalCount: number;
  expenseCount: number;
}

export function StatsBar({ totalSpent, animalCount, expenseCount }: Props) {
  return (
    <header className="stats">
      <div className="stats__brand">
        <span className="stats__logo" aria-hidden="true">
          🌾
        </span>
        <div>
          <h1>記帳牧場</h1>
          <p>Fortune Farm</p>
        </div>
      </div>
      <div className="stats__metrics">
        <div className="stats__metric">
          <span className="stats__label">總支出</span>
          <strong>{formatMoney(totalSpent)}</strong>
        </div>
        <div className="stats__metric">
          <span className="stats__label">動物</span>
          <strong>{animalCount}</strong>
        </div>
        <div className="stats__metric">
          <span className="stats__label">筆數</span>
          <strong>{expenseCount}</strong>
        </div>
      </div>
    </header>
  );
}
