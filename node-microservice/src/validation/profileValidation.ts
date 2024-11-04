import { z } from 'zod';

export const profileAuthenticatedSchema = z.object({
  githubToken: z.string().min(10),
});
