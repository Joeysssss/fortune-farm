import type { Toast } from '../hooks/useFarmStore';

interface Props {
  toasts: Toast[];
}

export function ToastStack({ toasts }: Props) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.emoji && <span>{t.emoji}</span>}
          <p>{t.message}</p>
        </div>
      ))}
    </div>
  );
}
