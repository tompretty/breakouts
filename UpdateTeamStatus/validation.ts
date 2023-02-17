import { TeamStatus } from "../shared/statusService/types";

export function hasAlteredListOfTeammates(
  oldStatus: TeamStatus,
  newStatus: TeamStatus
): boolean {
  const oldNames = oldStatus.teamMates.map(getName);
  const newNames = newStatus.teamMates.map(getName);

  // First check if the arrays aren't the same size
  if (oldNames.length !== newNames.length) {
    return true;
  }

  // If they are then we need to check that they contain the same values
  const set = new Set(oldNames);
  newNames.forEach((n) => set.add(n));

  return oldNames.length !== set.size;
}

// ---- Helpers ---- //

const getName = ({ name }: { name: string }) => name;
