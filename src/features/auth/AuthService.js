import jwt_decode from "jwt-decode";
import axios from "axios";
// import {useDispatch} from "react-redux";

class AuthService{
	
	requestInterceptor = null
	responseInterceptor = null
	
	// const dispatch = useDispatch()
	
	createSession( username, tokens, remember ){
		const decoded = jwt_decode(tokens.accessToken);
		console.log(decoded)
		sessionStorage.setItem( 'user', username )
		sessionStorage.setItem('accessToken', tokens.accessToken)
		sessionStorage.setItem('accessExpires', decoded.exp)
		if(tokens.refreshToken) sessionStorage.setItem('refreshToken', tokens.refreshToken)
		
		if(remember){
			localStorage.setItem('user', username)
			if(tokens.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken)
		}
		this.setupProfile(decoded.roles)
		this.setAxiosBearerHeader()
		this.setAxiosResponseInterceptor()
	}
	
	setupProfile(roles){
		if(roles){
			if(roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')){
				localStorage.setItem('profile', 'ADMIN')
			}
			else if( roles.includes('MANAGER') ){
				localStorage.setItem('profile', 'MANAGER')
			}
			else if( roles.includes('USER') ){
				localStorage.setItem('profile', 'USER')
			}
			else{
				localStorage.setItem('profile', 'GUEST')
			}
		}
		else{
			localStorage.setItem('profile', 'GUEST')
		}
		return localStorage.getItem('profile')
	}
	
	getProfile(){
		return localStorage.getItem('profile') || 'GUEST'
	}
	
	setProfile(profile){
		localStorage.setItem( 'profile', profile )
	}
	
	destroySession(){
		sessionStorage.removeItem('user')
		sessionStorage.removeItem('accessToken')
		sessionStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
		localStorage.removeItem('refreshToken')
	}
	
	static checkLocalStorage(key){
		const value = localStorage.getItem(key)
		if(value) sessionStorage.setItem(key, value)
		return value
	}
	
	isLoggedIn(){
		const user = sessionStorage.getItem('user') || AuthService.checkLocalStorage('user')
		const token = sessionStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
		return !!(user && token)
	}
	
	getAccessToken(){
		return sessionStorage.getItem('accessToken')
	}
	
	getRefreshToken(){
		return sessionStorage.getItem('refreshToken') || AuthService.checkLocalStorage('refreshToken')
	}
	
	tokenExpired(name, token){
		let exp = sessionStorage.getItem(name);
		if(!exp){
			const decoded = jwt_decode(token)
			exp = decoded.exp;
		}
		
		if(exp){
			const curTime = new Date().getMilliseconds()/1000;
			return exp < curTime;
		}
		return true;
	}
	
	async refreshToken(){
		let vm = this
		let accessToken = false
		let refreshToken = vm.getRefreshToken()
		
		if(refreshToken && !this.tokenExpired('refreshToken', refreshToken)){
			//console.log("refresh token found, refreshing...")
			//console.log(refreshToken)
			const uninterceptedAxiosInstance = axios.create();
			uninterceptedAxiosInstance.defaults.headers.authorization = "Bearer "+refreshToken
			await uninterceptedAxiosInstance.get('/token/refresh')
				.then(function (response) {
					sessionStorage.setItem('accessToken', response.data.accessToken)
					vm.setAxiosBearerHeader(response.data.accessToken)
					accessToken = response.data.accessToken
					//console.log("New access token: ",accessToken)
					return accessToken
				})
				.catch(function (error) {
					console.log(error);
					console.log("redirect...")
					window.location.href = window.env.BASE_URL+'/login'
					return accessToken;
				})
		}
		else{
			console.log('no refresh token found or refresh token expired')
			return accessToken;
		}
		return accessToken;
	}
	
	setAxiosBearerHeader(accessToken=false){
		const token = accessToken ? accessToken : this.getAccessToken()
		const vm = this
		if(this.isLoggedIn() && token){
			if(vm.requestInterceptor != null) window.axios.interceptors.request.eject(vm.requestInterceptor)
			vm.requestInterceptor = window.axios.interceptors.request.use(function (config) {
				config.headers.authorization = 'Bearer '+token
				return config;
			}, function (error) {
				// Do something with request error
				return Promise.reject(error);
			});
		}
	}
	
	setAxiosResponseInterceptor(){
		//console.log("Response interceptor set");
		const vm = this
		if(vm.responseInterceptor !=null ) window.axios.interceptors.response.eject(vm.responseInterceptor)
		vm.responseInterceptor = window.axios.interceptors.response.use((response) => {
			//console.log("Normal response interceptor")
			return response
		}, async function (error) {
			//console.log("response intercepted on error")
			const originalRequest = error.config;
			if (error.response.status === 403 && !originalRequest._retry && originalRequest.url !== 'login') {
				const newAxiosInstance = axios.create();
				originalRequest._retry = true;
				const access_token = await vm.refreshToken()
				//console.log("Access token after refresh: ",access_token)
				if(!access_token) return Promise.reject(error)
				newAxiosInstance.defaults.headers.authorization = 'Bearer ' + access_token;
				originalRequest.headers.authorization = 'Bearer ' + access_token;
				//window.axios.defaults.headers.authorization = 'Bearer ' + access_token;
				vm.setAxiosBearerHeader(access_token)
				//console.log(window.axios.interceptors.request)
				return newAxiosInstance(originalRequest);
			}
			return Promise.reject(error);
		});
	}
}

export default new AuthService()