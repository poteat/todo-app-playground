import { Todo } from "@root/shared";

type TodoListProps = {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const TodoList = ({
  todos,
  isLoading,
  onToggle,
  onDelete,
}: TodoListProps) => {
  if (isLoading) {
    return <p>Loading todos…</p>;
  }

  if (todos.length === 0) {
    return <p>No todos yet. Add one above!</p>;
  }

  return (
    <ul className="todos">
      {todos.map((todo) => (
        <li className="todo-card" key={todo.id}>
          <span className={todo.completed ? "completed" : undefined}>
            {todo.title}
          </span>
          <div>
            <button
              type="button"
              onClick={() => onToggle(todo.id, !todo.completed)}
            >
              {todo.completed ? "Undo" : "Done"}
            </button>
            <button
              type="button"
              className="delete"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
