import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {
  loadLocale
} from '../../flux/locale/localeActions'

import LocaleButtons from './LocaleButtons'

@connect(state => ({
  currentLocale: state.locale.locale
}))
export default class LocaleButtonsContainer {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const {dispatch, ...slice} = this.props

    return (
      <LocaleButtons
        {...slice}
        {...bindActionCreators({
          onLocale: loadLocale
        }, dispatch)}
      />
    )
  }
}
