import { TeamStatus, TeamStatusService } from "./types";

export function sharedInMemoryTeamStatusService(): TeamStatusService {
  function getStatus(): Promise<TeamStatus> {
    return Promise.resolve(status);
  }

  function updateStatus(newStatus: TeamStatus): Promise<void> {
    status = newStatus;
    return Promise.resolve();
  }

  return { getStatus, updateStatus };
}

const TEAMMATES = ["Tom P", "Tom S", "Tom Z"];

let status: TeamStatus = {
  teamMates: TEAMMATES.map((teamMate) => ({
    name: teamMate,
    isOnline: true,
  })),
};
