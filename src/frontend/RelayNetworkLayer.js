import { DefaultNetworkLayer } from 'react-relay';

/**
 * Formats an error response from GraphQL server request.
 */
function defaultFormatErrors(request, errors): string {
  const CONTEXT_BEFORE = 20;
  const CONTEXT_LENGTH = 60;

  const queryLines = request.getQueryString().split('\n');
  return errors.map(({ locations, message }, ii) => {
    const prefix = (ii + 1) + '. ';
    const indent = ' '.repeat(prefix.length);

    // custom errors thrown in graphql-server may not have locations
    const locationMessage = locations ?
      ('\n' + locations.map(({ column, line }) => {
        const queryLine = queryLines[line - 1];
        const offset = Math.min(column - 1, CONTEXT_BEFORE);
        return [
          queryLine.substr(column - 1 - offset, CONTEXT_LENGTH),
          ' '.repeat(offset) + '^^^',
        ].map(messageLine => indent + messageLine).join('\n');
      }).join('\n')) :
      '';

    return prefix + message + locationMessage;
  }).join('\n');
}

export default class RelayNetworkLayer extends DefaultNetworkLayer {
  constructor(uri, init, onError, formatErrors) {
    super(uri, init);

    this.onError = onError;
    this.formatErrors = formatErrors || defaultFormatErrors;
  }

  sendMutation(request): Promise {
    return this._sendMutation(request).then(
      result => result.json()
    ).then(payload => {
      if (payload.hasOwnProperty('errors')) {
        const error = new Error(
          'Server request for mutation `' + request.getDebugName() + '` ' +
          'failed for the following reasons:\n\n' +
          this.formatErrors(request, payload.errors)
        );
        (error: any).source = payload;
        this.onError(error);
        request.reject(error);
      } else {
        request.resolve({ response: payload.data });
      }
    }).catch(
      error => {
        this.onError(error);
        request.reject(error);
      }
    );
  }

  sendQueries(requests): Promise {
    return Promise.all(requests.map(request => (
      this._sendQuery(request).then(
        result => result.json()
      ).then(payload => {
        if (payload.hasOwnProperty('errors')) {
          const error = new Error(
            'Server request for query `' + request.getDebugName() + '` ' +
            'failed for the following reasons:\n\n' +
            this.formatErrors(request, payload.errors)
          );
          (error: any).source = payload;
          this.onError(error);
          request.reject(error);
        } else if (!payload.hasOwnProperty('data')) {
          const error = new Error(
            'Server response was missing for query `' + request.getDebugName() +
            '`.'
          );
          this.onError(error);
          request.reject(error);
        } else {
          request.resolve({ response: payload.data });
        }
      }).catch(
        error => {
          this.onError(error);
          request.reject(error);
        }
      )
    )));
  }

}
