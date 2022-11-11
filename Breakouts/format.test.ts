import { formatGroups } from "./format";

describe("formatGroups", () => {
	it("formats the groups as a <ul> containing <li>s", () => {
		const groups = [["a", "b"], ["c", "d"]];

		const formatted = formatGroups(groups);

		expect(formatted).toEqual("<ul><li>a and b</li><li>c and d</li></ul>");
	})
})