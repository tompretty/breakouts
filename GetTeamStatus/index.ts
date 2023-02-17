import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";
import { storageAccountTeamStatusService } from "../shared/statusService/storageAccount";
import { TeamStatusService } from "../shared/statusService/types";

// ---- Types ---- //

interface FunctionProps {
  getStatusService: GetStatusService;
}

export type GetStatusService = () => TeamStatusService;

// ---- Function getter ---- //

export const getFunction = ({ getStatusService }: FunctionProps) => {
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

  return httpTrigger;
};

// ---- Helpers ---- //

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

// ---- Function export ---- //

export const run = getFunction({ getStatusService });
