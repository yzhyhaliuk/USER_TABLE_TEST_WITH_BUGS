import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Filters, User, UsersState } from '../types/types';
import { API_URL, FETCH_STATUS } from '../constants/constants.ts';

const initialState: UsersState = {
  users: [],
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
  },
  status: FETCH_STATUS.IDLE,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get<User[]>(API_URL);

  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ field: keyof Filters; value: string }>) {
      const { field, value } = action.payload;

      state.filters[field] = value;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = FETCH_STATUS.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = FETCH_STATUS.SUCCESS;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, state => {
        state.status = FETCH_STATUS.FAILED;
      });
  },
});

export const { setFilter } = usersSlice.actions;
export default usersSlice.reducer;
