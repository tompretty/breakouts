import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { FunctionProps, statusService } from "../shared/initialization";
import { TeamStatus } from "../shared/statusService/types";
import { formatGroups } from "./format";
import { getGroups } from "./groups";

// ---- Function getter ---- //

export const getFunction = ({ statusService }: FunctionProps) => {
  const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
  ): Promise<void> {
    const status = await statusService.getStatus();

    const people = getOnlineTeammates(status);

    const groups = getGroups(people);

    const formattedGroups = formatGroups(groups);

    context.res = {
      status: 200,
      body: { groups, formattedGroups },
    };
  };

  return httpTrigger;
};

// ---- Function export ---- //

export const run = getFunction({ statusService });

// ---- Helpers ---- //

export function getOnlineTeammates(status: TeamStatus): string[] {
  return status.teamMates.filter((tm) => tm.isOnline).map((tm) => tm.name);
}
