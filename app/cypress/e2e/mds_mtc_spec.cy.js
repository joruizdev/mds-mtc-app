describe('MDS MTC App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('frontpage cant be opened', () => {
    cy.contains('Iniciar sesión')
  })

  it('login with field empty', () => {
    cy.contains('Iniciar sesión').click()
  })

  it('User can login', () => {
    cy.contains('Iniciar sesión').click()
    cy.get('input').first().type('joruiz')
    cy.get('input').last().type('mi-password')
  })
})
