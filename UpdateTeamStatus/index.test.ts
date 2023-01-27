import func from "./index";
import { TestContext } from "@anthonychu/azure-functions-test-utils";

describe("UpdateTeamStatus", () => {
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
});
