import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { campsitesReducer } from '../features/campsites/campsitesSlice';
import { hikesReducer } from '../features/hikes/hikesSlice';
import { overlooksReducer } from '../features/overlooks/overlooksSlice';
import { campsitesCommentsReducer } from '../features/campsites/campsitesCommentsSlice';
import { hikesCommentsReducer } from '../features/hikes/hikesCommentsSlice';
import { overlooksCommentsReducer } from '../features/overlooks/overlooksCommentsSlice';


export const store = configureStore({
  reducer: {
      campsites: campsitesReducer,
      hikes: hikesReducer,
      overlooks: overlooksReducer,
      campsitescomments: campsitesCommentsReducer,
      hikescomments: hikesCommentsReducer,
      overlookscomments: overlooksCommentsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger])
});
