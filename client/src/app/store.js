import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { userReducer } from '../features/user/userSlice';
import { placesReducer } from '../features/places/placesSlice';

export const store = configureStore({
  reducer: {
      user: userReducer,
      places: placesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger])
});
