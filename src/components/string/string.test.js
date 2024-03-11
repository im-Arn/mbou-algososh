//FUNC
import { reverseInput } from "./utils";
//types
import { ElementStates } from "../../types/element-states";

function rendering(string, reversedStr) {
  const stringArr = string.split("").map(char => ({ char, state: ElementStates.Default }));
  const reversedArr = reversedStr.split("").map(char => ({ char, state: ElementStates.Modified }));
  return {stringArr, reversedArr};
}

describe("STRING alg works correctly", () => {
  const setString = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Корректно разворачивает строку с чётным количеством символов", async () => {
    const { stringArr, reversedArr } = await rendering("recu", "ucer");
    await reverseInput(stringArr, setString);
    expect(setString).toHaveBeenCalledWith(reversedArr);
  });

  it("Корректно разворачивает строку с нечётным количеством символов", async () => {
    const { stringArr, reversedArr } = await  rendering("recur", "rucer");
    await reverseInput(stringArr, setString);
    expect(setString).toHaveBeenCalledWith(reversedArr);
  });

  it("Корректно разворачивает строку с одним символом", async () => {
    const { stringArr, reversedArr } = await rendering("r", "r");
    await reverseInput(stringArr, setString);
    expect(setString).toHaveBeenCalledWith(reversedArr);
  });

  it("Корректно разворачивает пустую строку", async () => {
    const string = "";
    const stringArr = string.split("").map(char => ({ char, state: ElementStates.Default }));

    await reverseInput(stringArr, setString);
    expect(setString).not.toHaveBeenCalled();
  });
});