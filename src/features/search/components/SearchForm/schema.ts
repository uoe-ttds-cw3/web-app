import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term").max(200),
});

export type SearchFormData = z.infer<typeof searchSchema>;
