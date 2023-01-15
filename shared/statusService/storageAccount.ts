import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { teamStatusSchema } from "../models/teamStatus";
import { GetStatus, TeamStatusService } from "./types";

export function storageAccountTeamStatusService(): TeamStatusService {
  const client = blobClient({
    url: "https://7ejjateamstatus.blob.core.windows.net",
    container: "teamstatus",
    blob: "teamstatus.json",
  });

  const getStatus: GetStatus = async () => {
    const content = await client.getContent();
    const result = teamStatusSchema.safeParse(JSON.parse(content));

    if (!result.success) {
      return { teamMates: [] };
    }

    return result.data;
  };

  return { getStatus, updateStatus: () => Promise.resolve() };
}

// ---- Helpers ---- //

interface BlobClient {
  getContent: () => Promise<string>;
}

interface BlobClientOptions {
  url: string;
  container: string;
  blob: string;
}

function blobClient({ url, container, blob }: BlobClientOptions): BlobClient {
  const blobServiceClient = new BlobServiceClient(
    url,
    new DefaultAzureCredential()
  );
  const containerClient = blobServiceClient.getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(blob);

  async function getContent(): Promise<string> {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    if (!downloadBlockBlobResponse.readableStreamBody) {
      return "";
    }

    const content = await streamToText(
      downloadBlockBlobResponse.readableStreamBody
    );

    return content;
  }

  return { getContent };
}

async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
  readable.setEncoding("utf8");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
