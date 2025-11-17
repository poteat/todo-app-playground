import { useCallback, useEffect, useState } from "react";
import { Todo } from "@/shared";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        const message =
          (data as { message?: string }).message ?? "Request failed";
        throw new Error(message);
      } catch {
        throw new Error("Request failed");
      }
    }
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    const data = await request<Todo[]>(`${API_BASE_URL}/todos`);
    setTodos(data);
    setIsLoading(false);
  }, []);

  const createTodo = useCallback(async (title: string) => {
    const todo = await request<Todo>(`${API_BASE_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    setTodos((current) => [todo, ...current]);
  }, []);

  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    const todo = await request<Todo>(`${API_BASE_URL}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
    setTodos((current) =>
      current.map((item) => (item.id === id ? todo : item))
    );
  }, []);

  const removeTodo = useCallback(async (id: string) => {
    await request<void>(`${API_BASE_URL}/todos/${id}`, { method: "DELETE" });
    setTodos((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    fetchTodos().catch((error) => {
      console.error(error);
    });
  }, [fetchTodos]);

  return { todos, isLoading, createTodo, toggleTodo, removeTodo };
};
