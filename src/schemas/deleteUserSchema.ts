import { z } from "zod";

export const deleteUserParamsSchema = z.object({
  id: z.uuid(),
});

export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
