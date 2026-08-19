import z from "zod";

export const guideApplicationZodSchema = z.object({
  divisionId: z.string().min(1, "Division is required"),
});
