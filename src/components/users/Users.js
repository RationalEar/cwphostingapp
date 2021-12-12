import React, {useCallback, useEffect, useState} from 'react';
import Breadcrumbs from "../misc/Breadcrumbs";
import {debounce} from "lodash";
import Pagination from "../common/Pagination";
import PageLimit from "../common/PageLimit";
import './Users.css'
import {Button} from "react-bootstrap";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import {useDispatch} from "react-redux";
import {setInfo, setSuccess, setWarning} from "../../features/notifications/NotificationSlice";
import {get_axios_error, useQuery} from "../../helpers/general";
import CreateUser from "./CreateUser";
import {useHistory} from "react-router-dom";

function Users() {
	
	const convertSort = (data) => {
		let sortObj = data;
		if( data && (typeof data === 'string' || data instanceof String) ){
			const exploded = data.split(':');
			if(exploded && exploded.length > 1){
				sortObj = {field: exploded[0], dir: exploded[1]}
				return sortObj;
			}
		}
		return { field: 'created', dir: 'asc' }
	}
	
	const history = useHistory()
	const query = useQuery();
	const [items, setItems] = useState([])
	const [roles, setRoles] = useState([])
	const [pageCount, setPageCount] = useState(0)
	const [pageLimit, setPageLimit] = useState(query.get('limit') || 10 )
	const [pageOffset, setPageOffset] = useState(query.get('page') || 0)
	const [totalItems, setTotalItems] = useState(0)
	const [sort, setSort] = useState(convertSort(query.get('sort')))
	const [filter, setFilter] = useState('')
	const [user, setUser] = useState(null)
	
	const [show, setShow] = useState(false);
	const [edit, setEdit] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	
	const dispatch = useDispatch()
	
	const onUpdateUser = u => {
		const list = JSON.parse(JSON.stringify(items))
		const index = list.findIndex( item => item.id === u.id )
		if (index >= 0) {
			list[index] = u
			setItems(list)
		}
	}
	
	const getUsers = useCallback((page=false, limit=false) => {
		if(limit===false) limit = pageLimit
		
		let sortObj = sort;
		if( sort && (typeof sort === 'string' || sort instanceof String) ){
			const exploded = sort.split(':');
			if(exploded && exploded.length > 1){
				sortObj = {field: exploded[0], dir: exploded[1]}
			}
		}
		if(page===false) page = pageOffset
		const params = { page: page, limit: limit, sort: sortObj.field + ':' + sortObj.dir}
		if(filter) params.filter = filter
		window.axios.get('users', {params:params})
			.then(response=>{
				setItems(response.data.items)
				setPageCount(response.data.totalPages)
				setPageOffset(response.data.currentPage)
				setTotalItems(response.data.totalItems)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
	},[dispatch, filter, pageLimit, pageOffset, sort])
	
	const resendActivationToken = (user) => {
		window.axios.post( 'user/activation-token/resend', {username: user.email} )
			.then(response => {
				dispatch(setInfo(response.data.message))
			})
			.catch(error => {
				const e = get_axios_error(error)
				dispatch(setWarning(e.message))
			})
	}
	
	const sendPasswordResetToken = (user) => {
		window.axios.post( 'user/forgotten-password', {username: user.email} )
			.then(response => {
				dispatch(setInfo(response.data.message))
			})
			.catch(error => {
				const e = get_axios_error(error)
				dispatch(setWarning(e.message))
			})
	}
	
	const getRoles = useCallback(()=>{
		window.axios.get("roles")
			.then(response=>{
				setRoles(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
		
	},[dispatch])
	
	const updateStatus = (id, status) => {
		window.axios.put( "users/"+id+"/status", {status: status} )
			.then(response => {
				if(response.data.data) onUpdateUser(response.data.data)
				if(response.data.message) dispatch(setSuccess(response.data.message))
			})
			.catch(error => {
				const msg = get_axios_error(error)
				dispatch(setWarning(msg.message))
			})
	}
	
	const deleteUser = (u) => {
		const yes = window.confirm('Are you sure you want to delete the account '+u.firstName+' '+u.lastName+'?')
		if(yes){
			window.axios.delete('users', {params: {id: u.id}})
				.then(response => {
					// console.log(response.data)
					dispatch(setInfo(response.data.message))
					getUsers()
				})
				.catch(error => {
					console.log(error)
				})
		}
	}
	
	useEffect(()=>{
		if(pageLimit || sort || filter){
			getUsers()
			getRoles()
		}
	}, [pageLimit, sort, filter, getUsers, getRoles])
	
	const viewUser = (u) => {
		setEdit(false)
		setUser(u)
		handleShow(true)
	}
	
	const editUser = (u) => {
		setEdit(true)
		setUser(u)
		handleShow(true)
	}
	
	const createUser = () => {
		setEdit('new')
		handleShow(true)
	}
	
	const UserModal = function (){
		if(user){
			return (
				edit===true ? null : <ViewUser user={user} onHide={handleClose} show={show} editUser={editUser} />
			)
		}
		else return null
	}
	
	const EditModal = function (){
		if(user){
			if(user.address===null){
				user.address = {
					addressLine1: '', addressLine2: '', city: '', country: '', postcode: ''
				}
			}
			return (
				edit===false ? null : <EditUser user={user} onHide={handleClose} show={show} updateUser={onUpdateUser} roles={roles} />
			)
		}
		else return null
	}
	
	const CreateUserModal = function (){
		return edit==='new' ? <CreateUser onRefreshUsers={getUsers} onHide={handleClose} show={show} roles={roles} onRefresh={()=>getUsers(pageOffset)} /> : null
	}
	
	const StatusPill = (props) => {
		if(props.suspended===false) return (
			<button type={'button'} onClick={()=>updateStatus(props.id, true)}
					title={"Click to suspend user"}
				className="btn badge rounded-pill text-success bg-light-success p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/>
				Enabled
			</button>
		)
		
		else return (
			<button type={'button'} onClick={()=>updateStatus(props.id, false)}
					title={"Click to enable user account"}
				className="btn badge rounded-pill text-danger bg-light-danger p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/>Disabled
			</button>
		)
	}
	
	const DateString = (props) => {
		let date = new Date(props.date)
		return (
			date.toLocaleString()
		)
	}
	
	const UserRow = (props) => {
		const user = props.user
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div>
							<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
						</div>
						<div className="ms-2">
							<h6 className="mb-0 font-14">{user.id.substr(0,6)}</h6>
						</div>
					</div>
				</td>
				<td>{user.firstName} {user.lastName}</td>
				<td>
					<StatusPill suspended={user.suspended} id={user.id} />
				</td>
				<td>
					{user.roles.map(role => role.name).join()}
				</td>
				<td>
					<DateString date={user.created} />
				</td>
				<td>
					<Button className="btn btn-primary btn-sm radius-30 px-4" onClick={() => viewUser(user)}>
						View Details
					</Button>
				</td>
				<td>
					<div className="d-flex order-actions">
						<Button variant={'light'} className="btn-sm" title="Edit user" onClick={() => editUser(user)}><i className='bx bxs-edit mx-0'/></Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Resend Activation Token Email" onClick={() => resendActivationToken(user)}>
							<i className='bx bxs-envelope mx-0'/>
						</Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Resend Password Reset Email" onClick={() => sendPasswordResetToken(user)}>
							<i className='bx bxs-key mx-0'/>
						</Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Delete user" onClick={() => deleteUser(user)}><i className='bx bxs-trash mx-0'/></Button>
					</div>
				</td>
			</tr>
		)
	}
	
	const search = debounce((term)=>{
		setFilter(term)
	}, 800, {trailing: true})
	
	const handleSearchChange = (e) => {
		const term = e.target.value
		search(term)
	}
	
	const updateHistory = (field, value) => {
		query.set(field, value)
		const search = query.toString()
		history.push({
			pathname: window.location.pathname,
			search: search
		})
	}
	
	const handlePageClick = (event) => {
		updateHistory("page", event.selected)
		getUsers(event.selected)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		updateHistory("limit", l)
	}
	
	const tableHeader = [
		 { field: 'id', title: 'User #', sort: false },
		{ field: 'name', title: 'Name', sort: true},
		{ field: 'status', title: 'Status', sort: false},
		{ field: 'roles', title: 'Role', sort: false},
		{ field: 'created', title: 'Date Created', sort: true },
		{ field: 'details', title: 'View Details', sort: false},
		{ field: 'actions', title: 'Actions', sort: false}
	]
	
	const changeSort = (field) => {
		if( field === sort.field ){
			const dir = sort.dir==='asc' ? 'desc' : 'asc';
			setSort({ field: field, dir: dir })
			updateHistory( "sort", field + ":" + dir )
		}
		else{
			updateHistory( "sort", field + ":asc" )
			setSort({ field: field, dir: 'asc' })
		}
	}
	
	const SortIcon = props => {
		if(props.sort){
			if( props.field === sort.field ){
				const dir = sort.dir==='asc' ? 'bx bx-sort-down' : 'bx bx-sort-up'
				return (
					<span className="hover" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
						{props.title} <i className={'fadeIn animated '+dir} />
					</span>
				)
			}
			else return (
				<span className="hover" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
					{props.title}
				</span>
			)
		}
		else return <span>{props.title}</span>
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'User Management'} title={'Users'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input type="search" className="form-control ps-5 radius-30" placeholder="Search by name/email"
								onChange={handleSearchChange} onCancel={()=>setFilter(false)} />
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
						
						<PageLimit setPageLimit={updatePageLimit} pageLimit={pageLimit} />
						
						<div className="ms-auto">
							<button type={'button'} className="btn btn-primary radius-30 mt-2 mt-lg-0" onClick={createUser}>
								<i className="bx bxs-plus-square"/>Add New User
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table mb-0">
							<thead className="table-light">
							<tr>
								{tableHeader.map( td => {
									return(
										<th key={td.field}>
											<SortIcon {...td}/>
										</th>
									)
								})}
							</tr>
							</thead>
							<tbody>
							{items.map(user => {
								return (
									<UserRow user={user} key={user.id}/>
								)
							})}
							</tbody>
						</table>
					</div>
					
					<Pagination
						handlePageClick={handlePageClick}
						pageCount={pageCount} pageLimit={pageLimit} pageOffset={pageOffset}
						totalItems={totalItems} currentItems={items.length}
					/>
					<p>Page Offset: {pageOffset}</p>
				</div>
			</div>
			
			<UserModal />
			<EditModal />
			<CreateUserModal />
		</React.Fragment>
	);
}

export default Users;