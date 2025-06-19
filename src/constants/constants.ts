import type { Filters } from '../types/types.ts';

export const API_URL = 'https://jsonplaceholder.typicode.com/users';
export const FILTER_KEYS: (keyof Filters)[] = ['name', 'username', 'email', 'phone'];
export const FETCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;
