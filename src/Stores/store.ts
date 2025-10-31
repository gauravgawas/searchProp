import { configureStore,combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import authReducer from "./authSlice";

const persistConfig = {
  key: 'root', // Key to store in (e.g., 'root' in localStorage)
  storage:storageSession,    // The storage engine (using Local Storage here)
  // Optional: To use Session Storage instead, replace 'storage' with:
  // storage: require('redux-persist/lib/storage/session').default,
  
  // OPTIONAL: Whitelist specific slices you want to persist
  // whitelist: ['counter'], 
};
const rootReducer = combineReducers({
  auth: authReducer,
  // Add other slices here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 5. CRITICAL: Ignore these Redux Persist actions to avoid serialization warnings
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
// export default store;