// zod-schemas skill: the schema IS the type (z.infer) and the boundary parser.
import { z } from 'zod';

export const doctorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  specialty: z.string().min(1),
});

export type Doctor = z.infer<typeof doctorSchema>;
