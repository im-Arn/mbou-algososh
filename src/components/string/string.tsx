import React, { ChangeEvent, useState, useEffect, FormEventHandler } from "react";
import Style from "./string.module.css";
//ui
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
//types
import { TChar } from "../../types/types";
//FUNC
import { reverseInput } from "./utils";

export const StringComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [string, setString] = useState<Array<TChar> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await reverseInput(string, setString);
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
            data-test="submit"
          />
        </form>
        <ul className={Style.ul}>
          {string &&
            string.map((letter, index) => (
              <li className={Style.listItem} key={index}>
                <Circle
                  letter={letter.char}
                  key={index}
                  state={letter.state}
                />
              </li>
            ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
