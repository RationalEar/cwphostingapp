import React, {useEffect, useState} from 'react';
import AuthService from "./AuthService";
import {Redirect, Route} from "react-router-dom";
import PleaseWait from "../../components/account/PleaseWait";

function AuthenticatedRoute(props) {
	//const loggedIn = AuthService.isLoggedIn();
	/*
	if(loggedIn) return <Route {...props} />
	else{
		const token = await AuthService.refreshToken()
		return token===false ? <Redirect to="/login" /> : <Route {...props} />
	}*/
	const [loggedIn, setLoggedIn] = useState('wait')
	
	
	useEffect(()=>{
		if(loggedIn==='wait'){
			// check if user is already logged in
			let tokenExists = AuthService.isLoggedIn();
			if(!tokenExists) {
				// check refresh token
				const refreshToken = AuthService.getRefreshToken()
				if (!refreshToken) setLoggedIn(false)
				else {
					// attempt refresh
					tryRefreshToken()
				}
			}
			else setLoggedIn(tokenExists)
		}
		else setLoggedIn(AuthService.isLoggedIn)
	},[loggedIn])
	
	
	const tryRefreshToken = async function(){
		const accessToken = await AuthService.refreshToken()
		if(accessToken) setLoggedIn(true)
		else setLoggedIn(false)
	}
	
	if( loggedIn === true ) return <Route {...props} />
	else if( loggedIn === 'wait' ) return <PleaseWait />
	else return <Redirect to="/login" />
}

export default AuthenticatedRoute;