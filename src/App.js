import React from 'react';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/promise';
import {BrowserRouter as Router,Route, Switch} from "react-router-dom";
import Login from "./components/admin/account/Login";
import AuthService from "./features/auth/AuthService";
import AuthenticatedRoute from "./features/auth/AuthenticatedRoute";
import axios from "axios";
import CreateAccount from "./components/admin/account/CreateAccount";
import ResendActivationToken from "./components/admin/account/ResendActivationToken";
import ActivateAccount from "./components/admin/account/ActivateAccount";
import ResetForgottenPasswordRequest from "./components/admin/account/ResetForgottenPasswordRequest";
import ResetForgottenPassword from "./components/admin/account/ResetForgottenPassword";

window.axios = axios

window.axios.defaults.baseURL = window.env.API_URL
window.axios.defaults.withCredentials = false
AuthService.setAxiosBearerHeader()
AuthService.setAxiosResponseInterceptor()

const AppLayout = React.lazy(() => import('./app/layouts/AppLayout') )

const loading = (
	<div className="py-5 text-center">
		<div className="spinner-grow" style={{width: "3rem", height: "3rem"}} role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	</div>)

function App() {
	return (
		<div className="wrapper">
			<Router>
				<React.Suspense fallback={loading}>
					<Switch>
						<Route exact path="/login" name="Login Page" render={ props => <Login {...props} /> } />
						<Route exact path="/resend-activation-token" name="Activation Page" render={ props => <ResendActivationToken {...props} /> } />
						<Route exact path="/forgot-password" name="Forgotten Password Page" render={ props => <ResetForgottenPasswordRequest {...props} /> } />
						<Route exact path="/user/reset-password/:token" name="Password Reset Page" render={ props => <ResetForgottenPassword {...props} /> } />
						<Route exact path="/user/confirm-account/:token" name="Activation Page" render={ props => <ActivateAccount {...props} /> } />
						<Route exact path="/create-account" name="Registration Page" render={ props => <CreateAccount {...props} /> } />
						<AuthenticatedRoute path="/" name="Dashboard" render={props => <AppLayout {...props}/>}/>
					</Switch>
				</React.Suspense>
			</Router>
		</div>
	);
}

export default App;
