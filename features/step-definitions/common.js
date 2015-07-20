import {defineSteps} from '../support/utils'

export default defineSteps(step => {

  step(/^I open page "([^"]*)"$/, async (url) => {
    await browser.url(url)
    await browser.waitForExist('#app')

    const result = await browser.element('#app')

    assert.ok(result.value)
  })

  step(/I see login form/, async () => {
    await browser.waitForExist(byComponent('SignInFormContainer'))

    const result = await browser.element(byComponent('SignInFormContainer'))

    assert.ok(result.value)
  })

})
