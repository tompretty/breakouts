import { z } from "zod";

export interface TeamStatus {
  teamMates: TeamMateStatus[];
}

export interface TeamMateStatus {
  name: string;
  isOnline: boolean;
}

export const teamMateStatusSchema = z.object({
  name: z.string(),
  isOnline: z.boolean(),
});

export const teamStatusSchema = z.object({
  teamMates: z.array(teamMateStatusSchema),
});
