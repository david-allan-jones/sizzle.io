describe('polls.cy.js', () => {
    beforeEach(() => {
        cy.visit('localhost:3000/polls')
    })

    it('should have static input prompts and buttons', () => {
        cy.get('[data-test="input-prompt"]')
            .should('have.text', 'Input your poll data')

        // Question, option, date inputs
        cy.get('input[type="text"]')
            .should('have.length', 3)

        // Question, option, date prompts
        cy.get('[data-test="question-prompt"]')
            .should('have.text', 'Question:')
        cy.get('[data-test="option-prompt"]')
            .should('have.text', 'Option:')
        cy.get('[data-test="expiration-date-prompt"]')
            .should('have.text', 'Expiration Date:')

        // Submit button
        cy.get('input[type="submit"]')
            .should('have.value', 'Create')
    })

    it('should let you type in question', () => {
        const value = 'abc'
        cy.get('[data-test="question-input"]')
            .type(value)
            .should('have.value', value)
    })

    it('should be able to create options', () => {
        const value = 'abc'
        cy.get('[data-test="option-input"]')
            .type(value)
            .type('{enter}')
            .type(value)

        cy.get('[data-test="add-option-btn"]')
            .click()

        cy.get('[data-test="saved-option"]')
            .should('have.length', 2)
    })

    it('should allow you to delete options after typing', () => {
        const value = 'abc'
        cy.get('[data-test="option-input"]')
            .type(value)
            .type('{enter}')
            .type(value)
            .type('{enter}')

        cy.get('[data-test="saved-option-delete-btn"]')
            .eq(1)
            .click()

        cy.get('[data-test="saved-option"]')
            .should('have.length', 1)
    })

    it('should not save more than 10 options', () => {
        const value = 'abc'
        for (let i = 0; i < 11; i++) {
            cy.get('[data-test="option-input"]')
                .type(value)
                .type('{enter}')
        }
        cy.get('[data-test="saved-option"]')
            .should('have.length', 10)
    })

    it('should show error when trying to submit >10 option', () => {
        const value = 'abc'
        for (let i = 0; i < 11; i++) {
            cy.get('[data-test="option-input"]')
                .type(value)
                .type('{enter}')
        }

        cy.get('[data-test="error"]')
            .should('have.text', 'You may only enter a max of 10 options')
    })

    it('should show error when trying to submit only 1 option', () => {
        const value = 'abc'
        cy.get('[data-test="question-input"]')
            .type('test')

        cy.get('[data-test="option-input"]')
            .type(value)
            .type('{enter}')

        cy.get('input[type="submit"]')
            .click()

        cy.get('[data-test="error"]')
            .should('have.text', 'You need to provide at least 2 options a poll.')
    })

    it('should show error if you try to submit long question', () => {
        cy.get('[data-test="question-input"]')
            .type('x'.repeat(101))

        cy.get('input[type="submit"]')
            .click()

        cy.get('[data-test="error"]')
            .should('have.text', 'Questions must be between 1-100 characters.')
    })

    it('should show error if you try to save an empty option', () => {
        cy.get('[data-test="option-input"]')
            .type('{enter}')

        cy.get('[data-test="error"]')
            .should('have.text', 'You may not use an empty string as an option')
    })

    it('should show error if you try to type long options', () => {
        cy.get('[data-test="option-input"]')
            .type('x'.repeat(101))
            .type('{enter}')

        cy.get('[data-test="error"]')
            .should('have.text', 'You may only use options that are 100 characters or less')
    })
})