import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/user';
import authReducer from './slices/auth';
import lostVehicleRequestReducer from './slices/lostVehicleRequest';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  lostVehicleRequest: lostVehicleRequestReducer,
});

export { rootPersistConfig, rootReducer };
