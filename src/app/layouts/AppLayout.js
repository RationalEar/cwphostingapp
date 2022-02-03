import React from 'react';
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import MainContent from "../../components/admin/MainContent";
import Footer from "../../components/admin/Footer";
import Notifications from "../../components/common/Notifications";
import AuthService from "../../features/auth/AuthService";
import {useDispatch, useSelector} from "react-redux";
import {switchProfile} from "../../features/auth/ProfileSlice";
import {Button, Container, Row} from "react-bootstrap";
import {manualToggle} from "../../features/General";
import ClientHeader from "../../components/client/ClientHeader";
import ClientFooter from "../../components/client/ClientFooter";
import "../../App.css"

function AppLayout(props) {
	
	const dispatch = useDispatch()
	const profile = useSelector((state) => state.profile)
	
	const logout = (event) => {
		event.preventDefault()
		AuthService.destroySession()
		props.history.push('/login')
	}
	
	const storedProfile = AuthService.getProfile()
	if( profile.role.name !== storedProfile ){
		//dispatch(switchProfile(storedProfile))
		console.log("please update stored profile")
	}
	
	if(profile.role.name==='ADMIN' || profile.role.name==='SUPER_ADMIN') {
		return (
			<React.Fragment>
				<Sidebar/>
				<Header {...props} />
				<MainContent profile={profile}/>
				<div className="overlay toggle-icon" onClick={()=>dispatch(manualToggle())}/>
				<Footer/>
				<Notifications/>
			</React.Fragment>
		)
	}
	else if(profile.role.name==='MANAGER') {
		return (
			<Container className={'client bg-white'}>
				<Row>
					<ClientHeader {...props} />
					<MainContent profile={profile} style={{marginLeft:'0'}}/>
				</Row>
				<ClientFooter />
				<Notifications/>
			</Container>
		)
	}
	else{
		return (
			<div className="m-5">
				<h2>{profile.role.alias ? profile.role.alias : profile.role.name} view is currently not available</h2>
				<div className="my-5">
					<h3>Try a different Profile</h3>
					{profile.roles.map(role=>{
						return (
							<Button key={role.name} variant={"outline-secondary"} className="me-2" type="button" onClick={()=>dispatch(switchProfile(role.name))}>
								{role.alias?role.alias:role.name}
							</Button>
						)
					})}
				</div>
				<p>
					<Button variant={'secondary'} onClick={logout}>Login with a different account</Button>
				</p>
			</div>
		)
	}
}

export default AppLayout;