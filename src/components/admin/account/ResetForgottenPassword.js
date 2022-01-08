import React, {useState} from 'react';
import GuestLayout from "../../../app/layouts/GuestLayout";
import {Alert} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {get_axios_error} from "../../../helpers/general";

function ResetForgottenPassword() {
	const { token } = useParams();
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [alert, setAlert] = useState({show:false, message:'', variant: 'info', heading: 'Account Activation'})
	
	const passwordChanged = (event) => {
		setPassword(event.target.value)
	}
	
	const confirmPasswordChanged = (event) => {
		setConfirmPassword(event.target.value)
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
		
		if(!token) {
			showAlert("A valid password reset token is required")
			return false;
		}
		
		const form = {password: password, confirmPassword: confirmPassword, token: token}
		
		window.axios.post( 'user/reset-password', form )
			.then( response => {
				console.log(response)
				showAlert(response.data.message, 'info')
			})
			.catch( ( error ) => {
				const e = get_axios_error(error);
				showAlert(e.message, 'danger')
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
											<h3 className="">Reset Forgotten Password</h3>
											<p className="mb-1">Already have an account? <Link to={'/login'}>Sign in here</Link></p>
											<p>Don't have an account yet? <Link to={'/create-account'}>Register here</Link></p>
										</div>
										<div className="form-body">
											<form className="row g-3" onSubmit={handleSubmit}>
												<div className="login-separater text-center mb-4">
													<span>Enter your new password below</span>
													<hr/>
													{alert.show && <Alert className="text-start" variant={alert.variant} onClose={() => hideAlert()} dismissible>
														<Alert.Heading as={'h5'}>Reset Forgotten Password</Alert.Heading>
														<p className="mb-0">{alert.message}</p>
													</Alert>}
												</div>
												<div className="col-12">
													<label htmlFor="inputNewPassword" className="form-label">New Password</label>
													<input type="password" className="form-control" id="inputNewPassword"
														   placeholder="New Password" autoComplete="off"
														   onChange={passwordChanged} value={password} required/>
												</div>
												
												<div className="col-12">
													<label htmlFor="inputConfirmPassword" className="form-label">Confirm Password</label>
													<input type="password" className="form-control" id="inputConfirmPassword"
														   placeholder="Confirm New Password" autoComplete="off"
														   onChange={confirmPasswordChanged} value={confirmPassword} required/>
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

export default ResetForgottenPassword;