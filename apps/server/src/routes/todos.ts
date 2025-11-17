import { Router } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

import { prisma } from "../lib/prisma";

const router = Router();

const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const updateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

router.get("/", async (_req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = createTodoSchema.parse(req.body);
    const todo = await prisma.todo.create({ data });
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateTodoSchema.parse(req.body);

    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing) {
      throw createHttpError(404, "Todo not found");
    }

    const todo = await prisma.todo.update({
      where: { id },
      data,
    });

    res.json(todo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (createHttpError.isHttpError(error)) {
      return next(error);
    }

    // Prisma throws a known request error if the record does not exist
    if ((error as { code?: string }).code === "P2025") {
      return next(createHttpError(404, "Todo not found"));
    }

    next(error);
  }
});

export default router;
