import React, {useCallback, useEffect, useState} from 'react';
import AuthService from "../../features/auth/AuthService";
import {Container, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {setupUser, switchProfile} from "../../features/auth/ProfileSlice";
import {NavLink} from "react-router-dom";

function ClientHeader(props) {
	const dispatch = useDispatch()
	const profile = useSelector((state) => state.profile)
	const [loadProfile, setLoadProfile] = useState(true)
	
	const switchRole = (event,role) => {
		event.preventDefault()
		dispatch(switchProfile(role))
	}
	
	const getUserProfile = useCallback(() => {
		window.axios.get('/profile')
			.then(response => {
				if(response.data && response.data.id){
					dispatch(setupUser(response.data))
				}
				else{
					console.log(response)
				}
			})
			.catch(error=>{
				console.log(error)
			})
	},[dispatch])
	
	const logout = (event) => {
		event.preventDefault()
		AuthService.destroySession()
		props.history.push('/login')
	}
	
	useEffect(()=>{
		if( loadProfile ){
			setLoadProfile(false)
			getUserProfile()
		}
	},[loadProfile, getUserProfile])
	
	return (
		<Navbar className="navbar-expand-lg navbar-light bg-white rounded rounded-0 shadow-sm"
				collapseOnSelect expand="md">
				<Container>
					<NavLink to={'/'} className="navbar-brand">
						<img src={'/assets/images/logo-icon.png'} width="140" className="logo-icon" alt="logo icon"/>
					</NavLink>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse  id="responsive-navbar-nav">
						<Nav className="navbar-nav ms-auto mb-2 mb-lg-0">
							<Nav.Item>
								<NavLink to={'/'} className="nav-link" aria-current="page"><i className='bx bx-home-alt me-1'/>Home</NavLink>
							</Nav.Item>
							{profile.role.name==='MANAGER' && <React.Fragment>
								<Nav.Item>
									<NavLink to={'/properties'} className="nav-link"><i className='bx bx-building me-1'/>My Properties</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink to={'/leases'} className="nav-link"><i className='bx bx-file me-1'/>My Leases</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink to={'/orders'} className="nav-link"><i className='bx bx-list-ul me-1'/>My Orders</NavLink>
								</Nav.Item>
							</React.Fragment>}
							{/*<Nav.Item>
								<NavLink to={'/contact'} className="nav-link"><i className='bx bx-microphone me-1'/>Contact</NavLink>
							</Nav.Item>*/}
							<Nav.Item>
								<NavDropdown title={profile.firstName}>
									<Dropdown.Toggle as={"a"} role="button" className="nav-link dropdown-toggle-nocaret">
										<span className="user-img">
											<i className='bx bx-user me-1'/> {profile.firstName}
										</span>
									</Dropdown.Toggle>
									<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-end" data-bs-poper="none">
										<li><NavLink to={'/profile'} className="dropdown-item"><i className="bx bx-user"/><span>Profile</span></NavLink></li>
										<li><div className="dropdown-divider mb-0"/></li>
										<li className="mt-1">
											<Dropdown>
												<Dropdown.Toggle as={'span'} role="button" className="dropdown-item">
													<i className="bx bx-street-view"/><span>Switch View</span>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													{profile.roles.map(role=> {
														return <Dropdown.Item key={role.name} onClick={(event) => switchRole(event,role.name)}>
															{role.alias ? role.alias : role.name}
														</Dropdown.Item>
													})}
												</Dropdown.Menu>
											</Dropdown>
										
										</li>
										<li><div className="dropdown-divider mb-0"/></li>
										<li><a className="dropdown-item" href="/" onClick={logout}><i className="bx bx-log-out-circle"/><span>Logout</span></a></li>
									</Dropdown.Menu>
								</NavDropdown>
							</Nav.Item>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
	);
}

export default ClientHeader;