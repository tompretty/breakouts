import { getGroups } from "./groups"

describe("getGroups", () => {
	it("groups an even length array into groups two", () => {
		const groups = getGroups(["a", "b", "c", "d"]);

		expect(groups.length).toBe(2);
		expect(groups[0].length).toBe(2);
		expect(groups[1].length).toBe(2);
	})

	it("groups the final group into 3 for and odd length array", () => {
		const groups = getGroups(["a", "b", "c", "d", "e"]);

		expect(groups.length).toBe(2);
		expect(groups[0].length).toBe(2);
		expect(groups[1].length).toBe(3);
	})
})