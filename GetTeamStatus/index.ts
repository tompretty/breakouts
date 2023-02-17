import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";
import { lazyTeamStatusService } from "../shared/statusService/lazy";
import { sharedInMemoryTeamStatusService } from "../shared/statusService/sharedInMemory";
import { storageAccountTeamStatusService } from "../shared/statusService/storageAccount";
import { TeamStatusService } from "../shared/statusService/types";

// ---- Types ---- //

interface FunctionProps {
  statusService: TeamStatusService;
}

// ---- Function getter ---- //

export const getFunction = ({ statusService }: FunctionProps) => {
  const httpTrigger: AzureFunction = async (
    context: Context,
    req: HttpRequest
  ): Promise<void> => {
    context.res = {
      headers: { "Content-Type": "application/json" },
      body: await statusService.getStatus(),
    };
  };

  return httpTrigger;
};

// ---- Helpers ---- //

const getStatusService = (): TeamStatusService => {
  if (process.env.STATUS_SERVICE_TYPE === "STORAGE_ACCOUNT") {
    return storageAccountTeamStatusService();
  }

  if (process.env.STATUS_SERVICE_TYPE === "SHARED_IN_MEMORY") {
    return sharedInMemoryTeamStatusService();
  }

  return inMemoryTeamStatusService([
    "Andrew",
    "Mihai",
    "Nick",
    "Matthew",
    "Ollie",
    "Jeet",
  ]);
};

// ---- Function export ---- //

export const run = getFunction({
  statusService: lazyTeamStatusService(getStatusService),
});
