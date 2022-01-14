import { createSlice } from '@reduxjs/toolkit'

export const GeneralSlice = createSlice({
	name: 'general',
	initialState: {
		wrapperToggled: false,
		manualToggled: false,
		mobileToggled: false
	},
	reducers: {
		mobileToggle: (state) => {
			if(state.mobileToggled){
				state.wrapperToggled = false
				state.mobileToggled = false
			}
			else{
				state.wrapperToggled = true
				state.mobileToggled = true
			}
		},
		manualToggle: (state) => {
			if(state.manualToggled && !state.mobileToggled){
				state.wrapperToggled = false
				state.manualToggled = false
			}
			else if (!state.mobileToggled){
				state.wrapperToggled = true
				state.manualToggled = true
			}
			else if(state.mobileToggled){
				state.wrapperToggled = false
				state.mobileToggled = false
			}
		},
		hoverOpen: (state) => {
			if(state.manualToggled) state.wrapperToggled = false
		},
		hoverClose: (state) => {
			if(state.manualToggled) state.wrapperToggled = true
		}
	},
})

// Action creators are generated for each case reducer function
export const { mobileToggle, manualToggle, hoverOpen, hoverClose } = GeneralSlice.actions

export default GeneralSlice.reducer