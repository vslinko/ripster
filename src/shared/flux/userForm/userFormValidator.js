import {constraints} from 'strulidator'

const {
  createObjectConstraint,
  combineConstraints,
  notNull,
  notEmpty,
  string,
  email
} = constraints

export default createObjectConstraint({
  email: combineConstraints({
    notNull,
    notEmpty,
    string,
    email
  })
})
