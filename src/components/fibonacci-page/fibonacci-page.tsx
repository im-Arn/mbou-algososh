import React, { ChangeEvent, useState, FormEventHandler } from "react";
import Style from "./fibonacci-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { DELAY_IN_MS, setDelay } from "../../constants/delays";

export const FibonacciPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fibonacciSeq, setFibonacciSeq] = useState<number[]>([]);

  //функция вычисления чисел
  const calculateNum = (num: number): number => {
    if (num <= 1) {
      return 1;
    }
    return calculateNum(num - 1) + calculateNum(num - 2);
  };
  //функция отрисовки чисел
  const render = async (value: number | undefined) => {
    setFibonacciSeq([]);
    for (let currentIndex = 0; value && currentIndex <= value; currentIndex++) {
      const numberFib = calculateNum(currentIndex);
      setFibonacciSeq((prevNumbers) => [...prevNumbers, numberFib]);
      await setDelay(DELAY_IN_MS);
    }
  }

  const submitHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await render(inputValue);
    setLoading(false);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section>
        <form className={Style.form} onSubmit={submitHandler}>
            <Input
              type="number"
              isLimitText={true}
              style={{ width: 377, height: 60}}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(parseInt(e.target.value))
              }
              maxLength={2}
              max={19}
              min={1}
              value={inputValue === 0 ? "" : inputValue}
            />
          <Button
            text="Рассчитать"
            style={{ width: 300 }}
            type="submit"
            isLoader={loading}
            disabled={!inputValue || inputValue > 19}
          />
        </form>
        <ul className={Style.ul}>
          {fibonacciSeq.map((num, index) => (
            <li className={Style.listItem} key={index}>
              <Circle letter={num.toString()} key={index} index={index}/>
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
