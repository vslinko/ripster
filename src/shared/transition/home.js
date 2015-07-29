import {createTransition} from 'vstack-router'

export default createTransition('/', () => {
  return {
    title: 'Home Page',
    component: 'HomePage',
    props: {}
  }
})
