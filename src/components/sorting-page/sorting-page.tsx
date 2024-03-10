import React, { ChangeEvent, useState } from "react";
import Style from "./sorting-page.module.css";
//ui
import { RadioInput } from "../ui/radio-input/radio-input";
import { Column } from "../ui/column/column";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
//types
import { ElementStates } from "../../types/element-states";
import { Direction } from "../../types/direction";
import { TNumber } from "../../types/types";
//const
import { randomSortingArray, swapElements, SortingType } from "../../constants/const";
//FUNC
import { bubbleSort, selectionSort } from './utils';

export const SortingPage: React.FC = () => {
  const [array, setArray] = useState<Array<TNumber>>(randomSortingArray(3, 17, 100));
  const [sortingType, setSortingType] = useState<SortingType>(SortingType.Bubble);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const startAndDefineSorting = async (direction: Direction) => {
    setActiveButton(direction);
    setLoading(true);
    if (sortingType === SortingType.Bubble) {
      await bubbleSort([...array], direction, setArray);
    } else if (sortingType === SortingType.Selection) {
      await selectionSort([...array], direction, setArray);
    }
    setLoading(false);
  };


  return (
    <SolutionLayout title="Сортировка массива">
      <section>
        <form className={Style.form}>
          <div className={Style.radioInputs}>
            <RadioInput
              label="Выбор"
              value={"Выбор"}
              checked={sortingType === SortingType.Selection}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSortingType(SortingType.Selection)}
            />
            <RadioInput
              label="Пузырёк"
              value={"Пузырёк"}
              checked={sortingType === SortingType.Bubble}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSortingType(SortingType.Bubble)}
            />
          </div>
          <div className={Style.buttons}>
            <Button
              text="По возрастанию"
              type="button"
              sorting={Direction.Ascending}
              onClick={() => startAndDefineSorting(Direction.Ascending)}
              isLoader={activeButton === Direction.Ascending && isLoading}
              disabled={isLoading && activeButton !== Direction.Ascending}
            />
            <Button
              text="По убыванию"
              type="button"
              sorting={Direction.Descending}
              onClick={() => startAndDefineSorting(Direction.Descending)}
              isLoader={activeButton === Direction.Descending && isLoading}
              disabled={isLoading && activeButton !== Direction.Descending}
            />
          </div>
          <Button
            text="Новый массив"
            type="button"
            style={{ width: 205 }}
            onClick={() => {
              setActiveButton('newArray');
              setArray(randomSortingArray(3, 17, 100));
            }}
            isLoader={activeButton === 'newArray' && isLoading}
            disabled={isLoading && activeButton !== 'newArray'}
          />
        </form>
        <ul className={Style.ul}>
          {array.map((num, index) => (
            <li className={Style.listItem} key={index}>
              <Column
                index={num.value}
                key={index}
                state={num.state}
              />
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};