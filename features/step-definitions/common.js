import {defineSteps} from '../support/utils'

const SignInForm = component('SignInForm')

export default defineSteps(step => {

  step(/^I open page "([^"]*)"$/, async (url) => {
    await browser.url(url)
    await browser.waitForExist('#app')

    const result = await browser.element('#app')

    assert.ok(result.value)
  })

  step(/I see login form/, async () => {
    await browser.waitForExist(SignInForm())

    const result = await browser.element(SignInForm())

    assert.ok(result.value)
  })

  step(/Login form have email field/, async () => {
    await browser.waitForExist(SignInForm())

    const result = await browser
      .element(SignInForm())
      .element(SignInForm.element('Email'))

    assert.ok(result.value)
  })

  step(/Login form have password field/, async () => {
    await browser.waitForExist(SignInForm())

    const result = await browser
      .element(SignInForm())
      .element(SignInForm.element('Password'))

    assert.ok(result.value)
  })

})
