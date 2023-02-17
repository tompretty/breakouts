import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { teamStatusSchema } from "../shared/models/teamStatus";
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

  const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    if (!statusService) {
      statusService = getStatusService();
    }

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

const getStatusService: GetStatusService = () => {
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

const httpTrigger = getFunction({ getStatusService });

export default httpTrigger;
