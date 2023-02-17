import { TeamStatus } from "../shared/statusService/types";
import { hasAlteredListOfTeammates } from "./validation";

describe("hasAlteredListOfTeammates", () => {
  it("returns false if the lists are the same", () => {
    const status: TeamStatus = {
      teamMates: [{ name: "Tom P", isOnline: true }],
    };

    const result = hasAlteredListOfTeammates(status, status);

    expect(result).toBeFalsy();
  });

  it("returns true if a teammate has been added", () => {
    const oldStatus: TeamStatus = {
      teamMates: [{ name: "Tom P", isOnline: true }],
    };

    const newStatus: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom S", isOnline: true },
      ],
    };

    const result = hasAlteredListOfTeammates(oldStatus, newStatus);

    expect(result).toBeTruthy();
  });

  it("returns true if a teammate has been removed", () => {
    const oldStatus: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom S", isOnline: true },
      ],
    };

    const newStatus: TeamStatus = {
      teamMates: [{ name: "Tom P", isOnline: true }],
    };

    const result = hasAlteredListOfTeammates(oldStatus, newStatus);

    expect(result).toBeTruthy();
  });

  it("returns true if a teammate has been swapped", () => {
    const oldStatus: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom S", isOnline: true },
      ],
    };

    const newStatus: TeamStatus = {
      teamMates: [
        { name: "Tom P", isOnline: true },
        { name: "Tom Z", isOnline: true },
      ],
    };

    const result = hasAlteredListOfTeammates(oldStatus, newStatus);

    expect(result).toBeTruthy();
  });
});
