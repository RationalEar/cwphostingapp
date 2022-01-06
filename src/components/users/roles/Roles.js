import React, {useCallback, useEffect, useState} from "react";
import Breadcrumbs from "../../misc/Breadcrumbs";
import {Button, Spinner} from "react-bootstrap";
import {get_axios_error} from "../../../helpers/general";
import {setInfo, setWarning} from "../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import EditRole from "./EditRole";
import CreateRole from "./CreateRole";

function Roles(){
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [show, setShow] = useState(false)
	const [edit, setEdit] = useState(false)
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)
	const [items, setItems] = useState([])
	const [currentRole, setCurrentRole] = useState({})
	const [fetched, setFetched] = useState(false)
	
	const createRole = () => {
		setEdit(false)
		handleShow(true)
	}
	
	const editRole = (r) => {
		setEdit(true)
		setCurrentRole(r)
		handleShow(true)
	}
	
	const deleteRole = (r) => {
		const yes = window.confirm('Are you sure you want to delete the role '+r.name+'?')
		if(yes){
			window.axios.delete('roles', {params: {id: r.id}})
				.then(response => {
					// console.log(response.data)
					dispatch(setInfo(response.data.message))
					getRoles()
				})
				.catch(error => {
					console.log(error)
				})
		}
	}
	
	const getRoles = useCallback(()=>{
		setLoading(true)
		window.axios.get("roles")
			.then(response=>{
				setItems(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
			.finally(()=>{
				setFetched(true)
				setLoading(false)
			})
	},[dispatch])
	
	const reloadPage = () => {
		setFetched(false)
	}
	
	const onUpdateRole = r => {
		const list = JSON.parse(JSON.stringify(items))
		const index = list.findIndex( item => item.id === r.id )
		if (index >= 0) {
			setItems( prevState => {
				prevState[index] = r
				return prevState
			})
		}
	}
	
	const EditRoleModal = function (){
		if(currentRole){
			return (
				edit===true ? <EditRole role={currentRole} onHide={handleClose} show={show} updateRole={onUpdateRole} /> : null
			)
		}
		else return null
	}
	
	const CreateRoleModal = function (){
		return edit===false ? <CreateRole onRefresh={reloadPage} onHide={handleClose} show={show} /> : null
	}
	
	useEffect(()=>{
		if(!fetched){
			getRoles()
		}
	}, [getRoles, fetched])
	
	const tableHeader = [
		{ field: 'id', title: 'Role #' },
		{ field: 'name', title: 'Name'},
		{ field: 'alias', title: 'Alias'},
		{ field: 'actions', title: 'Actions'}
	]
	
	const RoleRow = (props) => {
		const role = props.role
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div>
							<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
						</div>
						<div className="ms-2">
							<h6 className="mb-0 font-14">{role.id.substr(0,6)}</h6>
						</div>
					</div>
				</td>
				<td>{role.name}</td>
				<td>{role.alias}</td>
				<td>
					<div className="d-flex order-actions">
						<Button variant={'light'} className="btn-sm" title="Edit user" onClick={() => editRole(role)}><i className='bx bxs-edit mx-0'/></Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Delete user" onClick={() => deleteRole(role)}><i className='bx bxs-trash mx-0'/></Button>
					</div>
				</td>
			</tr>
		)
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'User Management'} title={'Roles'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<Button type={'button'} variant={'light'} title="Reload" onClick={reloadPage}>
							{loading ? <Spinner as="span" animation={"border"} size={"sm"} aria-hidden="true"/>:<span className='bx bx-revision' style={{fontWeight:'bold'}}/>}
						</Button>
						<div className="ms-auto">
							<button type={'button'} className="btn btn-primary radius-30 mt-2 mt-lg-0" onClick={createRole}>
								<i className="bx bxs-plus-square"/>Add New Role
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table mb-0">
							<thead className="table-light">
							<tr>
								{tableHeader.map( td => {
									return(<th key={td.field}>{td.title}</th>)
								})}
							</tr>
							</thead>
							<tbody>
							{items.map(role => {
								return (
									<RoleRow role={role} key={role.id}/>
								)
							})}
							</tbody>
						</table>
					</div>
					
				</div>
			</div>
			<EditRoleModal />
			<CreateRoleModal />
		</React.Fragment>
	);
}

export default Roles