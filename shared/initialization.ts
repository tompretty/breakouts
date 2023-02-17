import { inMemoryTeamStatusService } from "./statusService/inMemory";
import { lazyTeamStatusService } from "./statusService/lazy";
import { sharedInMemoryTeamStatusService } from "./statusService/sharedInMemory";
import { storageAccountTeamStatusService } from "./statusService/storageAccount";
import { TeamStatusService } from "./statusService/types";

export interface FunctionProps {
  statusService: TeamStatusService;
}

export const statusService = lazyTeamStatusService(getStatusService);

// ---- Helpers ---- //

function getStatusService() {
  if (process.env.STATUS_SERVICE_TYPE === "STORAGE_ACCOUNT") {
    return storageAccountTeamStatusService();
  }

  if (process.env.STATUS_SERVICE_TYPE === "SHARED_IN_MEMORY") {
    return sharedInMemoryTeamStatusService();
  }

  return inMemoryTeamStatusService(DEFAULT_TEAMMATES);
}

// ---- Constants ---- //

const DEFAULT_TEAMMATES = [
  "Andrew",
  "Mihai",
  "Nick",
  "Matthew",
  "Ollie",
  "Jeet",
];
