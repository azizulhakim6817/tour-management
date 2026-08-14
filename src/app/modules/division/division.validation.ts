import { z } from "zod";

//! create division zod----------------------------------------
export const createDivisionZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(100, { message: "Name can't exceed 100 characters" }),

  slug: z
    .string({ error: "Slug must be a string" })
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long!" })
    .max(100, { message: "Slug can't exceed 100 characters" })
    .optional(),

  thumbnail: z
    .string({ error: "Thumbnail must be a string" })
    .url({ message: "Thumbnail must be a valid URL" })
    .optional(),

  description: z
    .string({ error: "Description must be a string" })
    .trim()
    .max(1000, {
      message: "Description can't exceed 1000 characters",
    })
    .optional(),
});

//! update zod------------------------------------
export const updateDivisionZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(100, { message: "Name can't exceed 100 characters" })
    .optional(),

  slug: z
    .string({ error: "Slug must be a string" })
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long!" })
    .max(100, { message: "Slug can't exceed 100 characters" })
    .optional(),

  thumbnail: z
    .string({ error: "Thumbnail must be a string" })
    .url({ message: "Thumbnail must be a valid URL" })
    .optional(),

  description: z
    .string({ error: "Description must be a string" })
    .trim()
    .max(1000, {
      message: "Description can't exceed 1000 characters",
    })
    .optional(),
});
