import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { formatGroups } from "./format";
import { getGroups } from "./groups";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const groups = getGroups(PEOPLE);

  const formattedGroups = formatGroups(groups);

  context.res = {
    status: 200,
    body: { groups, formattedGroups },
  };
};

const PEOPLE = [
  "Tom P",
  "Tom Z",
  "Tom S",
  // "Rafael",
  "Andrew",
  "Ollie",
  "Jeet",
  "Matthew",
  "Nick",
  "Mihai",
];

export default httpTrigger;
