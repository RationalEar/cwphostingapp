class AuthService{
	createSession( username, token ){
		sessionStorage.setItem( 'user', username )
		sessionStorage.setItem('token', token)
		this.setAxiosBearerHeader()
	}
	
	destroySession(){
		sessionStorage.removeItem('user')
		sessionStorage.removeItem('token')
	}
	
	isLoggedIn(){
		const user = sessionStorage.getItem('user')
		const token = sessionStorage.getItem('token')
		return !!(user && token)
		// return true
	}
	
	getAuthToken(){
		return sessionStorage.getItem('token')
	}
	
	setAxiosBearerHeader(){
		const token = this.getAuthToken()
		if(this.isLoggedIn() && token){
			window.axios.interceptors.request.use(function (config) {
				config.headers.authorization = 'Bearer '+token
				return config;
			}, function (error) {
				// Do something with request error
				return Promise.reject(error);
			});
		}
	}
}

export default new AuthService()