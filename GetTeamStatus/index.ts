import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  const statusService = inMemoryTeamStatusService([
    "Tom P",
    "Tom S",
    "Tom Z",
    "Rafael",
  ]);

  context.res = {
    headers: { "Content-Type": "application/json" },
    body: { status: statusService.getStatus() },
  };
};

interface TeamStatus {
  teamMates: TeamMateStatus[];
}

interface TeamMateStatus {
  name: string;
  isOnline: boolean;
}

interface TeamStatusService {
  getStatus: () => TeamStatus;
}

const inMemoryTeamStatusService = (teamMates: string[]): TeamStatusService => {
  const status: TeamStatus = {
    teamMates: teamMates.map((teamMate) => ({
      name: teamMate,
      isOnline: true,
    })),
  };

  const getStatus = () => status;

  return { getStatus };
};

export default httpTrigger;
