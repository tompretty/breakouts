import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { teamStatusSchema } from "../shared/models/teamStatus";
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
  const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    const result = teamStatusSchema.safeParse(req.body);

    if (!result.success) {
      context.res = {
        status: 400,
      };
      return;
    }

    await statusService.updateStatus(result.data);

    context.res = {
      status: 204,
    };
  };

  return httpTrigger;
};

// ---- Helpers ---- //

const getStatusService = () => {
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
