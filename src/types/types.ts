export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface Filters {
  name: string;
  username: string;
  email: string;
  phone: string;
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface UsersState {
  users: User[];
  filters: Filters;
  status: FetchStatus;
}
