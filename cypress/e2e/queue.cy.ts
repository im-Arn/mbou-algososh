
import { CircleColors, CyRoutes, CyConst } from "./utils.cy";
import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../src/constants/delays";

function animate(iValue: string, iIndex: number, type: "add" | "delete") {
  if (type === "add") {
    cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    cy.get(CyConst.element).eq(iIndex).should("contain", "tail");
  } else {
    cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
    cy.get(CyConst.element).eq(iIndex).should("contain", "head");
    cy.wait(SHORT_DELAY_IN_MS);
  }
}
function render(iValue: string, iIndex: number) {
  cy.get('input').type(iValue);
  cy.contains('Добавить').click();
  animate(iValue, iIndex, "add");
  cy.get('input').should("be.empty");
}

const inputArray = ["wasD", "56", "UwU",];
// const emptyArray = [undefined, undefined, undefined, undefined, undefined, undefined];

describe("QUEUE PAGE works correctly", () => {
  beforeEach("страница 'Очередь' доступна", () => {
    cy.visit(CyRoutes.queue);
  });

  it("кнопки не активны при пустом поле ввода", () => {
    cy.get("input").should("be.empty");
    cy.get(CyConst.button).should("be.disabled");
  });

  it('элементы очереди добавляются корректно', () => {
    inputArray.forEach((el, index) => {
      render(el, index);
    });
    cy.get(CyConst.element).eq(0).should("contain", "head");
    cy.get(CyConst.element).eq(inputArray.length - 1).contains('tail').should('exist');
  });

  it('элементы очереди удаляются корректно', () => {
    inputArray.forEach((el, index) => {
      render(el, index);
    });

    inputArray.forEach((el, index) => {
      cy.contains('Удалить').click();
      animate(el, index, "delete");
      cy.get(CyConst.circle).eq(index).should('not.contain.text'); //проверяем что текст обнулён
      cy.get(CyConst.element).eq(index).should('not.contain', "tail").should('not.contain', "head"); //проверяем что тэги обнулёны
      if (index + 1 < inputArray.length) {
        cy.get(CyConst.element).eq(index + 1).should('contain', "head"); //проверяем что тэг перенёсся
      }
      inputArray.slice(index + 1).forEach((remainingChar, remainingIndex) => { // проверка следующих эл-тов
        cy.get(CyConst.circle).eq(remainingIndex + index + 1).should('contain.text', remainingChar);
      });
    });
  });

  it('очередь очищается корректно', () => {
    inputArray.forEach((el, index) => {
      render(el, index);
    });

    cy.get(CyConst.circle).should("have.length", 7);
    cy.contains('Очистить').click();
    cy.get(CyConst.circle).each((circle, index) => {
      // const text = circle.text().trim();
      // expect(text).to.equal(emptyArray[index]);
      expect(circle.text().trim()).to.be.empty;
    })
  });
});