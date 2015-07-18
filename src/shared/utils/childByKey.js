import {Children} from 'react'

export default function childByKey(children) {
  return key => {
    let needle

    Children.forEach(children, child => {
      if (child && child.key === key) {
        needle = child
      }
    })

    return needle
  }
}
