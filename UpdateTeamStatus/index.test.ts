import { getFunction } from "./index";
import { TestContext } from "@anthonychu/azure-functions-test-utils";
import { inMemoryTeamStatusService } from "../shared/statusService/inMemory";
import { TeamStatus } from "../shared/statusService/types";

describe("UpdateTeamStatus", () => {
  const statusService = inMemoryTeamStatusService(["Tom P", "Tom S", "Tom Z"]);
  const func = getFunction({ statusService });

  it("accepts a valid body", async () => {
    const context = new TestContext();
    context.req.body = {
      teamMates: [
        {
          name: "Tom P",
          isOnline: true,
        },
        {
          name: "Tom S",
          isOnline: true,
        },
        {
          name: "Tom Z",
          isOnline: true,
        },
      ],
    };

    await func(context as any, context.req);

    expect(context.res.status).toEqual(204);
  });

  it("rejects and invalid request body", async () => {
    const context = new TestContext();
    context.req.body = {
      foo: "bar",
    };

    await func(context as any, context.req);

    expect(context.res.status).toEqual(400);
  });

  it("rejects a body that alters the list of teammates", async () => {
    const status = await statusService.getStatus();
    const updatedStatus: TeamStatus = { teamMates: status.teamMates.slice(1) };

    const context = new TestContext();
    context.req.body = updatedStatus;

    await func(context as any, context.req);

    expect(context.res.status).toEqual(400);
  });
});
