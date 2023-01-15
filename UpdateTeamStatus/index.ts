import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { teamStatusSchema } from "../shared/models/teamStatus";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  context.log({ body: req.body });

  const result = teamStatusSchema.safeParse(req.body);

  if (!result.success) {
    context.log("INVALID");
    context.res = {
      status: 400,
      body: "foo",
    };
    return;
  }

  context.log("VALID", { data: result.data });
  context.res = {
    status: 200,
    body: "foo",
  };
};

export default httpTrigger;
