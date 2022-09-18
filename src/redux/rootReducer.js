import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/user';
import authReducer from './slices/auth';
import lostVehicleRequestReducer from './slices/lostVehicleRequest';
import cameraReducer from './slices/camera';

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
  camera: cameraReducer,
});

export { rootPersistConfig, rootReducer };
