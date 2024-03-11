import { CircleColors, CyRoutes, CyConst } from "./utils.cy";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

function animate(iValue: string, iIndex: number, type: "add" | "delete") {
    if (type === "add") {
    cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
    cy.wait(SHORT_DELAY_IN_MS);
    cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Default).should('have.text', iValue);
    } else {
        cy.get(CyConst.circle).eq(iIndex).should('have.css', 'border-color', CircleColors.Changing).should('have.text', iValue);
        cy.wait(SHORT_DELAY_IN_MS);
    }
}
function render(iValue: string, iIndex: number) {
    cy.get('input').type(iValue);
    cy.contains('Добавить').click();
    animate(iValue, iIndex, "add");
    cy.get('input').should("be.empty");
}

const inputArray = ["wasD", "56", "UwU"];
const inputArrayDeleted = ["wasD", "56"];

describe('STACK PAGE works correctly', () => {
    beforeEach("страница 'СТЭК' доступна", () => {
        cy.visit(CyRoutes.stack);
    });

    it("кнопки не активны при пустом поле ввода", () => {
        cy.get("input").should("be.empty");
        cy.get(CyConst.button).should("be.disabled");
    });

    it('элементы стэка добавляются корректно', () => {
        inputArray.forEach((el, index) => {
            render(el, index);
        });
    });

    it('элементы стэка удаляются корректно', () => {
        inputArray.forEach((el, index) => {
            render(el, index);
        });
        cy.get(CyConst.circle).should("have.length", inputArray.length);
        cy.contains('Удалить').click();
        animate(inputArray[inputArray.length - 1], inputArray.length - 1, "delete");
        cy.get(CyConst.circle).should("have.length", inputArray.length - 1);
        cy.get(CyConst.circle).eq(inputArray.length - 2).should('have.text', inputArrayDeleted[inputArray.length - 2]);
    });

    it('стэк очищается корректно', () => {
        inputArray.forEach((el, index) => {
            render(el, index);
        });
        cy.get(CyConst.circle).should("have.length", inputArray.length);
        cy.contains('Очистить').click();
        cy.get(CyConst.circle).should("have.length", 0);
    });
});