import { FormEvent, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";

import { TodoList } from "@/components/TodoList";
import { ToastStack } from "@/components/ToastStack";
import {
  todosAtom,
  isLoadingAtom,
  fetchTodosActionAtom,
  createTodoActionAtom,
  toggleTodoActionAtom,
  removeTodoActionAtom,
} from "@/model/todosAtoms";

function App() {
  const [title, setTitle] = useState("");
  const todos = useAtomValue(todosAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const fetchTodos = useSetAtom(fetchTodosActionAtom);
  const createTodo = useSetAtom(createTodoActionAtom);
  const toggleTodo = useSetAtom(toggleTodoActionAtom);
  const removeTodo = useSetAtom(removeTodoActionAtom);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const ok = await createTodo(title.trim());
    if (ok) {
      setTitle("");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="app-shell">
      <header>
        <h1>Todo Playground</h1>
        <p>Express + Prisma API with a Vite React client.</p>
      </header>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Add a todo…"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggle={(id, completed) => toggleTodo({ id, completed })}
        onDelete={(id) => removeTodo(id)}
      />
      <ToastStack />
    </div>
  );
}

export default App;
