import React, {useState} from 'react';
import GuestLayout from "../../app/layouts/GuestLayout";
import AuthService from "../../features/auth/AuthService";
// import {SetMessage, get_axios_error} from "../../helpers/general";
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";

function Login(props) {
	
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [remember, setRemember] = useState(false)
	const [passwordType, setPasswordType] = useState('password')
	const [alert, showAlert] = useState(false)
	
	const usernameChanged = (event) => {
		setUsername(event.target.value)
	}
	
	const passwordChanged = (event) => {
		setPassword(event.target.value)
	}
	
	const rememberChanged = (event) => {
		setRemember(event.target.checked)
	}
	
	const togglePassword = (event) => {
		event.preventDefault()
		setPasswordType((prevState => {
			return prevState === 'password' ? 'text' : 'password'
		}))
	}
	
	const handleSubmit = (event) => {
		event.preventDefault()
		const form = {username: username, password: password}
		
		window.axios.post( 'authenticate', form )
			.then( response => {
				console.log(response)
				//SetMessage( "Auth request success", "success" )
				AuthService.createSession(form.username, response.data.token);
				props.history.push("/")
			})
			.catch( ( error, xhr ) => {
				console.log('This is the response:');
				if (error.response) {
					console.log(error.response.data);
					const msg = error.response.data
					if( msg === 'INVALID_CREDENTIALS' ){
						showAlert('Please check your username/password and try again')
					}
					else {
						showAlert(msg)
					}
				}
				else if (error.request) {
					console.log(error.request);
					showAlert('There was a problem connecting to the server.')
				}
				else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
					showAlert(error.message)
				}
				
			})
	}
	
	return (
		<GuestLayout>
			<div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
				<div className="container-fluid">
					<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
						<div className="col mx-auto">
							<div className="mb-4 text-center">
								<img src={'/assets/images/logo-img.png'} width="180" alt=""/>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="p-4 rounded">
										<div className="text-center">
											<h3 className="">Sign in</h3>
											<p>Don't have an account yet? <Link to={'/create-account'}>Sign up here</Link></p>
										</div>
										<div className="d-grid">
											<a className="btn my-4 shadow-sm btn-white" href="#!">
												<span className="d-flex justify-content-center align-items-center">
                         		 					<img className="me-2" src={'/assets/images/icons/search.svg'}
														 width="16" alt="Description"/>
                          							<span>Sign in with Google</span>
												</span>
											</a>
											<a href="#!" className="btn btn-facebook"><i className="bx bxl-facebook"/>Sign
												in with Facebook</a>
										</div>
										<div className="login-separater text-center mb-4">
											<span>OR SIGN IN WITH EMAIL</span>
											<hr/>
											{alert && <Alert className="text-start" variant="danger" onClose={() => showAlert(false)} dismissible>
												<Alert.Heading as={'h5'}>Unable to login</Alert.Heading>
												<p className="mb-0">{alert}</p>
											</Alert>}
										</div>
										<div className="form-body">
											<form className="row g-3" onSubmit={handleSubmit}>
												<div className="col-12">
													<label htmlFor="inputEmailAddress" className="form-label">Email Address</label>
													<input type="email" className="form-control" id="inputEmailAddress"
														   placeholder="Email Address" autoComplete="username"
														   onChange={usernameChanged} value={username} required/>
												</div>
												<div className="col-12">
													<label htmlFor="inputChoosePassword" className="form-label">Enter
														Password</label>
													<div className="input-group" id="show_hide_password">
														<input type={passwordType} className="form-control border-end-0"
															   id="inputChoosePassword" required
															   placeholder="Enter Password" onChange={passwordChanged}
															   value={password} autoComplete={'current-password'}/>
														<a href="#!" className="input-group-text bg-transparent"
														   onClick={togglePassword}>
															{passwordType === 'text' ? <i className='bx bx-hide'/> :
																<i className='bx bx-show'/>}
														</a>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-check form-switch">
														<input className="form-check-input" type="checkbox"
															   id="flexSwitchCheckChecked" checked={remember}
															   onChange={rememberChanged} value={1}/>
														<label className="form-check-label"
															   htmlFor="flexSwitchCheckChecked">Remember Me</label>
													</div>
												</div>
												<div className="col-md-6 text-end">
													<a href={'/authentication-forgot-password.html'}>Forgot Password ?</a>
												</div>
												<div className="col-12">
													<div className="d-grid">
														<button type="submit" className="btn btn-primary">
															<i className="bx bxs-lock-open"/>Sign in
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</GuestLayout>
	);
}

export default Login;