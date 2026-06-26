import { z } from 'zod';

export const ShortenSchema = z.object({
    longUrl: z.url("Invalid URL format"),
});

export type ShortenInput = z.infer<typeof ShortenSchema>;
