import { AppState } from '@app/core';

export interface Member {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  enlistment?: string;
  gender?: 'female' | 'male' | 'unknown';
}

export interface MemberState {
  members: Member[];
}

export interface State extends AppState {
  member: MemberState;
}
