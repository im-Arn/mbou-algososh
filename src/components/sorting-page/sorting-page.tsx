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
import { DELAY_IN_MS, SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";
import { randomArray } from "../../constants/const";

export const SortingPage: React.FC = () => {
  const minMax: number [] = [3, 17]; //задаём допустимую длину массива
  const [loader, setLoader] = useState<"ascending" | "descending" | "">("");
  const [radioValue, setRadioValue] = useState<string>(''); //следим за значением радио
  const [array, setArray] = useState<Array<TNumber>>(randomArray(minMax).map((num) => ({
    num,
    state: undefined,
  })));

  const createArray = () => {
    setArray(
      randomArray(minMax).map((num) => ({
        num,
        state: undefined,
      }))
    );
  };

  const swapOrSetState = async (swapState: "swap" | "noSwap" | "solo" | "radio", //моё милое чудовище <3
  stateData: "loading" | "load" | undefined , delay: number, array: Array<TNumber>, index1: number, index2?: number, ) => {
    if (swapState === "swap" && index2 ) {
      const temp: TNumber = array[index1];
      array[index1] = { ...array[index2], state: stateData };
      array[index2] = { ...temp, state: stateData };
      setArray([...array]);
      await setDelay(delay);
    }
    if (swapState === "noSwap"  && index2) {
      array[index1] = { ...array[index1], state: stateData };
      array[index2] = { ...array[index2], state: stateData };
      setArray([...array]);
      await setDelay(delay);
    }
    if (swapState === "radio") {
      array[index1] = { ...array[index1], state: stateData };
      setArray([...array]);
      await setDelay(delay);
      array[index1] = { ...array[index1], state: undefined };
      setArray([...array]);
    }
    else {
      array[index1] = { ...array[index1], state: stateData };
      setArray([...array]);
    }
  };
  
  //сортировка пузырьком -------------------------
  const bubbleSort = async (array: Array<TNumber>, direction: Direction) => {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        await swapOrSetState("noSwap", "loading", SHORT_DELAY_IN_MS, array, j, j + 1);
        await swapOrSetState("noSwap", undefined, SHORT_DELAY_IN_MS, array, j, j + 1);
        if (
          (direction === Direction.Ascending && array[j].num > array[j + 1].num) || //определяем направление сортировки
          (direction === Direction.Descending && array[j].num < array[j + 1].num)
        ) {

          await swapOrSetState("swap", undefined, SHORT_DELAY_IN_MS, array, j, j + 1);
          // await swapOrSetState("noSwap", undefined, array, j, j + 1);
        }
      }
      await swapOrSetState("solo", "load", SHORT_DELAY_IN_MS, array, array.length - i - 1 );
    }
  };
  //сортировка выбором ---------------------------
  const selectSort = async (array: Array<TNumber>, direction: Direction) => {
    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      await swapOrSetState("solo", "loading", SHORT_DELAY_IN_MS, array, i, i);//красим первого участника сортировки
      await setDelay(DELAY_IN_MS);
      for (let j = i + 1; j < array.length; j++) {
        await swapOrSetState("radio", "loading", DELAY_IN_MS, array, j, j);//красим второго участника сортировки
        if (
          (direction === Direction.Ascending && array[minIndex].num > array[j].num) || //определяем направление сортировки
          (direction === Direction.Descending && array[minIndex].num < array[j].num)
        ) {
          minIndex = j;
        }

      }
      await swapOrSetState("swap", undefined, SHORT_DELAY_IN_MS, array, i, minIndex); //сортируем, сбрасываем окраску
      await swapOrSetState("solo", "load", SHORT_DELAY_IN_MS, array, i, array.length); //красим отсортированный элемент
    }
    await swapOrSetState("solo", "load", SHORT_DELAY_IN_MS, array, array.length - 1, array.length - 1);
  };

  //инициализация сортировки ---------------------------
  const startAndDefineSorting = async (direction: Direction) => {
    setLoader(direction);
    if (radioValue === "select") {
      await selectSort(array, direction);

    } else {
      await  bubbleSort(array, direction);
    }
    setLoader("");
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <section>
        <form className={Style.form}>
          <div className={Style.radioInputs}>
            <RadioInput
              label="Выбор"
              value={"Выбор"}
              name="sorting"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRadioValue("select")
              }
            />
            <RadioInput
              label="Пузырёк"
              value={"Пузырёк"}
              name="sorting"
              defaultChecked
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRadioValue("bubble")
              }
            />
          </div>
          <div className={Style.buttons}>
            <Button
              text="По возрастанию"
              sorting={Direction.Ascending}
              style={{ width: 205 }}
              onClick={() => {
                startAndDefineSorting(Direction.Ascending);
              }}
              disabled={loader !== ""}
              isLoader={loader === 'ascending'}
            />
            <Button
              text="По убыванию"
              sorting={Direction.Descending}
              style={{ width: 205 }}
              onClick={() => {
                startAndDefineSorting(Direction.Descending);
              }}
              disabled={loader !== ""}
              isLoader={loader === 'descending'}
            />
          </div>
          <Button
            text="Новый массив"
            style={{ width: 205 }}
            onClick={createArray}
            disabled={loader !== ""}
          />
        </form>
        <ul className={Style.ul}>
          {array.map((num, index) => (
            <li className={Style.listItem} key={index}>
              <Column
                index={num.num}
                key={index}
                state={(num.state === "loading") ? ElementStates.Changing : (num.state === "load") ? ElementStates.Modified : ElementStates.Default}
              />
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout >
  );
};

  // const bubbleSort = async (array: Array<TNumber>, direction: Direction) => {
  //   for (let i = 0; i < array.length; i++) {
  //     for (let j = 0; j < array.length - i - 1; j++) {
  //       if (
  //         (direction === Direction.Ascending && array[j].num > array[j + 1].num) || //определяем направление сортировки
  //         (direction === Direction.Descending && array[j].num < array[j + 1].num)
  //       ) {
  //         const temp: TNumber = array[j];
  //         array[j] = { ...array[j], state: "loading" };// сначала красим
  //         array[j + 1] = { ...array[j + 1], state: "loading" };
  //         setArray([...array]);
  //         await setDelay(SHORT_DELAY_IN_MS);
  //         array[j] = { ...array[j + 1], state: undefined }; // затем сортируем
  //         array[j + 1] = { ...temp, state: undefined };
  //         setArray([...array]);
  //         await setDelay(DELAY_IN_MS);
  //       }
  //     }
  //     array[array.length - i - 1] = { ...array[array.length - i - 1], state: "load" };// если обнаружено уже отсортированное, красим 
  //     array[0] = { ...array[0], state: "load" };
  //     setArray([...array]);
  //   }
  // }
