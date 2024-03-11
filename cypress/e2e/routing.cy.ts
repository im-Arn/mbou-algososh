import { CyRoutes } from "./utils.cy";

describe('ROUTING works correctly', function () {
  beforeEach(() => {
    cy.visit(CyRoutes.home);
  });

  it('страница "Строка" доступна', () => {
    cy.visit(CyRoutes.recursion);
    cy.contains('Строка');
  });

  it('страница "Фибоначчи" доступна', () => {
    cy.visit(CyRoutes.fibonacci);
    cy.contains('Последовательность Фибоначчи');
  });

  it('страница "Сортировка массива" доступна', () => {
    cy.visit(CyRoutes.sorting);
    cy.contains('Сортировка массива');
  });

  it('страница "Стэк" доступна', () => {
    cy.visit(CyRoutes.stack);
    cy.contains('Стек');
  });

  it('страница "Очередь" доступна', () => {
    cy.visit(CyRoutes.queue);
    cy.contains('Очередь');
  });

  it('страница "Связный список" доступна', () => {
    cy.visit(CyRoutes.list);
    cy.contains('Связный список');
  });
});