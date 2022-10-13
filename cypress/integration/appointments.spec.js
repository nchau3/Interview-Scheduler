describe("Navigation", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });

  it("should book an interview", () => {
    cy.contains("[data-testid=day]", "Tuesday")

    cy.get("[alt=Add]")
    .first()
    .click();

    //input student/interviewer
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    //confirm new view SHOW
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
    .first()
    .click({force: true});

    //input and save new student/interviewer
    cy.get("[data-testid=student-name-input]")
    .clear()
    .type("Archibald Cohen");
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains("Save").click();

    //confirm new view SHOW
    cy.contains(".appointment__card--show", "Archibald Cohen");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
    .first()
    .click({force: true});

    cy.contains("Confirm")
    .click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
  
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });

});