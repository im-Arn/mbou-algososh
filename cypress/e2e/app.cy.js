import { CyRoutes } from "./utils.cy";

describe('service is available', function() {
  it('"Домашняя" страница доступна', function() {
    cy.visit(CyRoutes.home);
  });
}); 