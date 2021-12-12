import React, {useState} from 'react';
import GuestLayout from "../../app/layouts/GuestLayout";
// import AuthService from "../../features/auth/AuthService";
import {Form, Alert, InputGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useFormik} from "formik";
import * as yup from 'yup'
// import {SetMessage} from "../../helpers/general";

function CreateAccount(props) {
	
	const [passwordType, setPasswordType] = useState('password')
	const [alert, showAlert] = useState(false)
	


	const togglePassword = (event) => {
		event.preventDefault()
		setPasswordType((prevState => {
			return prevState === 'password' ? 'text' : 'password'
		}))
	}
	
	const handleSubmit = (form) => {
		window.axios.post( 'register', form )
			.then( response => {
				console.log(response)
				// SetMessage( "User account created successfully", "success" )
				showAlert("User account created successfully. Please proceed to login.")
				//AuthService.createSession(form.username, response.data.token)
			})
			.catch( ( error, xhr ) => {
				console.log('This is the response:')
				if (error.response) {
					console.log(error.response.data);
					const msg = error.response.data.message
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
	
	const schema = yup.object().shape({
		firstName: yup.string().required().min(2, 'A name should have at least 2 characters'),
		lastName: yup.string().required().min(2, 'A name should have at least 2 characters'),
		email: yup.string().email().required(),
		//username: yup.string().required().min(4, 'A username should have at least 4 characters'),
		password: yup.string().required()
			.min(8, 'should have at least 8 characters')
			.matches(/[a-z]+/, 'Must contain at least one lowercase character')
			.matches(/[A-Z]+/, 'Must contain at least one upper case character')
			.matches(/\d+/, 'Password should contain at least one digit')
			.matches(/[!@#$%^&{}|?()<>,~_-]/, 'Password should contain at least one special character'),
		confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
		terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
	});
	
	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			terms: false
		},
		validationSchema: schema,
		onSubmit: values => {
			handleSubmit(values)
		},
	});
	
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
											<h3 className="">Sign up</h3>
											<p>Already have an account? <Link to={'/login'} >Sign in here</Link></p>
										</div>
										
										<div className="login-separater text-center mb-4">
											<span>SIGN UP WITH EMAIL</span>
											<hr/>
											{alert && <Alert className="text-start" variant="danger" onClose={() => showAlert(false)} dismissible>
												<Alert.Heading as={'h5'}>Unable to create account</Alert.Heading>
												<p className="mb-0">{alert}</p>
											</Alert>}
										</div>
										<div className="form-body">
											<Form noValidate className="row g-3" onSubmit={formik.handleSubmit}>
												<Form.Group className="col-12">
													<label htmlFor="firstName" className="form-label">First Name</label>
													<Form.Control id="firstName" name="firstName" type="text"
														   onChange={formik.handleChange} value={formik.values.firstName}
														   isInvalid={!!formik.errors.firstName}/>
													<Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback>
												</Form.Group>
												<Form.Group className="col-12">
													<label htmlFor="firstName" className="form-label">Last Name</label>
													<Form.Control id="lastName" name="lastName" type="text" 
														   onChange={formik.handleChange} value={formik.values.lastName} isInvalid={!!formik.errors.lastName}/>
													<Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
												</Form.Group>
												<Form.Group className="col-12">
													<label htmlFor="emailAddress" className="form-label">Email Address</label>
													<Form.Control type="email" name="email" id="emailAddress" autoComplete="email"
														   onChange={formik.handleChange} value={formik.values.email} isInvalid={!!formik.errors.email}/>
													<Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
												</Form.Group>
												<Form.Group controlId="inputChoosePassword" className="col-12">
													<Form.Label>Create Password</Form.Label>
													<InputGroup hasValidation id="show_hide_password">
														<Form.Control type={passwordType} name="password"
															value={formik.values.password} isInvalid={!!formik.errors.password} onChange={formik.handleChange}
															autoComplete="new-password"
														/>
														<InputGroup.Text className="bg-transparent" onClick={togglePassword}>
															{passwordType === 'text' ? <i className='bx bx-hide'/> : <i className='bx bx-show'/>}
														</InputGroup.Text>
														<Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
													</InputGroup>
												</Form.Group>
												<Form.Group className="col-12">
													<label htmlFor="inputConfirmPassword" className="form-label">Confirm Password</label>
													<Form.Control type="password" name="confirmPassword"
														   id="inputConfirmPassword" required autoComplete="new-password"
														   placeholder="Confirm Password" onChange={formik.handleChange}
														   value={formik.values.confirmPassword} isInvalid={!!formik.errors.confirmPassword}
													/>
													<Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
												</Form.Group>
												<Form.Group controlId="inputTerms" className="col-12">
													<Form.Check type="switch" name="terms"
														id="terms" checked={formik.values.terms}
														onChange={formik.handleChange} value={1} isInvalid={!!formik.errors.terms}
														label="I accept the website terms and conditions"
														feedback="You must agree to the terms before submitting."/>
												</Form.Group>
												<div className="col-md-6 text-end">
													Already have an account? <Link to="/login">Login here</Link>
												</div>
												<Form.Group className="col-12">
													<div className="d-grid">
														<button type="submit" className="btn btn-primary">
															<i className="bx bxs-lock-open"/>Create Account
														</button>
													</div>
												</Form.Group>
											</Form>
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

export default CreateAccount;