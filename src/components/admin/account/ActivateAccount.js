import React, {useCallback, useEffect, useState} from 'react';
import GuestLayout from "../../../app/layouts/GuestLayout";
import {Alert} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {get_axios_error} from "../../../helpers/general";

function ActivateAccount() {
	const { token } = useParams();
	const [alert, setAlert] = useState({show:false, message:'', variant: 'info', heading: 'Account Activation'})
	const [done, setDone] = useState(false)
	
	const activateAccount = useCallback (()=>{
		window.axios.get("user/confirm-account/"+token)
			.then( response => {
				console.log(response)
				showAlert(response.data.message, 'info')
			})
			.catch( ( error ) => {
				const e = get_axios_error(error)
				showAlert(e.message, 'danger')
			})
	},[token])
	
	useEffect( () => {
		if(!done){
			setDone(true)
			activateAccount()
		}
	},[activateAccount, done] )
	
	const showAlert = (message, variant, heading=false) => {
		const data = {show:true, variant: variant, message: message}
		if(heading) data.heading = heading
		setAlert(data)
	}
	
	const hideAlert = () => {
		setAlert({show: false})
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
											<h3 className="">Activate User Account</h3>
											<p>Forgot your account password? <Link to={'/create-account'}>Reset password here</Link></p>
											
											{alert.show && <Alert className="text-start" variant={alert.variant} onClose={() => hideAlert()} dismissible>
												<Alert.Heading as={'h5'}>Account Activation</Alert.Heading>
												<p className="mb-0">{alert.message}</p>
											</Alert>}
											
											{alert.show===false ? <p><img src={'/assets/images/icons/loading.svg'} alt="please wait..."/></p> :
												<div>
													<Link to={'/login'} className="btn btn-block my-4 shadow-sm btn-white" >
														<span className="d-flex justify-content-center align-items-center">
															<i className="bx bxs-lock-open" />Sign in here
														</span>
													</Link>
													&nbsp;&nbsp;&nbsp;
													<Link to={'/resend-activation-token'} className="btn btn-block my-4 shadow-sm btn-white">
														<span className="d-flex justify-content-center align-items-center">
															<i className="bx bxs-envelope" />Resend activation token
														</span>
													</Link>
												</div>
											}
											
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

export default ActivateAccount;