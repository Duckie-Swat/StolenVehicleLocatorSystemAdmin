import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

import {
  LOST_VEHICLE_REQUESTS_ENDPOINT,
  LIST_PAGINATED_LOST_VEHICLE_REQUESTS_ENDPOINT,
} from '../../constants/apiEndpointConstants';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  lostVehicleRequests: [],
  totalItems: 0,
  totalPages: 0,
  desc: true,
  page: 1,
  limit: 5,
  keyword: '',
  orderProperty: 'createdAt',
};

const slice = createSlice({
  name: 'lostVehicleRequests',
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
    // GET LostVehicleRequest
    getLostVehicleRequestsSuccess(state, action) {
      state.isLoading = false;
      state.lostVehicleRequests = action.payload.items;
      state.page = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },

    createLostVehicleRequestSuccess(state, action) {
      state.isLoading = false;
      state.lostVehicleRequests = [action.payload, ...state.lostVehicleRequests];
      state.totalItems += 1;
      state.totalPages = Math.ceil(state.totalItems / state.limit);
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
  },
});

// Reducer
export default slice.reducer;

// Actions

export const { setPage, setLimit, setKeyword, setOrderDesc, setOrderProperty, setConnection } = slice.actions;

export function getLostVehicleRequest(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(LIST_PAGINATED_LOST_VEHICLE_REQUESTS_ENDPOINT, {
        params,
      });
      dispatch(slice.actions.getLostVehicleRequestsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function createPostVehicleRequest(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(LOST_VEHICLE_REQUESTS_ENDPOINT, params);
      dispatch(slice.actions.createLostVehicleRequestSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
