import test from 'blue-tape';
import createHeadlessBrowser from '../createHeadlessBrowser';
import component from '../component';

const SignInForm = component('SignInForm');

test('signin/validation', async (t) => {
  const b = createHeadlessBrowser();

  await b.openUrl('/');
  await b.waitForSelector(SignInForm());

  t.notok(b.querySelector(SignInForm.element('EmailError')));
  t.notok(b.querySelector(SignInForm.element('PasswordError')));

  b.fill(SignInForm.element('Email'), 'a');
  b.fill(SignInForm.element('Password'), 'a');

  t.notok(b.querySelector(SignInForm.element('EmailError')));
  t.notok(b.querySelector(SignInForm.element('PasswordError')));

  b.submit(SignInForm.element('Form'));
  await b.tick();
  t.ok(b.querySelector(SignInForm.element('EmailError')));
  t.ok(b.querySelector(SignInForm.element('PasswordError')));

  b.fill(SignInForm.element('Email'), 'test@example.com');
  b.submit(SignInForm.element('Form'));
  await b.tick();
  t.notok(b.querySelector(SignInForm.element('EmailError')));
  t.ok(b.querySelector(SignInForm.element('PasswordError')));

  b.fill(SignInForm.element('Password'), '12345');
  b.submit(SignInForm.element('Form'));
  await b.tick();
  t.notok(b.querySelector(SignInForm.element('EmailError')));
  t.notok(b.querySelector(SignInForm.element('PasswordError')));
});
