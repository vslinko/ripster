import React from 'react';
import Relay from 'react-relay';
import {compose} from 'redux';
import {connect} from 'react-redux';
import relay from 'frontend/utils/relay';
import intlSelector from 'frontend/bundles/locale/selectors/intlSelector';

import {LocaleButtonsContainer} from 'frontend/bundles/locale/components/LocaleButtons';
import {SignInFormContainer} from 'frontend/bundles/auth/components/SignInForm';
import {UserInfoContainer} from 'frontend/bundles/user/components/UserInfo';

import HomePage from './HomePage';

export default compose(
  relay({
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          users(first: 10) {
            edges {
              cursor
              node {
                ${UserInfoContainer.getFragment('user')}
              }
            }
          }
        }
      `,
    },
  }),
  connect(
    intlSelector,
    null,
    (stateProps, dispatchProps, parentProps) => ({
      ...stateProps,
      localeButtons: <LocaleButtonsContainer />,
      form: <SignInFormContainer />,
      users: parentProps.viewer.users.edges.map((edge) => (
        <UserInfoContainer key={edge.cursor} user={edge.node} />
      )),
    })
  )
)(HomePage);
