import { createSlice } from '@reduxjs/toolkit'
import { v4  } from "uuid"

export const NotificationSlice = createSlice({
	name: 'notifications',
	initialState: [],
	reducers: {
		setError: (state, action) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			state.push({ id: v4(), flag: 'danger', message: action.payload })
		},
		setWarning: (state, action) => {
			state.push({ id: v4(), flag: 'warning', message: action.payload })
		},
		setInfo: (state, action) => {
			state.push({ id: v4(), flag: 'info', message: action.payload })
		},
		setSuccess: (state, action) => {
			state.push({ id: v4(), flag: 'success', message: action.payload })
		},
		removeToast: (state, action) => {
			// console.log(action)
			const index = state.findIndex( item => item.id === action.payload )
			if( index >= 0) state.splice( index, 1 )
		},
		setMessage: (state, action) => {
			switch (action.type){
				case "setError" :
					state.push({ id: v4(), flag: 'danger', message: action.payload })
					return state
				case "setWarning" :
					state.push({ id: v4(), flag: 'warning', message: action.payload })
					return state
				case "setInfo" :
					state.push({ id: v4(), flag: 'info', message: action.payload })
					return state
				case "setSuccess" :
					state.push({ id: v4(), flag: 'success', message: action.payload })
					return state
				case "removeLastToast":
					state.pop()
					return state
				case "removeThisToast":
					const index = state.findIndex( item => item.id === action.payload )
					if( index instanceof Number) state.splice( index, 1 )
					return state
				case "removeAllToasts":
					state = [];
					return state
				default:
					return state
			}
		},
	},
})

// Action creators are generated for each case reducer function
export const { setError, setWarning, setMessage, setInfo, setSuccess, removeToast } = NotificationSlice.actions

export default NotificationSlice.reducer