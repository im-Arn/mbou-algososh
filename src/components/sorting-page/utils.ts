//types
import { ElementStates } from "../../types/element-states";
import { Direction } from "../../types/direction";
import { TNumber } from "../../types/types";
//const
import { DELAY_IN_MS, setDelay } from "../../constants/delays";
import { swapElements, } from "../../constants/const";

const compareArrayItems = (direction: Direction, firstValue: number, secondValue: number): boolean => {
    return direction === Direction.Ascending ? firstValue > secondValue : firstValue < secondValue;
  };
  
  export const bubbleSort = async (array: Array<TNumber>, direction: Direction, setArray: React.Dispatch<React.SetStateAction<Array<TNumber>>>): Promise<void> => {
    let n = array.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        array[j].state = ElementStates.Changing;
        array[j + 1].state = ElementStates.Changing;
        setArray([...array]);
        await setDelay(DELAY_IN_MS);
        if (compareArrayItems(direction, array[j].value, array[j + 1].value)) {
          swapElements(array, j, j + 1);
        }
        array[j].state = ElementStates.Default;
        array[j + 1].state = ElementStates.Default;
      }
      array[n - i - 1].state = ElementStates.Modified;
      setArray([...array]);
    }
  };
  
  export const selectionSort = async (
    array: Array<TNumber>,
    direction: Direction,
    setArray: React.Dispatch<React.SetStateAction<Array<TNumber>>>
  ): Promise<void> => {
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
      let extremeIndex = i;
      array[extremeIndex].state = ElementStates.Changing;
      for (let j = i + 1; j < n; j++) {
        array[j].state = ElementStates.Changing;
        setArray([...array]);
        await setDelay(DELAY_IN_MS);
        if (j > i + 1) array[j - 1].state = ElementStates.Default;
  
        if (compareArrayItems(direction, array[extremeIndex].value, array[j].value)) {
          array[extremeIndex].state = ElementStates.Default;
          extremeIndex = j;
          array[extremeIndex].state = ElementStates.Changing;
        }
      }
  
      if (i !== extremeIndex) {
        swapElements(array, i, extremeIndex);
      }
  
      array[i].state = ElementStates.Modified;
      if (extremeIndex !== i) array[extremeIndex].state = ElementStates.Default;
  
      array.forEach((el, idx) => {
        if (idx > i && idx !== extremeIndex) el.state = ElementStates.Default;
      });
  
      setArray([...array]);
    }
    array.forEach(el => el.state = ElementStates.Modified);
    setArray([...array]);
  };