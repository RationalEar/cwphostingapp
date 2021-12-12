import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import NotificationReducer from "../features/notifications/NotificationSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    notifications: NotificationReducer
  },
});
