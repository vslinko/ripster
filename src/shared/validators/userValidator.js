import {constraints} from 'strulidator'

const {
  createObjectConstraint,
  combineConstraints,
  notNull,
  notEmpty,
  string,
  email,
  createMinLengthConstraint,
  createMaxLengthConstraint
} = constraints

export default createObjectConstraint({
  email: combineConstraints({
    notNull,
    notEmpty,
    string,
    email
  }),
  password: combineConstraints({
    notNull,
    notEmpty,
    string,
    minLength: createMinLengthConstraint(5),
    maxLength: createMaxLengthConstraint(18)
  })
})
