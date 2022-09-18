import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { LIST_PAGINATED_CAMERAS_ENDPOINT } from '../../constants/apiEndpointConstants';

const initialState = {
  isLoading: false,
  error: null,
  cameras: [],
  totalItems: 0,
  totalPages: 0,
  desc: false,
  page: 1,
  limit: 5,
  keyword: '',
  orderProperty: '',
};

const slice = createSlice({
  name: 'camera',
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

    // GET CAMERAS
    getCamerasSuccess(state, action) {
      state.isLoading = false;
      state.cameras = action.payload.items;
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
  },
});

// Reducer
export default slice.reducer;
// Actions

export const { setPage, setLimit, setKeyword, setOrderDesc, setOrderProperty } = slice.actions;

export function getCameras(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(LIST_PAGINATED_CAMERAS_ENDPOINT, {
        params,
      });
      dispatch(slice.actions.getCamerasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
