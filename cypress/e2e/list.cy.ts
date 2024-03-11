
import { CircleColors, CyRoutes, CyConst } from "./utils.cy";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

function animate(
  iValue: string,
  type: "addToTail" | "addToHead" | "deleteFromHead" | "deleteFromTail" | "addToIndex" | "deleteToIndex") {
  if (type === "addToTail") {
    cy.get(CyConst.circle).eq(-2).should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
    cy.get(CyConst.circle).last().should('have.css', 'border-color', CircleColors.Modified).should('have.text', iValue);
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).last().should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    cy.get(CyConst.element).last().should("contain", "tail");
  } else if (type === "addToHead") {
    cy.get(CyConst.circle).first().should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
    cy.get(CyConst.circle).first().should('have.css', 'border-color', CircleColors.Modified).should('have.text', iValue);
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).first().should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    cy.get(CyConst.element).first().should("contain", "head");
  } else if (type === "deleteFromHead") {
    cy.get(CyConst.circle).first().should('have.css', 'border-color', CircleColors.Default).should('have.text', "");
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).first().should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    cy.get(CyConst.element).first().should("contain", "head");
  } else if (type === "deleteFromTail") {
    cy.get(CyConst.circle).eq(-2).should('have.css', 'border-color', CircleColors.Default).should('have.text', "");
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).last().should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    cy.get(CyConst.element).last().should("contain", "tail");
  } else if (type === "addToIndex") {
    cy.get(CyConst.circle).eq(2).should('have.css', 'border-color', CircleColors.Modified).and('have.text', iValue)
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).eq(2).should('have.css', 'border-color', CircleColors.Default).and('have.text', iValue)
    cy.get(CyConst.index).eq(2).should("contain", "2");
  } else if (type === "deleteToIndex") {
    cy.get(CyConst.circle).eq(2).should('have.css', 'border-color', CircleColors.Changing).and('have.text', iValue)
    cy.get(CyConst.index).eq(2).should("contain", "2");
    cy.wait(SHORT_DELAY_IN_MS);
  }
}

describe("LIST PAGE works correctly", () => {
  beforeEach("страница 'Список' доступна", () => {
    cy.visit(CyRoutes.list);
  });

  it("кнопки не активны при пустом поле ввода", () => {
    cy.get("input").should("be.empty");
    cy.get(CyConst.button).should("be.disabled");
  });

  it('рендер стартового списка корректный', () => {
    cy.get(CyConst.element).then((element) => {
      cy.wrap(element).should("have.length.within", 4, 6)
      cy.wrap(element).find(CyConst.circle).should('have.css', 'border-color', CircleColors.Default);
      cy.wrap(element).first().should("contain", "head");
      cy.wrap(element).last().should("contain", "tail");
    });
  });

  it('добавление элемента в head работает корректно', () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.get(CyConst.input).type("ini");
      cy.contains("button", "Добавить в head").click();
      animate("ini", "addToHead");
      cy.get(CyConst.circle).should("have.length", circleTexts.length + 1);
    });
  });

  it('добавление элемента в tail работает корректно', () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.get(CyConst.input).type("end");
      cy.contains("button", "Добавить в tail").click();
      animate("end", "addToTail");
      cy.get(CyConst.circle).should("have.length", circleTexts.length + 1);
    });
  });


  it('удаление элемента из head работает корректно', () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.contains("button", "Удалить из head").click();
      animate(circleTexts[1], "deleteFromHead");
      cy.get(CyConst.circle).should("have.length", circleTexts.length - 1);
    });
  });

  it('удаление элемента из tail работает корректно', () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.contains("button", "Удалить из tail").click();
      animate(circleTexts[circleTexts.length - 2], "deleteFromTail");
      cy.get(CyConst.circle).should("have.length", circleTexts.length - 1);
    });
  });

  it("добавление элемента по index работает корректно", () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.get(CyConst.input).type("ind+");
      cy.get(CyConst.indexInput).type("2");
      cy.contains("button", "Добавить по индексу").click();
      animate("ind+", "addToIndex");
      cy.get(CyConst.circle).should("have.length", circleTexts.length + 1);
    });
  });

  it("удаление элемента по index работает корректно", () => {
    let circleTexts = [];
    cy.get(CyConst.circle).each((element) => {
      const text = element.text().trim();
      return circleTexts.push(text);
    }).then(() => {
      cy.get(CyConst.indexInput).type("2");
      cy.contains("button", "Удалить по индексу").click();
      animate(circleTexts[2], "deleteToIndex");
      cy.get(CyConst.circle).eq(2).should('have.text', circleTexts[3]);
      cy.get(CyConst.circle).should("have.length", circleTexts.length - 1);
    });
  });
});