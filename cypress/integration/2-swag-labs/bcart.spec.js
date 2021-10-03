import { CommonPage } from '../../support/pages';

context('Cart', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    LoginPage.UserName()
        .type('standard_user')
        .should('have.value', 'standard_user')
    LoginPage.Password()
        .type('secret_sauce')
        .should('have.value', 'secret_sauce')
    LoginPage.LoginButton().click()

    CommonPage.MainBurgerButton()
          .invoke('text')
          .should('match', /Menu/i)
  })

  describe('Page', () => {
    it('visible inventory items', () => {
      CommonPage.CartListItems()
        .should('have.length', 3)

    })
    it('visible price, header and description', () => {
      CommonPage.CartListItems()
        .first().as('inventoryItem')

      cy.get('@inventoryItem')
        .find('.inventory_item_name')
        .should('contain', 'Sauce')

      cy.get('@inventoryItem')
        .find('.inventory_item_desc')
        .invoke('text')
        .its('length')
        .should('be.gt', 1)

      cy.get('@inventoryItem')
        .find('.inventory_item_price')
        .should('have.text', '29.99')
       
    })
    it('visible header', () => {
      cy.get('.subheader')
        .should('have.text', 'Your Cart')

    })
    it('visible main burger menu', () => {
      CommonPage.MainBurgerButton()
        .invoke('text')
        .should('match', /Menu/i)

    })
  })
  describe('Cart', () => {
    it('remove product', () => {
      let RemoveFirstItem = ($cart, $count) => { 
        CommonPage.CartListItems()
        .first()
        .find('.btn_secondary')
        .click()

        cy.getSessionStorage('cart-contents').should('eq', $cart)

        if ($count) {
          CommonPage.ShoppingCartBadge()
            .should('have.text',  $count)
        } else {
          CommonPage.ShoppingCartBadge()
            .should('not.exist')
        }
      }
      
      RemoveFirstItem('[1,2]', '2');

      RemoveFirstItem('[2]', '1');

      RemoveFirstItem('[]', null);

    })
    it('buy product', () => {
      let firstName = 'Shivam'
      let lastname = 'Tomer'
      let psc = '68201'
      let CartButton = () => {
        cy.get('.cart_button')
        .click();
      }

      cy.get('.checkout_button')
        .click();

      cy.get('#first-name')
        .type(firstName)
        .should('have.value', firstName)

      cy.get('#last-name')
        .type(lastname)
        .should('have.value', lastname)

      cy.get('#postal-code')
        .type(psc)
        .should('have.value', psc)

      CartButton()

      cy.get('.summary_subtotal_label')
        .should('have.text', 'Item total: $53.97')

      cy.get('.summary_tax_label')
        .should('have.text', 'Tax: $4.32')

      cy.get('.summary_total_label')
        .should('have.text', 'Total: $58.29')

      CartButton()

      cy.get('.subheader')
        .should('have.text', 'Finish')

      cy.get('.complete-header')
        .should('have.text', 'THANK YOU FOR YOUR ORDER')
      
    })
  })
})
