import React, { PropTypes } from 'react';

export default class LocaleButtons extends React.Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    onLocale: PropTypes.func.isRequired,
  }

  render() {
    const {
      currentLocale,
      onLocale,
    } = this.props;

    return (
      <div>
        <button
          onClick={() => onLocale('ru')}
          disabled={currentLocale === 'ru'}
        >
          Русский
        </button>

        <button
          onClick={() => onLocale('en')}
          disabled={currentLocale === 'en'}
        >
          English
        </button>
      </div>
    );
  }
}
