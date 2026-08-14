import { z } from "zod";

//! tour create- zod-----------------------------------
export const createTourZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters long!" })
    .max(200, { message: "Title can't exceed 200 characters" }),

  slug: z.string().trim().min(2, { message: "Slug is required!" }).optional(),

  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long!" }),

  images: z.array(z.string().url()).optional(),

  location: z.string().trim().optional(),

  costFrom: z
    .number()
    .nonnegative({ message: "Cost must be greater than or equal to 0" })
    .optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
  departureLocation: z.string().trim().min(1).optional(),
  arrivalLocation: z.string().trim().min(1).optional(),

  included: z.array(z.string()).optional(),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z.number().int().positive().optional(),

  minAge: z
    .number()
    .int()
    .nonnegative({ message: "Minimum age can't be negative" })
    .optional(),

  division: z.string().min(1, { message: "Division is required" }),

  tourTypes: z.string().min(1, { message: "Tour type is required" }),
});

//! tour update Zod -----------------------------
export const updateTourZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters long!" })
    .max(200, { message: "Title can't exceed 200 characters" })
    .optional(),

  slug: z.string().trim().min(2, { message: "Slug is required!" }).optional(),

  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long!" })
    .optional(),

  images: z.array(z.string().url()).optional(),

  location: z.string().trim().optional(),

  costFrom: z
    .number()
    .nonnegative({ message: "Cost must be greater than or equal to 0" })
    .optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
  departureLocation: z.string().trim().min(1).optional(),
  arrivalLocation: z.string().trim().min(1).optional(),

  included: z.array(z.string()).optional(),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z.number().int().positive().optional(),

  minAge: z
    .number()
    .int()
    .nonnegative({ message: "Minimum age can't be negative" })
    .optional(),

  division: z.string().optional(),

  tourTypes: z.string().optional(),
  deleteImages: z.array(z.string()).optional(),
});
