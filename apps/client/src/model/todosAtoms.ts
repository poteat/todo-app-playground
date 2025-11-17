import { atom } from "jotai/vanilla";
import { Todo } from "@root/shared";
import { api } from "@/services/api";
import { pushToastActionAtom } from "@/model/toastAtoms";

export const todosAtom = atom<Todo[]>([]);
export const isLoadingAtom = atom<boolean>(true);

export const fetchTodosActionAtom = atom(null, async (_get, set) => {
  set(isLoadingAtom, true);
  try {
    const data = await api.fetchTodos();
    set(todosAtom, data);
  } catch (error) {
    console.error(error);
    set(pushToastActionAtom, {
      kind: "error",
      message: "Failed to load todos",
    });
  } finally {
    set(isLoadingAtom, false);
  }
});

export const createTodoActionAtom = atom(
  null,
  async (get, set, title: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, title, completed: false } as Todo;
    const prev = get(todosAtom);
    set(todosAtom, [optimistic, ...prev]);
    try {
      const saved = await api.createTodo(title);
      set(
        todosAtom,
        get(todosAtom).map((t) => (t.id === tempId ? saved : t))
      );
      return true;
    } catch {
      set(todosAtom, prev);
      set(pushToastActionAtom, {
        kind: "error",
        message: "Failed to create todo",
      });
      return false;
    }
  }
);

export const toggleTodoActionAtom = atom(
  null,
  async (get, set, payload: { id: string; completed: boolean }) => {
    const prev = get(todosAtom);
    const optimistic = prev.map((item) =>
      item.id === payload.id ? { ...item, completed: payload.completed } : item
    );
    set(todosAtom, optimistic);
    try {
      const updated = await api.updateTodo(payload.id, payload.completed);
      set(
        todosAtom,
        get(todosAtom).map((item) => (item.id === payload.id ? updated : item))
      );
    } catch {
      set(todosAtom, prev);
      set(pushToastActionAtom, {
        kind: "error",
        message: "Failed to update todo",
      });
    }
  }
);

export const removeTodoActionAtom = atom(null, async (get, set, id: string) => {
  const prev = get(todosAtom);
  set(
    todosAtom,
    prev.filter((item) => item.id !== id)
  );
  try {
    await api.deleteTodo(id);
  } catch {
    set(todosAtom, prev);
    set(pushToastActionAtom, {
      kind: "error",
      message: "Failed to delete todo",
    });
  }
});
