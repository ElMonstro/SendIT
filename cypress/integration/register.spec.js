/// <reference types="cypress" />

import Chance  from "chance";
const chance = Chance();

describe('SendIT', () => {

    const username = 'Eminem';
    const email = chance.email();
    const password = 'validPa55sw#rd'
    beforeEach(() => {
        cy.visit("http://127.0.0.1:5500/UI/registration.html");
    })

    it('Has title', () => {
        cy.contains("Register");
    })
    // Checks registration
    it.only('Gets new user information', () => {

        cy.get('input[name=username]').type(username)
        .should('have.value', username);
        cy.get('input[name=email]').type(email)
        .should('have.value', email);
        cy.get('#reg-pass').type(password)
        .should('have.value', password);
        cy.get('#confirm-pass').type(password)
        .should('have.value', password);
        cy.server();
        cy.route('POST', 'https://pacific-harbor-80743.herokuapp.com/api/v2/auth/signup', 
        {'message': 'Login successful'})
        cy.get('button[type=submit]').click();
        // Check if it redirects to login page
        //cy.url().should('include', 'login.html');

    })
})