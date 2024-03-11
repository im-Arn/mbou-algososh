//FUNC
import { bubbleSort, selectionSort } from './utils';
//const
import { ElementStates } from '../../types/element-states';
import { Direction } from "../../types/direction";
//types
import { TNumber } from '../../types/types';


describe('Sorting Algorithms', () => {
  const createArray = (numbers: number[]): TNumber[] =>
    numbers.map(value => ({ value, state: ElementStates.Default }));

  const mockSetArrayForRender = jest.fn();

  beforeEach(() => {
    mockSetArrayForRender.mockClear();
  });

  const runSort = (sortFunc: typeof bubbleSort | typeof selectionSort, method: string) => {
    describe(`${method} Sort`, () => {
      it.each([
        { direction: Direction.Ascending, array: [], sorted: [] },
        { direction: Direction.Ascending, array: [1], sorted: [1], state: ElementStates.Modified },
        { direction: Direction.Ascending, array: [5, 1, 8], sorted: [1, 5, 8], state: ElementStates.Modified },
        { direction: Direction.Descending, array: [1], sorted: [1], state: ElementStates.Modified },
        { direction: Direction.Descending, array: [1, 5, 8], sorted: [8, 5, 1], state: ElementStates.Modified }
      ])('correctly sorts an array with %s', async ({ direction, array, sorted, state }) => {
        const arraySorting = createArray(array);
        await sortFunc(arraySorting, direction, mockSetArrayForRender);

        const sortedArray = arraySorting.map(el => el.value);
        expect(sortedArray).toEqual(sorted);
        if (array.length > 0) {
          expect(arraySorting[0].state).toEqual(state);
        }
      });
    });
  };

  runSort(bubbleSort, 'Bubble');
  runSort(selectionSort, 'Selection');
});