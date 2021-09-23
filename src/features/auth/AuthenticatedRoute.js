import React from 'react';
import AuthService from "./AuthService";
import {Redirect, Route} from "react-router-dom";

function AuthenticatedRoute(props) {
	return AuthService.isLoggedIn() ? <Route {...props} /> : <Redirect to="/login" />
}

export default AuthenticatedRoute;