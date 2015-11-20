import test from 'blue-tape';
import createBrowser from '../createBrowser';
import component from '../component';

const SignInForm = component('SignInForm');
const HomePage = component('HomePage');

test('signin/success', async (t) => {
  const b = createBrowser();

  await b.openUrl('/');
  await b.waitForSelector(SignInForm());

  const button = b.querySelector(SignInForm.element('Button'));
  const welcome = b.querySelector(HomePage.element('Welcome'));

  t.equal(welcome.textContent, 'anonymous');

  b.fill(SignInForm.element('Email'), 'user1@example.com');
  b.fill(SignInForm.element('Password'), '12345');
  b.submit(SignInForm());

  await b.waitFor(() => button.disabled === true);
  t.equal(button.disabled, true);

  await b.waitFor(() => button.disabled === false);
  t.equal(button.disabled, false);

  t.equal(welcome.textContent, 'authorized');
});
