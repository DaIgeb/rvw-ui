import { MemberState } from './member.model';
import { MemberActions, MemberActionTypes } from './member.actions';

export const initialState: MemberState = {
  members: []
};

export function memberReducer(
  state: MemberState = initialState,
  action: MemberActions
): MemberState {
  switch (action.type) {
    case MemberActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        members: action.payload
      };
    }
    case MemberActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        members: []
      };
    }
    case MemberActionTypes.SAVE_SUCCESS: {
      return {
        ...state,
        members: [
          ...state.members.filter(r => ! action.payload.some(l => r.id === l.id)),
          ...action.payload
        ]
      };
    }
    default:
      return state;
  }
}
