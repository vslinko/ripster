import {defineSteps} from '../support/defineSteps'
import {component} from '../support/component'

const SignInForm = component('SignInForm')

export default defineSteps(step => {

  step(/^I open page "([^"]*)"$/, async (world, url) => {
    await world.openUrl(url)
    await world.assertEventuallyExists('#app')
  })

  step(/I see login form/, async (world) => {
    await world.assertEventuallyExists(SignInForm())
  })

  step(/Login form have email field/, async (world) => {
    await world.assertEventuallyExists(SignInForm.element('Email'))
  })

  step(/Login form have password field/, async (world) => {
    await world.assertEventuallyExists(SignInForm.element('Password'))
  })

})
