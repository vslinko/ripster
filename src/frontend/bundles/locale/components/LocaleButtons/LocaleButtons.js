import React, {PropTypes} from 'react';
import testable from 'frontend/utils/testable';

@testable()
export default class LocaleButtons {
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
