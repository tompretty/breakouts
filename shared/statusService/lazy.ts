import { TeamStatus, TeamStatusService } from "./types";

export function lazyTeamStatusService(
  getStatusService: () => TeamStatusService
) {
  let statusService: TeamStatusService | null = null;

  function getService() {
    if (!statusService) {
      statusService = getStatusService();
    }

    return statusService;
  }

  function getStatus(): Promise<TeamStatus> {
    return getService().getStatus();
  }

  function updateStatus(newStatus: TeamStatus): Promise<void> {
    return getService().updateStatus(newStatus);
  }

  return { getStatus, updateStatus };
}
