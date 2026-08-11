/*
// Bien: el texto es el comportamiento que estoy verificando
cy.contains('h1', 'Cola de tickets').should('be.visible')
cy.contains('[data-cy="error-login"]', 'Correo o clave incorrectos')

// Bien: acota la busqueda a un contenedor identificado
cy.get('[data-cy="lista"]').contains('Caida total del portal')

// Mal: 'Resolver' aparece 3 veces en la pagina.
// Cypress toma el primero y el test miente.
cy.contains('Resolver').click()
*/


describe('Selecciona dentro de la Lista', () => {

    beforeEach(() => {
        cy.request('POST', '/api/reset')
        cy.visit('/login')
        cy.get('[data-cy="email"]').type('soporte@demo.cl')
        cy.get('[data-cy="clave"]').type('clave123')
        cy.get('[data-cy="entrar"]').click()
    })

    it('encuentra un ticket por su identificador, no por su posicion', () => {

        cy.get('[data-cy="ticket"][data-id="T-102"]')
            .should('contain', 'La boleta llega sin IVA')
            .find('[data-cy="prioridad"]')
            .should('have.text', 'media');
    });

    it('afirma sobre TODOS los elementos de la lista', () => {
        cy.get('[data-cy="ticket"]').each((fila) => {
            cy.wrap(fila).find('[data-cy="titulo"]').should("not.be.empty");
            cy.wrap(fila).find('[data-cy="resolver"]').should('be.enabled');
        })
    });

});