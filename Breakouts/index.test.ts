import { getOnlineTeammates } from ".";
import { TeamStatus } from "../shared/statusService/types";

describe("getOnlineTeammates", () => {
  it("returns all of the online teammates", () => {
    const status: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom S", isOnline: true },
      ],
    };

    const result = getOnlineTeammates(status);

    expect(result).toEqual(["Tom P", "Tom S"]);
  });

  it("filters outs the offline teammates", () => {
    const status: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom S", isOnline: false },
      ],
    };

    const result = getOnlineTeammates(status);

    expect(result).toEqual(["Tom P"]);
  });
});
