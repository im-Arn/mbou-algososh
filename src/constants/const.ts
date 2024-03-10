import { TNumber } from "../types/types";
import { ElementStates } from "../types/element-states";

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

export const randomSortingArray = (minLen: number, maxLen: number, maxValue: number): Array<TNumber> => {
  return Array.from({ length: Math.floor(Math.random() * (maxLen - minLen + 1) + minLen) }, () => ({
    value: Math.floor(Math.random() * (maxValue + 1)),
    state: ElementStates.Default,
  }));
};

export const swapElements = (array: Array<TNumber>, firstIndex: number, secondIndex: number): void => {
  [array[firstIndex], array[secondIndex]] = [array[secondIndex], array[firstIndex]];
};

export enum SortingType {
  Selection = "SELECTION",
  Bubble = "BUBBLE",
}
