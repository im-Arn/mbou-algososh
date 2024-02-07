import React, { ChangeEvent, useState, useEffect, FormEventHandler } from "react";
import Style from "./string.module.css";
//ui
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
//types
import { ElementStates } from "../../types/element-states";
import { TChar } from "../../types/types";
//const
import { DELAY_IN_MS, SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";

export const StringComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [string, setString] = useState<Array<TChar> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reverseInput = async (input: Array<TChar> | null) => {
    if (input !== null) {
      const array = input;
      let lastIndex = input.length - 1;
      for (let i = 0; i < array.length / 2; i++) {
        const temp: TChar = array[i];
        array[i] = { ...array[i], state: "loading" };// сначала красим кружки
        array[lastIndex] = { ...array[lastIndex], state: "loading" };
        setString([...array]);
        await setDelay(SHORT_DELAY_IN_MS);
        array[i] = { ...array[lastIndex], state: "load" }; // затем сортируем
        array[lastIndex] = { ...temp, state: "load" };
        setString([...array]);
        await setDelay(DELAY_IN_MS);
        lastIndex--;
      }
    }
  };

  const submitHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await reverseInput(string);
    setLoading(false);
  };

  useEffect(() => {
    const wordInput = inputValue.split("").map((char) => ({ char, state: undefined }));
    setString(wordInput);
  }, [inputValue]);

  return (
    <SolutionLayout title="Строка">
      <section className={Style.section}>
        <form className={Style.form} onSubmit={submitHandler}>
          <Input
            maxLength={11}
            isLimitText={true}
            value={inputValue}
            name="input"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
          />
          <Button
            text="Развернуть"
            type="submit"
            isLoader={loading}
            disabled={inputValue === ""}
          />
        </form>
        <ul className={Style.ul}>
          {string &&
            string.map((letter, index) => (
              <li className={Style.listItem} key={index}>
                <Circle
                  letter={letter.char}
                  key={index}
                  state={(letter.state === "loading") ? ElementStates.Changing : (letter.state === "load") ? ElementStates.Modified : ElementStates.Default}
                />
              </li>
            ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
