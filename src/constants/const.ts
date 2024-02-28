export const getRandomNumber = (length: number[]): number => {
  return Math.floor(Math.random() * (length[1] - length[0] + 1) + length[0]);
};

export const randomArray = (minMax: number[]): number[] => { 
  const array: number[] = [];
  const length = getRandomNumber(minMax);
  for (let i = 0; i < length; i++) {
    const numRandom = getRandomNumber([0, 100]);
    array.push(numRandom);
  }
  return array;
};
