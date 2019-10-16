import { AppState } from '@app/core';

export interface Member {
  id?: string;
  firstName: string;
  lastName: string;
}

export interface MemberState {
  members: Member[];
}

export interface State extends AppState {
  member: MemberState;
}
