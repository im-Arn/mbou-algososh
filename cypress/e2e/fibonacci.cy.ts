import { CircleColors, CyRoutes, CyConst } from "./utils.cy";
import { DELAY_IN_MS } from "../../src/constants/delays";

describe("FIBBONACCI PAGE works correctly", () => {
    beforeEach("страница 'Фибоначчи' доступна", () => {
        cy.visit(CyRoutes.fibonacci);
    });

    it("последовательность генерируется корректно", () => {
        const input = "4";
        const array = [1, 1, 2, 3, 5];

        cy.get("input").type(input);
        cy.get(CyConst.submit).click();
        cy.get(CyConst.circle).should("have.length", array.length - 1).each((circle, index) => {
            cy.wrap(circle).should("have.css", "border-color", CircleColors.Default).and("have.text", array[index]);
            cy.wait(DELAY_IN_MS);
        });
    });

    it("кнопка не активна при пустом поле ввода", () => {
        cy.get("input").should("be.empty");
        cy.get(CyConst.submit).should("be.disabled");
    });
});

