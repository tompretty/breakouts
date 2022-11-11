
export function formatGroups(groups: string[][]): string {
  return `<ul>${groups.map(formatGroup).join("")}</ul>`;
}

function formatGroup(group: string[]): string {
  return `<li>${group.join(" and ")}</li>`;
}
