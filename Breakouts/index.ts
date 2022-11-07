import { AzureFunction, Context, HttpRequest } from "@azure/functions";

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
  "Rafael",
  "Andrew",
  "Ollie",
  "Jeet",
  "Matthew",
  "Nick",
  "Mihai",
];

function getGroups(people: string[]) {
  return batch(shuffle(people));
}

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function batch<T>(array: T[]): T[][] {
  const batches = [];

  array.forEach((item, index) => {
    if (index % 2 === 0) {
      batches.push([]);
    }

    batches[Math.floor(index / 2)].push(item);
  });

  return batches;
}

function formatGroups(groups: string[][]): string {
  return `<ul>${groups.map(formatGroup).join("")}</ul>`;
}

function formatGroup(group: string[]): string {
  return `<li>${group.join(" and ")}</li>`;
}

export default httpTrigger;
