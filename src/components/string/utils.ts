//types
import { TChar } from "../../types/types";
import { ElementStates } from "../../types/element-states";
//const
import { DELAY_IN_MS, SHORT_DELAY_IN_MS, setDelay } from "../../constants/delays";

export const reverseInput = async (input: Array<TChar> | null, setString: React.Dispatch<React.SetStateAction<Array<TChar> | null>>) => {
    if (input !== null) {
        const array = input;
        let lastIndex = input.length - 1;
        for (let i = 0; i < array.length / 2; i++) {
            const temp: TChar = array[i];
            array[i].state = ElementStates.Changing;// сначала красим кружки
            array[lastIndex].state = ElementStates.Changing;
            setString([...array]);
            await setDelay(SHORT_DELAY_IN_MS);
            array[i] = { ...array[lastIndex], state: ElementStates.Modified }; // затем сортируем
            array[lastIndex] = { ...temp, state: ElementStates.Modified };
            setString([...array]);
            await setDelay(DELAY_IN_MS);
            lastIndex--;
        }
    }
};