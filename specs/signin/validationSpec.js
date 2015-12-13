import test from 'blue-tape';
import createHeadlessBrowser from '../createHeadlessBrowser';
import { createMarker } from '../marker';

const SignInForm = createMarker('SignInForm');

test('signin/validation', async (t) => {
  const b = createHeadlessBrowser();

  await b.openUrl('/');
  await b.waitForSelector(SignInForm('Form'));

  t.notok(b.querySelector(SignInForm('EmailError')));
  t.notok(b.querySelector(SignInForm('PasswordError')));

  b.fill(SignInForm('Email'), 'a');
  b.fill(SignInForm('Password'), 'a');

  t.notok(b.querySelector(SignInForm('EmailError')));
  t.notok(b.querySelector(SignInForm('PasswordError')));

  b.submit(SignInForm('Form'));
  await b.tick();
  t.ok(b.querySelector(SignInForm('EmailError')));
  t.ok(b.querySelector(SignInForm('PasswordError')));

  b.fill(SignInForm('Email'), 'test@example.com');
  b.submit(SignInForm('Form'));
  await b.tick();
  t.notok(b.querySelector(SignInForm('EmailError')));
  t.ok(b.querySelector(SignInForm('PasswordError')));

  b.fill(SignInForm('Password'), '12345');
  b.submit(SignInForm('Form'));
  await b.tick();
  t.notok(b.querySelector(SignInForm('EmailError')));
  t.notok(b.querySelector(SignInForm('PasswordError')));
});
