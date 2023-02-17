import { getFunction, GetStatusService } from "./index";
import { TestContext } from "@anthonychu/azure-functions-test-utils";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";

describe("GetTeamStatus", () => {
  const getStatusService: GetStatusService = () =>
    inMemoryTeamStatusService(["Tom P"]);

  const func = getFunction({ getStatusService });

  it("returns the team status", async () => {
    const context = new TestContext();

    await func(context as any, context.req);

    expect(context.res.body).toEqual({
      status: { teamMates: [{ name: "Tom P", isOnline: true }] },
    });
  });
});