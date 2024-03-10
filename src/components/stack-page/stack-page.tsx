import React, { useEffect, useState, ChangeEvent } from "react";
import Style from "./stack-page.module.css";
import Stack from "./stack";
//ui
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
//types
import { ElementStates } from "../../types/element-states";
import { TStack, DisableButtonState, LoadersState } from "../../types/types";
//const
import { SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";

export const StackPage: React.FC = () => {
  const [stack] = useState(new Stack<string>());
  const [stackElements, setStackElement] = useState<TStack[]>(
    stack.elements.map((elem) => ({ elem, state: false }))
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [disableButton, setDisableButton] = useState<DisableButtonState>({
    addButton: true,
    deleteButton: true,
    clearButton: true,
  });
  const [loaders, setLoaders] = useState<LoadersState>({
    addButton: false,
    deleteButton: false,
    clearButton: false,
  });

  useEffect(() => {
    setDisableButton({
      addButton: inputValue.trim().length === 0,
      deleteButton: stackElements.length === 0,
      clearButton: stackElements.length === 0,
    });
  }, [inputValue, stackElements]);

  const handleButtonClick = async (buttonType: "deleteButton" | "clearButton" | "addButton") => {
    const loadersCopy = { ...loaders };
    loadersCopy[buttonType] = true;
    setLoaders(loadersCopy);

    if (buttonType === "addButton") {
      stack.push(inputValue);
      const newStackElements: TStack[] = stack.elements.map((elem, index) => ({
        elem,
        state: index === stack.elements.length - 1,
      }));
      setStackElement(newStackElements);
      await setDelay(SHORT_DELAY_IN_MS);
      setStackElement((prevNumbers) =>
        prevNumbers.map((element) => ({ ...element, state: false }))
      );


    } else if (buttonType === "deleteButton") {
      setStackElement((prevNumbers) =>
        prevNumbers.map((elem, index) => ({ ...elem, state: index === prevNumbers.length - 1 }))
      );
      await setDelay(SHORT_DELAY_IN_MS);
      stack.pop();
      const newStackElements: TStack[] = stack.elements.map((elem) => ({
        elem,
        state: false,
      }));
      setStackElement(newStackElements);

    } else if (buttonType === "clearButton") {
      stack.clear();
      const newStackElements: TStack[] = stack.elements.map((elem, index) => ({
        elem,
        state: index === stack.elements.length - 1,
      }));
      setStackElement(newStackElements);
    }


    // const newStackElements: TStack[] = stack.elements.map((elem, index) => ({
    //   elem,
    //   state: index === stack.elements.length - 1,
    // }));
    // setStackElement(newStackElements);
    // await setDelay(SHORT_DELAY_IN_MS);
    // setStackElement((prevNumbers) =>
    //   prevNumbers.map((element) => ({ ...element, state: false }))
    // );

    setInputValue("");

    const loadersCopyAfterAnimation = { ...loaders };
    loadersCopyAfterAnimation[buttonType] = false;
    setLoaders(loadersCopyAfterAnimation);
  };

  return (
    <SolutionLayout title="Стек">
      <section>
        <form className={Style.form} onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
          <div className={Style.container}>
            <Input
              maxLength={4}
              isLimitText={true}
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value);
              }}
            />
            <Button
              text="Добавить"
              type="submit"
              onClick={() => handleButtonClick("addButton")}
              disabled={disableButton.addButton}
              isLoader={loaders.addButton}
              data-test="button"
            />
            <Button
              text="Удалить"
              onClick={() => handleButtonClick("deleteButton")}
              disabled={disableButton.deleteButton}
              isLoader={loaders.deleteButton}
              data-test="button"
            />
          </div>
          <Button
            text="Очистить"
            onClick={() => handleButtonClick("clearButton")}
            disabled={disableButton.clearButton}
            data-test="button"
          />
        </form>
        <ul className={Style.ul}>
          {stackElements.map(({ elem, state }, index) => (
            <li className={Style.listItem} key={index}>
              <Circle
                key={index}
                letter={elem}
                head={index === stackElements.length - 1 ? "top" : ""}
                index={index}
                state={state ? ElementStates.Changing : ElementStates.Default}
              />
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
