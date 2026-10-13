import { useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { FarmMap } from './components/FarmMap';
import { SidePanel } from './components/SidePanel';
import { StatsBar } from './components/StatsBar';
import { ToastStack } from './components/ToastStack';
import { useFarmStore } from './hooks/useFarmStore';

function App() {
  const farm = useFarmStore();
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="app">
      <StatsBar
        totalSpent={farm.totalSpent}
        animalCount={farm.animals.length}
        expenseCount={farm.expenses.length}
      />

      <main className="app__main">
        <div className="app__farm-wrap">
          <FarmMap
            animals={farm.animals}
            selectedIds={farm.selectedIds}
            lastSpawnId={farm.lastSpawnId}
            lastMergeId={farm.lastMergeId}
            onSelect={farm.toggleSelect}
          />
          <button
            type="button"
            className="fab"
            onClick={() => setShowForm((v) => !v)}
            aria-label={showForm ? '關閉記帳' : '開啟記帳'}
          >
            {showForm ? '×' : '+'}
          </button>
        </div>

        <aside className={`app__aside ${showForm ? 'is-open' : ''}`}>
          <ExpenseForm onSubmit={farm.addExpense} />
          <SidePanel
            animals={farm.animals}
            expenses={farm.expenses}
            selectedIds={farm.selectedIds}
            canMerge={farm.canMerge}
            onMerge={farm.mergeSelected}
            onClearSelection={farm.clearSelection}
          />
        </aside>
      </main>

      <ToastStack toasts={farm.toasts} />
    </div>
  );
}

export default App;
