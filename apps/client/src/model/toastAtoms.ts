import { atom } from "jotai/vanilla";

export type Toast = {
  id: string;
  kind: "error" | "info" | "success";
  message: string;
};

export const toastsAtom = atom<Toast[]>([]);

export const pushToastActionAtom = atom(
  null,
  (get, set, input: { kind: Toast["kind"]; message: string; ttlMs?: number }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ttl = input.ttlMs ?? 5000;
    const next = [...get(toastsAtom), { id, kind: input.kind, message: input.message }];
    set(toastsAtom, next);
    if (ttl > 0) {
      setTimeout(() => {
        set(toastsAtom, (curr) => curr.filter((t) => t.id !== id));
      }, ttl);
    }
  }
);

export const dismissToastActionAtom = atom(null, (get, set, id: string) => {
  set(toastsAtom, get(toastsAtom).filter((t) => t.id !== id));
});

