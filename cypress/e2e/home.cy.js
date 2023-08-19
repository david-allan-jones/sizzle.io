describe('home.cy.js', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
    })

    it('should have a welcome section', () =>{
        cy.get('[data-test="welcome-1"')
            .should('have.text', 'Welcome to')
    })

    it('should have sizzle name displayed', () =>{
        cy.get('[data-test="welcome-2"')
            .should('have.text', 'Sizzle!')
    })

    it('should have a button that starts new poll', () =>{
        cy.get('[data-test="create-btn"')
            .should('have.text', 'Start a new poll')
    })

    it('should navigate to poll input page when button is hit', () => {
        cy.get('[data-test="create-btn"]')
            .click()

        cy.url().should('match', /polls/)
    })
})