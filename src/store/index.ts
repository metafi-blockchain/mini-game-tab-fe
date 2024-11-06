import { configureStore } from '@reduxjs/toolkit';
import counterDownInfiniteTap from './counterDownInfiniteTap';

const store = configureStore({
	reducer: {
		countdown: counterDownInfiniteTap,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
