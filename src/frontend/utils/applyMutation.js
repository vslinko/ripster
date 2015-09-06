import Relay from 'react-relay';

export default function applyMutation(mutation) {
  return new Promise((resolve, reject) => {
    Relay.Store.update(mutation, {
      onSuccess: resolve,
      onFailure: (transaction) => {
        let error = transaction.getError() || new Error('Mutation failed');

        if (!(error instanceof Error)) {
          error = new Error(error);
        }

        reject(error);
      },
    });
  });
}
