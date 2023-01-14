import { GetStatus, TeamStatus, TeamStatusService } from "./types";

export function inMemoryTeamStatusService(
  teamMates: string[]
): TeamStatusService {
  const status: TeamStatus = {
    teamMates: teamMates.map((teamMate) => ({
      name: teamMate,
      isOnline: true,
    })),
  };

  const getStatus: GetStatus = () => Promise.resolve(status);

  return { getStatus };
}
