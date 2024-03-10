import React, { useState, useEffect } from "react";
import Style from "./list-page.module.css";
import { LinkedList } from "./list";
//ui
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { ArrowIcon } from "../ui/icons/arrow-icon";
//types
import { ElementStates } from "../../types/element-states";
//const
import { SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";
import { randomArray } from "../../constants/const";
import { LoadersStateList, DisableButtonStateList, TListElement } from "../../types/types";

export const ListPage: React.FC = () => {
  const initialList = randomArray([4, 6, 100]).map((item): TListElement => ({
    value: String(item),
    loading: false,
    load: false,
    upperCircle: false,
    bottomCircle: false,
  }));

  const [list, setList] = useState(new LinkedList<TListElement>(initialList));
  const [inputValue, setInputValue] = useState<string>("");
  const [indexValue, setIndexValue] = useState<string>("");
  const [disableButton, setDisableButton] = useState<DisableButtonStateList>({
    addButton: true,
    indexButton: true,
    deleteButton: true,
  });
  const [loaders, setLoaders] = useState<LoadersStateList>({
    addHead: false,
    removeHead: false,
    addTail: false,
    removeTail: false,
    addIndex: false,
    removeIndex: false,
  });

  const updateArrayMap = (newList: LinkedList<TListElement>, updates: { [key: string]: boolean }) => {
    const updatedListArray = new LinkedList<TListElement>(//создает и возвращает обновленный связный список
      newList.toArray().map((el) => ({
        ...el,
        ...updates,
      }))
    );
    return updatedListArray;
  };

  const deleteHead = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeHead: true }));
    list.getFirstNode()?.value && (list.getFirstNode()!.value.bottomCircle = true); //добавляем первому эл-ту кружочек
    await setDelay(SHORT_DELAY_IN_MS);
    list.deleteHead();
    setList(updateArrayMap(list, { bottomCircle: false }));
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeHead: false }));
  };

  const deleteTail = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeTail: true }));
    list.getLastNode()?.value && (list.getLastNode()!.value.bottomCircle = true); //добавляем последнему эл-ту кружочек
    await setDelay(SHORT_DELAY_IN_MS);
    list.deleteTail();
    setList(updateArrayMap(list, { bottomCircle: false }));
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeTail: false }));
  };

  const addHead = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, addHead: true }));
    // setAddToHeadLoader(true);
    const newList = new LinkedList<TListElement>(); //создаём нофый экземпляр LinkedList
    const firstNode = list.getFirstNode();
    // firstNode?.value && (firstNode.value.upperCircle = true);
    if (firstNode) { firstNode.value.upperCircle = true; }//добавляем первому эл-ту кружочек
    await setDelay(SHORT_DELAY_IN_MS);
    newList.prepend({ // + новый элемент в начало списка
      value: inputValue,
      loading: false,
      load: true,
      upperCircle: false,
      bottomCircle: false,
    });
    const currentArray = list.toArray(); //созд массив, из текущего состояния list
    for (const item of currentArray) { //циклом пробегаем и сбрасываем кружочек.
      newList.append(item);
      item.upperCircle = false;
    }
    setInputValue("");
    await setDelay(SHORT_DELAY_IN_MS);
    setList(newList);
    await setDelay(SHORT_DELAY_IN_MS);
    setList(prevList => //завершаем анимацию сбрасывая состояние элемента
      new LinkedList<TListElement>(prevList.toArray().map(el => ({
        ...el,
        loading: false,
        load: false
      }))));
    setLoaders((prevLoaders) => ({ ...prevLoaders, addHead: false }));
  };

  const addTail = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, addTail: true }));
    const newList = new LinkedList<TListElement>(list.toArray());
    newList.getLastNode()?.value && (newList.getLastNode()!.value.upperCircle = true); //накидываем кружочек последнему эл-ту
    await setDelay(SHORT_DELAY_IN_MS);
    const newListWithAddedItem = new LinkedList<TListElement>(); //новый пустой список для хранения изменённых элементов
    const currentArray = newList.toArray();//преобразуем текущий список в массив
    for (const item of currentArray) { //циклом по массиву, выключаем кружочки и записываем в новый список 
      newListWithAddedItem.append(item);
      item.upperCircle = false;
    }
    newListWithAddedItem.append({ // + новый элем в конец списка
      value: inputValue,
      loading: false,
      load: true,
      upperCircle: false,
      bottomCircle: false,
    });
    setInputValue("");
    await setDelay(SHORT_DELAY_IN_MS);
    setList(newListWithAddedItem);
    await setDelay(SHORT_DELAY_IN_MS);
    setList((prevList: LinkedList<TListElement>) => { //завершаем анимацию сбрасывая состояние элемента
      return updateArrayMap(prevList, { loading: false, load: false, });
    });
    setLoaders((prevLoaders) => ({ ...prevLoaders, addTail: false }));
  };

  const addByIndex = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, addIndex: true }));
    const index = parseInt(indexValue);
    const newList = new LinkedList<TListElement>(list.toArray());
    for (let i = 0; i <= index; i++) {
      setList((prevList: LinkedList<TListElement>) => {
        const newList = new LinkedList<TListElement>(prevList.toArray());
        const currentNode = newList.getNodeByIndex(i);
        const lastNode = newList.getNodeByIndex(i - 1);
        if (currentNode) {
          currentNode.value = {
            ...currentNode.value,
            upperCircle: true,
          };
        }
        if (lastNode) {
          lastNode.value = {
            ...lastNode.value,
            loading: true,
            upperCircle: false,
          };
        }
        return newList;
      });
      await setDelay(700);
    }
    if (!isNaN(index)) {
      newList.addByIndex(
        {
          value: inputValue,
          loading: false,
          load: true,
          upperCircle: false,
          bottomCircle: false,
        },
        index
      );
      setInputValue("");
      setIndexValue("");
    }
    setList(updateArrayMap(newList, { loading: false, upperCircle: false, }));
    await setDelay(SHORT_DELAY_IN_MS);
    setList((prevList: LinkedList<TListElement>) => {
      const addedElement = prevList.getNodeByIndex(index);
      if (addedElement) addedElement.value.load = false;
      return prevList;
    });
    setLoaders((prevLoaders) => ({ ...prevLoaders, addIndex: false }));
  };

  const deleteByIndex = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeIndex: true }));
    const index = parseInt(indexValue);
    const setLoadingState = (list: LinkedList<TListElement>, i: number, loading: boolean) => {
      const newList = new LinkedList<TListElement>(list.toArray());
      const currentNode = newList.getNodeByIndex(i);
      currentNode?.value && (currentNode.value.loading = loading);
      return newList;
    };
    for (let i = 0; i < index; i++) {
      setList((prevList) => {
        const updatedList = setLoadingState(prevList, i, true);
        return updatedList;
      });
      await setDelay(SHORT_DELAY_IN_MS);
    }
    setList((prevList) => {
      const updatedList = setLoadingState(prevList, index, true);
      return updatedList;
    });
    await setDelay(SHORT_DELAY_IN_MS);
    setList((prevList) => {
      const updatedList = setLoadingState(prevList, index, false);
      const currentNode = updatedList.getNodeByIndex(index);
      currentNode?.value && (currentNode.value.bottomCircle = true);
      return updatedList;
    });
    await setDelay(SHORT_DELAY_IN_MS);
    if (!isNaN(index)) {
      setList((prevList) => {
        const newList = new LinkedList<TListElement>(prevList.toArray());
        newList.deleteByIndex(index);
        setIndexValue("");
        return newList;
      });
    }
    setList((prevList) => updateArrayMap(prevList, { loading: false }));
    setLoaders((prevLoaders) => ({ ...prevLoaders, removeIndex: false }));
  };


  useEffect(() => {
    const input = inputValue.trim().length === 0;
    setDisableButton((prevLoaders) => ({ ...prevLoaders, addButton: (input) }));
    const arrayLength = list.toArray().length;
    const validation = parseInt(indexValue) >= 0 && parseInt(indexValue) <= arrayLength - 1;
    setDisableButton((prevLoaders) => ({ ...prevLoaders, indexButton: (!validation || input) }));
    setDisableButton((prevLoaders) => ({ ...prevLoaders, deleteButton: (arrayLength !== 0 && !validation) }));
  }, [inputValue, indexValue, list]);

  return (
    <SolutionLayout title="Связный список">
      <section>
        <form>
          <div className={Style.form1}>
            <Input
              placeholder="Введите значение"
              style={{ width: 205, height: 60 }}
              maxLength={4}
              isLimitText={true}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value);
              }}
              data-test="input"
            />
            <Button
              text="Добавить в head"
              linkedList="small"
              onClick={addHead}
              disabled={disableButton.addButton}
              isLoader={loaders.addHead}
              data-test="button"
            />
            <Button
              text="Добавить в tail"
              linkedList="small"
              onClick={addTail}
              disabled={disableButton.addButton}
              isLoader={loaders.addTail}
              data-test="button"
            />
            <Button
              text="Удалить из head"
              linkedList="small"
              onClick={deleteHead}
              disabled={!(list.toArray().length > 0)}
              isLoader={loaders.removeHead}
            />
            <Button
              text="Удалить из tail"
              linkedList="small"
              onClick={deleteTail}
              disabled={!(list.toArray().length > 0)}
              isLoader={loaders.removeTail}
            />
          </div>
          <div className={Style.form2}>
            <Input
              placeholder="Введите индекс"
              style={{ width: 205, height: 60 }}
              value={indexValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setIndexValue(e.target.value);
              }}
              type="number"
              min={0}
              max={list.toArray().length}
              data-test="index_input"
            />
            <Button
              text="Добавить по индексу"
              linkedList="big"
              style={{ width: 362 }}
              onClick={addByIndex}
              disabled={disableButton.indexButton}
              isLoader={loaders.addIndex}
              data-test="button"
            />
            <Button
              text="Удалить по индексу"
              linkedList="big"
              onClick={deleteByIndex}
              disabled={disableButton.deleteButton}
              isLoader={loaders.removeIndex}
              data-test="button"
            />
          </div>
        </form>
        <ul className={Style.ul}>
          {list.toArray().map(({ value, loading, load, upperCircle, bottomCircle }, index) => (
            <li className={Style.listItem} key={index}>
              <Circle
                letter={bottomCircle ? "" : value}
                index={index}
                state={
                  load
                    ? ElementStates.Modified
                    : loading
                      ? ElementStates.Changing
                      : ElementStates.Default
                }
                head={
                  upperCircle ? (
                    <Circle
                      isSmall
                      letter={inputValue}
                      state={ElementStates.Changing}
                    />
                  ) : index === 0 ? (
                    "head"
                  ) : (
                    ""
                  )
                }
                tail={
                  bottomCircle ? (
                    <Circle
                      isSmall
                      letter={value}
                      state={ElementStates.Changing}
                    />
                  ) : (bottomCircle && index === 0) ||
                    (bottomCircle &&
                      index === list.toArray().length - 1) ? (
                    <Circle
                      isSmall
                      letter={value}
                      state={ElementStates.Changing}
                    />
                  ) : index === list.toArray().length - 1 ? (
                    "tail"
                  ) : (
                    ""
                  )
                }
              />
              {index !== list.toArray().length - 1 && <ArrowIcon />}
            </li>
          ))}
        </ul>
      </section>
    </SolutionLayout>
  );
};
