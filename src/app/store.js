import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import NotificationReducer from "../features/notifications/NotificationSlice"
import ProfileReducer from "../features/auth/ProfileSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    notifications: NotificationReducer,
    profile: ProfileReducer
  },
});
