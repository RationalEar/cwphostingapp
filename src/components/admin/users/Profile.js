import React, {useCallback, useEffect, useState} from "react";
import Breadcrumbs from "../../misc/Breadcrumbs";
import ViewProfile from "../ViewProfile";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

function Profile(){
	const [loaded, setLoaded] = useState(false)
	const [user, setUser] = useState()
	const [edit, setEdit] = useState('wait')
	
	const getProfile = useCallback(()=>{
		window.axios.get('profile')
			.then(response=>{
				setUser(response.data)
				setEdit('view')
			})
	},[])
	
	useEffect(()=>{
		if(!loaded){
			setLoaded(true)
			getProfile()
		}
	}, [loaded, getProfile])
	
	const getView = () => {
		switch (edit){
			case 'edit' : return <EditProfile user={user} setEdit={setEdit} />
			case 'password' : return <ChangePassword setEdit={setEdit} />
			case 'view' : return <ViewProfile user={user} onEditUser={()=>setEdit('edit')} setEdit={setEdit} />
			default : return <div>Please wait...</div>
		}
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'User Management'} title={'My Profile'} />
			{getView()}
		</React.Fragment>
	)
}

export default Profile