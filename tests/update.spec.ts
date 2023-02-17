import { FuncCli } from "@anthonychu/azure-functions-test-utils";
import { TeamStatus } from "../shared/statusService/types";

jest.setTimeout(30000);

describe("Update", () => {
  let funcCli: FuncCli;

  beforeAll(async () => {
    const funcEnv = {
      STATUS_SERVICE_TYPE: "SHARED_IN_MEMORY",
    };

    // start Azure Functions Core Tools
    funcCli = new FuncCli();
    await funcCli.start({ port: 7071, cwd: process.cwd(), env: funcEnv });
  });

  afterAll(async () => {
    await funcCli.stop();
  });

  it("allows a user to update the statuses and then fetch the updated statuses", async () => {
    const oldResult = await funcCli.fetch("/api/teamStatus", { method: "GET" });
    const oldStatus: TeamStatus = await oldResult.json();

    // Flip a single teammates online status;
    const updatedStatus: TeamStatus = { teamMates: [...oldStatus.teamMates] };
    updatedStatus.teamMates[0] = {
      ...updatedStatus.teamMates[0],
      isOnline: !updatedStatus.teamMates[0].isOnline,
    };

    await funcCli.fetch("/api/teamStatus", {
      method: "PUT",
      body: JSON.stringify(updatedStatus),
    });

    const updatedResult = await funcCli.fetch("/api/teamStatus", {
      method: "GET",
    });
    const received: TeamStatus = await updatedResult.json();

    expect(received).toEqual(updatedStatus);
  });
});
