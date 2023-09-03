export const chunkArray = <T> (arr: T[], chunkSize: number) => {
  const chunk: T[][] = [];
  let group: T[] = [];
  for (let i = 0, l = arr.length; i < l; i++) {
    if (i % chunkSize === 0) {
      group = [];
      chunk.push(group);
    }
    group.push(arr[i]);
  }
  return chunk;
};
