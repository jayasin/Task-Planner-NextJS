describe('Header component Should be available', () => {
    it('Header component Should be available', () => {
        cy.visit('http://localhost:3000/')
        cy.get('div[id="header"]');
    })
})


describe('Navigation', () => {
    it('When clicked on ADD Task should navigate to "/addTask"', () => {
        cy.visit('http://localhost:3000/')

        cy.get('button[id="add_task"]').click()

        cy.url().should('include', '/addTask')
    })
})

describe('Date Picker', () => {
    it('Date Picker should be available', () => {
        cy.visit('http://localhost:3000/')
        cy.get('input[id="date"]');
    })
})

describe('Pie Chart', () => {
    it('pie chart should be available', () => {
        cy.visit('http://localhost:3000/')
        cy.get('canvas');
    })
})