import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

import { LIST_PAGINATED_USERS_ENDPOINT } from '../../constants/apiEndpointConstants';

const initialState = {
  users: null,
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  desc: false,
  page: 1,
  limit: 20,
  keyword: '',
  orderProperty: '',
  isDeleted: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload.items;
      state.page = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },

    // Paginate
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setOrderDesc(state, action) {
      state.desc = action.payload;
    },
    setOrderProperty(state, action) {
      state.orderProperty = action.payload;
    },
    setIsDeleted(state, action) {
      state.isDeleted = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions

export const { setPage, setLimit, setKeyword, setOrderDesc, setOrderProperty, setIsDeleted } = slice.actions;

export function getUsers(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(LIST_PAGINATED_USERS_ENDPOINT, {
        params,
      });
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
