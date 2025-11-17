import { useAtomValue, useSetAtom } from "jotai/react";
import { dismissToastActionAtom, toastsAtom } from "@@/model/toastAtoms";

export const ToastStack = () => {
  const toasts = useAtomValue(toastsAtom);
  const dismiss = useSetAtom(dismissToastActionAtom);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <span className="message">{t.message}</span>
          <button type="button" className="dismiss" onClick={() => dismiss(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

