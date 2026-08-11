describe('el entorno E2E', () => {
  it('abre la aplicacion en el navegador', () => {
    cy.visit('/login')
    cy.contains('h1', 'Mesa de soporte').should('be.visible')
  })

  it('la API de clase responde', () => {
    // cy.request golpea el servidor DIRECTO, sin pasar por la interfaz.
    // Sirve para verificar el backend y para preparar datos.
    cy.request('/api/tickets')
      .its('status')
      .should('eq', 200)
  })
})