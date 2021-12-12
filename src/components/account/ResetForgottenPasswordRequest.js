import React, {useState} from 'react';
import GuestLayout from "../../app/layouts/GuestLayout";
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";

function ResetForgottenPasswordRequest() {
	
	const [username, setUsername] = useState('')
	const [alert, setAlert] = useState({show:false, message:'', variant: 'info', heading: 'Account Activation'})
	
	const usernameChanged = (event) => {
		setUsername(event.target.value)
	}
	
	const showAlert = (message, variant, heading=false) => {
		const data = {show:true, variant: variant, message: message}
		if(heading) data.heading = heading
		setAlert(data)
	}
	
	const hideAlert = () => {
		setAlert({show: false})
	}
	
	const handleSubmit = (event) => {
		event.preventDefault()
		const form = {username: username}
		
		window.axios.post( 'user/forgotten-password', form )
			.then( response => {
				console.log(response)
				showAlert(response.data.message, 'info')
			})
			.catch( ( error ) => {
				console.log('This is the response:');
				console.log('error ', error)
				if (error.response) {
					const response = error.response
					console.log(response);
					const msg = response.message
					if(response.status===502){
						showAlert( "Service currently unavailable. Please try again later", 'danger')
					}
					else {
						showAlert(msg, 'danger')
					}
				}
				else if (error.request) {
					console.log(error.request);
					showAlert('There was a problem connecting to the server.', 'danger')
				}
				else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error);
					showAlert("Service currently unavailable. Please try again later", 'danger')
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
											<h3 className="">Reset Forgotten Password Request</h3>
											<p className="mb-1">Already have an account? <Link to={'/login'}>Sign in here</Link></p>
											<p>Don't have an account yet? <Link to={'/create-account'}>Register here</Link></p>
										</div>
										<div className="form-body">
											<form className="row g-3" onSubmit={handleSubmit}>
												<div className="login-separater text-center mb-4">
													<span>Enter your email address below</span>
													<hr/>
													{alert.show && <Alert className="text-start" variant={alert.variant} onClose={() => hideAlert()} dismissible>
														<Alert.Heading as={'h5'}>Reset Forgotten Password Request</Alert.Heading>
														<p className="mb-0">{alert.message}</p>
													</Alert>}
												</div>
												<div className="col-12">
													<label htmlFor="inputEmailAddress" className="form-label">Email Address</label>
													<input type="email" className="form-control" id="inputEmailAddress"
														   placeholder="Email Address" autoComplete="username"
														   onChange={usernameChanged} value={username} required/>
												</div>
												
												<div className="col-12">
													<div className="d-grid">
														<button type="submit" className="btn btn-primary">
															<i className="bx bxs-send bx-rotate-270"/>Submit
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

export default ResetForgottenPasswordRequest;