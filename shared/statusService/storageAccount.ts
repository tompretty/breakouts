import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { teamStatusSchema } from "../models/teamStatus";
import { GetStatus, TeamStatus, TeamStatusService } from "./types";

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

  async function updateStatus(status: TeamStatus): Promise<void> {
    await client.updateContent(JSON.stringify(status));
  }

  return { getStatus, updateStatus };
}

// ---- Helpers ---- //

interface BlobClient {
  getContent: () => Promise<string>;
  updateContent: (content: string) => Promise<void>;
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

  async function updateContent(content: string): Promise<void> {
    await blockBlobClient.upload(content, content.length);
  }

  return { getContent, updateContent };
}

async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
  readable.setEncoding("utf8");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
