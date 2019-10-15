import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MemberState, State, Member } from './member.model';

export const selectMemberState = createFeatureSelector<State, MemberState>(
  'member'
);

export const selectMember = createSelector(
  selectMemberState,
  (state: MemberState) => state
);

export const selectMemberMembers = createSelector(
  selectMember,
  (state: MemberState) => state.members
);

export const selectCurrentMemberMembers = (id: string) => {
  return createSelector(
    selectMemberMembers,
    (state: Member[]) => state.find(r => r.id === id)
  );
};
