import {
  OAUTH_AUTHORIZATIONS_FETCH_SUCCESS,
} from '../actions/accounts';
import Immutable from 'immutable';

const normalizeOAuthAuthorizations = (state, {id, oauth_authorizations}) => state.set(id, Immutable.fromJS(oauth_authorizations))

const initialState = Immutable.Map();

export default function oauth_authorizations(state = initialState, action) {
  switch(action.type) {
  case OAUTH_AUTHORIZATIONS_FETCH_SUCCESS:
    return normalizeOAuthAuthorizations(state, action.oauth_authorizations);
  default:
    return state;
  }
}
