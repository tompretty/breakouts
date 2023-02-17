import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { FunctionProps, statusService } from "../shared/initialization";
import { teamStatusSchema } from "../shared/models/teamStatus";
import { hasAlteredListOfTeammates } from "./validation";

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

    const oldStatus = await statusService.getStatus();
    const newStatus = result.data;

    if (hasAlteredListOfTeammates(oldStatus, newStatus)) {
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

// ---- Function export ---- //

export const run = getFunction({
  statusService,
});
