import { TeamStatus, TeamStatusService } from "./types";

export function inMemoryTeamStatusService(
  teamMates: string[]
): TeamStatusService {
  let status: TeamStatus = {
    teamMates: teamMates.map((teamMate) => ({
      name: teamMate,
      isOnline: true,
    })),
  };

  function getStatus(): Promise<TeamStatus> {
    return Promise.resolve(status);
  }

  function updateStatus(newStatus: TeamStatus): Promise<void> {
    status = newStatus;
    return Promise.resolve();
  }

  return { getStatus, updateStatus };
}
