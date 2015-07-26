import {defineSteps} from '../support/defineSteps'
import {component} from '../support/component'
import {browserWorld} from '../support/browserWorld'

const SignInForm = component('SignInForm')

export default defineSteps(browserWorld, step => {

  step(/^I open page "([^"]*)"$/, async (browser, url) => {
    await browser.openUrl(url)
    await browser.waitFor('#app')
    await browser.assertExists('#app')
  })

  step(/I see login form/, async (browser) => {
    await browser.assertExists(SignInForm())
  })

  step(/Login form have email field/, async (browser) => {
    await browser.assertExists(SignInForm.element('Email'))
  })

  step(/Login form have password field/, async (browser) => {
    await browser.assertExists(SignInForm.element('Password'))
  })

})
