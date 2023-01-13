export function getGroups<T>(array: T[]): T[][] {
  return batch(shuffle(array));
}

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function batch<T>(array: T[]): T[][] {
  const batches: T[][] = [];

	array.slice(0, -1).forEach((x, index) => {
		if (index % 2 === 0) {
			batches.push([]);
		}

		batches[batches.length -1].push(x);
	})

	batches[batches.length - 1].push(array[array.length -1]);

  return batches;
}
