import {schema} from 'vstack-validator';

export default schema.type('signInForm', {
  email: {
    notEmpty: schema.constraint(schema.validators.isNotEmpty, 'Email is empty'),
    email: schema.constraint(schema.validators.isEmail, 'Email is not valid'),
  },
  password: {
    notEmpty: schema.constraint(schema.validators.isNotEmpty, 'Password is empty'),
    minLength: schema.minLength(5, 'Password is less than 5'),
    maxLength: schema.minLength(18, 'Password is more than 18'),
  },
});
