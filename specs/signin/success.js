import test from 'blue-tape';
import createSeleniumBrowser from '../createSeleniumBrowser';
import component from '../component';

const SignInForm = component('SignInForm');
const HomePage = component('HomePage');

test('signin/success', async (t) => {
  const b = (await createSeleniumBrowser())();

  await b.url('/');
  await b.waitForExist(SignInForm());

  t.equal(
    await b.getText(HomePage.element('Welcome')),
    'anonymous'
  );

  await b.setValue(SignInForm.element('Email'), 'user1@example.com');
  await b.setValue(SignInForm.element('Password'), '12345');
  await b.submitForm(SignInForm());

  t.ok(
    await b.getAttribute(SignInForm.element('Button'), 'disabled')
  );

  await b.waitForEnabled(SignInForm.element('Button'));

  t.notok(
    await b.getAttribute(SignInForm.element('Button'), 'disabled')
  );

  t.equal(
    await b.getText(HomePage.element('Welcome')),
    'authorized'
  );
});
