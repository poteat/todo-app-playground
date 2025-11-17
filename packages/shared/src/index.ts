export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value as string}`);
};
