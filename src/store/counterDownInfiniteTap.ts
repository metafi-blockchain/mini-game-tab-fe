import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CountdownState {
	timeLeft: number;
	firstLoad: boolean;
}

const initialState: CountdownState = {
	timeLeft: 0,
	firstLoad: true,
};

const counterDownInfiniteTap = createSlice({
	name: 'counterDownInfiniteTap',
	initialState,
	reducers: {
		setTimeLeft(state, action: PayloadAction<number>) {
			state.timeLeft = action.payload;
		},
		decrement(state) {
			if (state.timeLeft > 0) {
				state.timeLeft -= 1;
			}
		},
		reset(state) {
			state.timeLeft = 20;
		},
		setDontFirstLoad(state) {
			state.firstLoad = false
		}
	},
});

export const { setTimeLeft, decrement, reset, setDontFirstLoad } = counterDownInfiniteTap.actions;
export default counterDownInfiniteTap.reducer;
