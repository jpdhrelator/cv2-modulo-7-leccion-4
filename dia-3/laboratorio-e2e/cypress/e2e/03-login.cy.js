describe('Acceso a la mesa de soporte', () => {
    beforeEach(() => {
        cy.request('POST', '/api/reset')
        cy.visit('/login')
    });

    it('un agente con credenciales validas entra a su cola', () => {
        cy.get('[data-cy="email"]').should('have.value', '');

        cy.get('[data-cy="email"]').type('soporte@demo.cl');
        cy.get('[data-cy="clave"]').type('clave123');
        cy.get('[data-cy="entrar"]').click();


        cy.url().should('include', '/cola');
        cy.get('[data-cy="usuario"]').should('have.text', 'Equipo Soporte');
        cy.get('[data-cy="ticket"]').should('have.length', 3);

        cy.get('[data-cy="form-login"]').should('not.exist');


    });

    it('rechaza credenciales incorrectas y explica por que', () => {
        cy.get('[data-cy="email"]').type('intruso@demo.cl')
        cy.get('[data-cy="clave"]').type('adivinanza')
        cy.get('[data-cy="entrar"]').click()

        // Mensaje humano, no un codigo de error
        cy.get('[data-cy="error-login"]')
            .should('be.visible')
            .and('contain', 'Correo o clave incorrectos')

        // Y sobre todo: NO me dejo entrar
        cy.url().should('include', '/login')
        cy.get('[data-cy="form-login"]').should('be.visible')
    })

    it('protege la cola de quien no inicio sesion', () => {
        cy.visit('/cola')

        // El guardia del router me devuelve al login.
        // Esto es cableado entre router + sesion: una prueba unitaria
        // del componente jamas lo habria visto.
        cy.url().should('include', '/login')
    })

    it('permite enviar el formulario con la tecla Enter', () => {
        cy.get('[data-cy="email"]').type('soporte@demo.cl')
        cy.get('[data-cy="clave"]').type('clave123{enter}')

        cy.url().should('include', '/cola')
    })


    it('el filtro reduce la lista mientras escribo', () => {
        cy.get('[data-cy="email"]').type('soporte@demo.cl')
        cy.get('[data-cy="clave"]').type('clave123{enter}')

        cy.get('[data-cy="ticket"]').should('have.length', 3)

        cy.get('[data-cy="filtro"]').type('boleta')
        cy.get('[data-cy="ticket"]').should('have.length', 1)
        cy.get('[data-cy="ticket"]').should('contain', 'La boleta llega sin IVA')

        // Un filtro sin coincidencias no deja la pantalla en blanco:
        // muestra el estado vacio. Eso tambien es parte del producto.
        cy.get('[data-cy="filtro"]').clear().type('zzz')
        cy.get('[data-cy="ticket"]').should('not.exist')
        cy.get('[data-cy="vacio"]').should('be.visible')
    })

});