import { getFunction } from "./index";
import { TestContext } from "@anthonychu/azure-functions-test-utils";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";

describe("GetTeamStatus", () => {
  const statusService = inMemoryTeamStatusService(["Tom P"]);
  const func = getFunction({ statusService });

  it("returns the team status", async () => {
    const context = new TestContext();

    await func(context as any, context.req);

    expect(context.res.body).toEqual({
      status: { teamMates: [{ name: "Tom P", isOnline: true }] },
    });
  });
});
