import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";
import { storageAccountTeamStatusService } from "../shared/statusService/storageAccount";
import { TeamStatusService } from "../shared/statusService/types";

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
