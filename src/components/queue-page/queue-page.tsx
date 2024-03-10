import React, { useEffect, useState, ChangeEvent } from "react";
import Style from "./queue-page.module.css";
import Queue from "./queue";
//ui
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
//types
import { ElementStates } from "../../types/element-states";
import { TQueue, DisableButtonState, LoadersState } from "../../types/types";
//const
import { SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";

export const QueuePage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [queue] = useState(new Queue<string>(7));
  const [elements, setElements] = useState<(TQueue | undefined)[]>(queue.elements().map((elem) => ({ elem, state: false })));
  const [headIndex, setHeadIndex] = useState<number | null>(null);
  const [tailIndex, setTailIndex] = useState<number | null>(null);
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
      deleteButton: queue.getLength() === 0,
      clearButton: queue.getLength() === 0,
    });
  }, [inputValue, elements]);

  const updateQueueVisualization = async (action: () => void, buttonType: "addButton" | "deleteButton" | "clearButton") => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, [buttonType]: true }));
    action();
    await setDelay(SHORT_DELAY_IN_MS);
    setLoaders((prevLoaders) => ({ ...prevLoaders, [buttonType]: false }));
  };

  const renderQueue = async (button: "addButton" | "deleteButton", value?: string) => {
    if (button === "addButton" && value) {
      queue.enqueue(value);
    }
    const newQueue: TQueue[] = [
      ...queue.getElements().map((elem) => ({ elem, state: false })), //мутировали массив из класса
    ];

    if (button === "addButton" && value) {
      newQueue[queue.getTail() - 1] = { ...newQueue[queue.getTail() - 1], state: true, }; //покрасили последний эл-т
    }
    else {
      newQueue[queue.getHead()] = { ...newQueue[queue.getHead()], state: true, }; //или покрасили первый эл-т
    }

    setElements(newQueue); //отрисовали
    await setDelay(SHORT_DELAY_IN_MS);
    if (button === "addButton" && value) { setInputValue(""); } //обнулили инпут если это была операция добавления эл-та
    else { queue.dequeue(); } //или запустили удаление

    if (button === "addButton" && value) {
      setElements((prevState) => prevState.map((elem) => ({ ...elem, state: false, }))); //перекрасили все обратно в неактивны
      setTailIndex(queue.isEmpty() ? null : queue.getTail() - 1);
    } else {
      const temp: TQueue[] = [...queue.getElements().map((elem) => ({ elem, state: false }))];//мутировали массив после удаления элемента
      setElements(temp);
      setTailIndex(queue.isEmpty() ? null : queue.getTail() - 1);
    }
    setHeadIndex(queue.isEmpty() ? null : queue.getHead());
  }

  return (
    <SolutionLayout title="Очередь">
      <section>
        <form className={Style.form} onSubmit={(e:React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
          <div className={Style.group}>
            <Input
              placeholder="Введите значение"
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
              onClick={async () => {
                updateQueueVisualization(() => {
                  renderQueue("addButton", inputValue);
                }, "addButton");
                setInputValue("");
              }}
              disabled={tailIndex === 6 || disableButton.addButton}
              isLoader={loaders.addButton}
              data-test="button"
            />
            <Button
              text="Удалить"
              onClick={async () => {
                updateQueueVisualization(async () => {
                  renderQueue("deleteButton");
                }, "deleteButton");
              }}
              disabled={disableButton.deleteButton}
              isLoader={loaders.deleteButton}
              data-test="button"
            />
          </div>
          <Button
            text="Очистить"
            onClick={() => {
              queue.clear();
              setElements([...queue.getElements().map((elem) => ({ elem, state: false })),]);
              setHeadIndex(null);
              setTailIndex(null);
            }}
            disabled={disableButton.clearButton}
            data-test="button"
          />
        </form>
        <ul className={Style.ul}>
          {elements.map((item, index) => (
            <li className={Style.listItem} key={index}>
              <Circle
                key={index}
                index={index}
                letter={item?.elem}
                head={headIndex === index ? "head" : ""}
                tail={tailIndex === index && !queue.isEmpty() ? "tail" : ""}
                state={item?.state ? ElementStates.Changing : ElementStates.Default}
              />
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
