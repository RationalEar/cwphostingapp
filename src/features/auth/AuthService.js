import jwt_decode from "jwt-decode";
import axios from "axios";

class AuthService{
	
	requestIntercepter = null
	responseIntercepter = null
	
	createSession( username, tokens ){
		const decoded = jwt_decode(tokens.accessToken);
		console.log("Decoded token: ")
		console.log(decoded)
		sessionStorage.setItem( 'user', username )
		sessionStorage.setItem('accessToken', tokens.accessToken)
		sessionStorage.setItem('accessExpires', decoded.exp)
		if(tokens.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken)
		this.setAxiosBearerHeader()
		this.setAxiosResponseInterceptor()
	}
	
	destroySession(){
		sessionStorage.removeItem('user')
		sessionStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}
	
	isLoggedIn(){
		const user = sessionStorage.getItem('user')
		const token = sessionStorage.getItem('accessToken')
		return !!(user && token)
	}
	
	getAccessToken(){
		return sessionStorage.getItem('accessToken')
	}
	
	getRefreshToken(){
		let refreshToken = sessionStorage.getItem('refreshToken')
		if(!refreshToken) refreshToken = localStorage.getItem('refreshToken')
		return refreshToken
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
			if(vm.requestIntercepter != null) window.axios.interceptors.request.eject(vm.requestIntercepter)
			vm.requestIntercepter = window.axios.interceptors.request.use(function (config) {
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
		if(vm.responseIntercepter !=null ) window.axios.interceptors.response.eject(vm.responseIntercepter)
		vm.responseIntercepter = window.axios.interceptors.response.use((response) => {
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