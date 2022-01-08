import { createSlice } from '@reduxjs/toolkit'
import AuthService from "./AuthService";

export const ProfileSlice = createSlice({
	name: 'profile',
	initialState: {
		role: {name: AuthService.getProfile(), alias: ''},
		roles: [],
		username: '',
		firstName: '',
		lastName: '',
		email: ''
	},
	reducers: {
		switchProfile: (state, action) => {
			const role = state.roles.find(r => r.name === action.payload)
			if(role){
				localStorage.setItem('profile', role.name)
				state.role = role;
			}
		},
		setupUser: (state, action) => {
			const data = action.payload
			if(data.roles){
				const roles = data.roles.map(role => role.name)
				if( !roles.includes(state.role.name) ){
					const defaultRole = AuthService.setupProfile(roles)
					const role = data.roles.find(r => r.name === defaultRole)
					if(role) state.role =role;
					// state.roles = roles
				}
			}
			state.roles = data.roles
			state.email = data.email
			state.firstName = data.firstName
			state.lastName = data.lastName
			state.username = data.username
			state.id = data.id
			state.phoneNumber = data.phoneNumber
			state.suspended = data.suspended
		}
	},
})

// Action creators are generated for each case reducer function
export const { switchProfile, setupUser} = ProfileSlice.actions
export default ProfileSlice.reducer