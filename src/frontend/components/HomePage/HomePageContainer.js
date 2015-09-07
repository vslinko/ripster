import React from 'react';
import Relay from 'react-relay';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createFormatters} from '../../utils/intl';
import relay from '../../utils/relay';

import {LocaleButtonsContainer} from '../LocaleButtons';
import {SignInFormContainer} from '../SignInForm';
import {UserInfoContainer} from '../UserInfo';
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
    state => ({
      ...createFormatters(state.locale.locale, state.locale.localeData),
    }),
    null,
    (stateProps, dispatchProps, parentProps) => ({
      ...stateProps,
      children: [
        <LocaleButtonsContainer key="localeButtons" />,
        <SignInFormContainer key="form" />,
        <div key="users">
          {parentProps.viewer.users.edges.map((edge) => (
            <UserInfoContainer key={edge.cursor} user={edge.node} />
          ))}
        </div>,
      ],
    })
  )
)(HomePage);
