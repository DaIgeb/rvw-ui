import { AppState } from '@app/core';

export interface Member {
  id?: string;
  name: string;
  distance: number;
  elevation: number;
}

export interface MemberState {
  members: Member[];
}

export interface State extends AppState {
  member: MemberState;
}
