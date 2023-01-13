import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { z } from "zod";

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

interface TeamStatus {
  teamMates: TeamMateStatus[];
}

interface TeamMateStatus {
  name: string;
  isOnline: boolean;
}

const teamMateStatusSchema = z.object({
  name: z.string(),
  isOnline: z.boolean(),
});

const teamStatusSchema = z.object({
  teamMates: z.array(teamMateStatusSchema),
});

interface TeamStatusService {
  getStatus: () => Promise<TeamStatus>;
}

type GetStatus = () => Promise<TeamStatus>;

const inMemoryTeamStatusService = (teamMates: string[]): TeamStatusService => {
  const status: TeamStatus = {
    teamMates: teamMates.map((teamMate) => ({
      name: teamMate,
      isOnline: true,
    })),
  };

  const getStatus: GetStatus = () => Promise.resolve(status);

  return { getStatus };
};

const streamToText = async (
  readable: NodeJS.ReadableStream
): Promise<string> => {
  readable.setEncoding("utf8");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
};

const storageAccountTeamStatusService = (): TeamStatusService => {
  const blobServiceClient = new BlobServiceClient(
    "https://7ejjateamstatus.blob.core.windows.net",
    new DefaultAzureCredential()
  );

  const containerName = "teamstatus";
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = "teamstatus.json";
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const getStatus: GetStatus = async () => {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    if (!downloadBlockBlobResponse.readableStreamBody) {
      return { teamMates: [] };
    }

    const textContent = await streamToText(
      downloadBlockBlobResponse.readableStreamBody
    );

    const result = teamStatusSchema.safeParse(JSON.parse(textContent));

    if (!result.success) {
      return { teamMates: [] };
    }

    return result.data;
  };

  return { getStatus };
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
