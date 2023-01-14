import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TeamStatusService } from "./statusService/types";
import { storageAccountTeamStatusService } from "./statusService/storageAccount";
import { inMemoryTeamStatusService } from "./statusService/inMemory";

let statusService: TeamStatusService | null = null;

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  if (!statusService) {
    statusService = getStatusService();
  }

  context.res = {
    headers: { "Content-Type": "application/json" },
    body: { status: await statusService.getStatus() },
  };
};

const getStatusService = (): TeamStatusService => {
  if (process.env.USE_STORAGE_ACCOUNT_STATUS_SERVICE) {
    return storageAccountTeamStatusService();
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

export default httpTrigger;
