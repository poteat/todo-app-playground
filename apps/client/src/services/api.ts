const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

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
        const message = (data as { message?: string }).message ?? "Request failed";
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

import { Todo } from "@root/shared";

export const api = {
  async fetchTodos(): Promise<Todo[]> {
    return request<Todo[]>(`${API_BASE_URL}/todos`);
  },
  async createTodo(title: string): Promise<Todo> {
    return request<Todo>(`${API_BASE_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },
  async updateTodo(id: string, completed: boolean): Promise<Todo> {
    return request<Todo>(`${API_BASE_URL}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  },
  async deleteTodo(id: string) {
    await request<void>(`${API_BASE_URL}/todos/${id}`, { method: "DELETE" });
  },
};
