describe('Cola de tickets', () => {
    beforeEach(() => {
        // Estado conocido antes de CADA escenario. Sin esto, el test que
        // resuelve un ticket rompe al siguiente. Es la regla de las pruebas
        // que la leccion llama "aisladas": no dependen del orden.
        cy.request('POST', '/api/reset')
        cy.visit('/login')
    })

    it('muestra el formulario de acceso', () => {
        cy.get('[data-cy="form-login"]').should('be.visible')
        cy.get('[data-cy="entrar"]').should('contain', 'Entrar')
    })

    it('la cola carga sola, sin esperas manuales', () => {
        cy.get('[data-cy="email"]').type('soporte@demo.cl')
        cy.get('[data-cy="clave"]').type('clave123')
        cy.get('[data-cy="entrar"]').click()

        // Entre el click y esta linea pasan cuatro cosas: cambia la
        // pantalla, sale la peticion, llega la respuesta y se dibuja la
        // lista. No escribimos ni una espera: Cypress mira una y otra vez
        // hasta que hay 3 tickets, o se rinde a los 4 segundos.
        cy.get('[data-cy="ticket"]').should('have.length', 3)
    })

    it('un agente entra  y ve su cola de trabajo', ()=>{
        

        const inputEmail=cy.get('[data-cy="email"]');
        inputEmail.type('soporte@demo.cl');

        const inputClave= cy.get('[data-cy="clave"]');
        inputClave.type('clave123');

        const botonIngres=cy.get('[data-cy="entrar"]');
        botonIngres.click();

        cy.url().should('include', '/cola');

        const parrafoUsurio=cy.get('[data-cy="usuario"]');
        parrafoUsurio.should('contain','Equipo Soporte');

        const liTickets= cy.get('[data-cy="ticket"]');
        liTickets.should('have.length',3);

        cy.contains('[data-cy="ticket"]', 'Caida total del portal').should('be.visible')
    })
})