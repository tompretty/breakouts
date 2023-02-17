import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { FunctionProps, statusService } from "../shared/initialization";

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

// ---- Function export ---- //

export const run = getFunction({
  statusService,
});
