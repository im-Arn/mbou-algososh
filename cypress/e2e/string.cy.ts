import { CircleColors, CyRoutes, CyConst } from "./utils.cy";
import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../src/constants/delays";

describe("STRING PAGE works correctly", () => {
  //обычный before не даст перезагрузки страницы перед каждым тестом и состояния придётся сбрасывать вручную
  beforeEach("страница 'Строка' доступна", () => {
    cy.visit(CyRoutes.recursion);
  });

  it("кнопка не активна при пустом поле ввода", () => {
    cy.get("input").should("be.empty");
    cy.get(CyConst.submit).should("be.disabled");
  });

  it("реверс строки корректен", () => {
    const inputString = "rec"; //укоротила строку для теста, но у меня успешно разворачивало прежнюю 'recursion'. скриншот в пуллреквесте.
    const reversedString = "cer";

    cy.get("input").type(inputString);

    cy.get(CyConst.circle).should("have.length", inputString.length).and("have.css", "border-color", CircleColors.Default);
    cy.get(CyConst.submit).click();

    let lastIndex = inputString.length - 1;
    for (let i = 0; i < inputString.length / 2; i++) {
      cy.get(CyConst.circle).eq(i).should("have.css", "border-color", CircleColors.Changing);
      cy.get(CyConst.circle).eq(lastIndex).should("have.css", "border-color", CircleColors.Changing);
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(CyConst.circle).eq(i).should("have.css", "border-color", CircleColors.Modified).and("contain", reversedString[i]);
      cy.get(CyConst.circle).eq(lastIndex).should("have.css", "border-color", CircleColors.Modified).and("contain", reversedString[lastIndex]);
      cy.wait(DELAY_IN_MS);
      lastIndex--;
    }
  });
});