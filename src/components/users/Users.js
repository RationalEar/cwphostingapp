import React, {useCallback, useEffect, useState} from 'react';
import Breadcrumbs from "../misc/Breadcrumbs";
import {debounce} from "lodash";
import Pagination from "../common/Pagination";
import PageLimit from "../common/PageLimit";
import './Users.css'
import {Button, Spinner} from "react-bootstrap";
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
		return { field: 'created', dir: 'desc' }
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
	const [filter, setFilter] = useState(query.get('filter') ||'')
	const [user, setUser] = useState(null)
	const [activationTicker, setActivationTicker] = useState({})
	const [passTicker, setPassTicker] = useState({})
	const [statusTicker, setStatusTicker] = useState({})
	const [relevance, setRelevance] = useState(false)
	const [loading, setLoading] = useState(false)
	const [fetched, setFetched] = useState(false)
	
	const [show, setShow] = useState(false)
	const [edit, setEdit] = useState(false)
	const handleClose = () => {
		setShow(false)
	}
	const handleShow = () => setShow(true)
	
	const dispatch = useDispatch()
	
	const onUpdateUser = u => {
		const list = JSON.parse(JSON.stringify(items))
		const index = list.findIndex( item => item.id === u.id )
		if (index >= 0) {
			setItems( prevState => {
				prevState[index] = u
				return prevState
			})
		}
	}
	
	const updateHistory = useCallback((field, value) => {
		if(value==null || value===''){
			query.delete(field)
			if(field==='filter'){
				query.delete('sort')
				setSort(convertSort(false))
			}
		}
		else query.set(field, value)
		const search = query.toString()
		const page = query.get("page")
		if(field === 'page' && page===value){
			// do nothing
			console.log("field = "+field+", value = "+value)
		}
		// else {
			history.push({
				pathname: window.location.pathname,
				search: search
			})
			setFetched(false)
		// }
	},[history, query])
	
	const getUsers = useCallback((limit=false) => {
		setFetched(true)
		const search = query.toString()
		let page = query.get("page")
		console.log("Query String: ", search)
		setLoading(true)
		if(limit===false) limit = pageLimit
		let sortObj = sort;
		if( sort && (typeof sort === 'string' || sort instanceof String) ){
			const exploded = sort.split(':');
			if(exploded && exploded.length > 1){
				sortObj = {field: exploded[0], dir: exploded[1]}
			}
		}
		if(page===null || page===false) page = pageOffset
		const params = { page: page, limit: limit, sort: sortObj.field + ':' + sortObj.dir}
		if(filter) params.filter = filter
		else setRelevance(false)
		window.axios.get('users', {params:params})
			.then(response=>{
				setItems(response.data.items)
				setPageCount(response.data.totalPages)
				const currentPage = response.data.currentPage <= response.data.totalPages ? response.data.currentPage : 0
				//updateHistory('page', currentPage)
				setPageOffset(currentPage)
				console.log("Current Page = ", currentPage)
				console.log("Page Offset = ", pageOffset)
				setTotalItems(response.data.totalItems)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
			.finally(()=>{
				setLoading(false)
			})
	},[dispatch, filter, pageLimit, pageOffset, sort, updateHistory])
	
	const resendActivationToken = (user) => {
		setActivationTicker((prevState) => ({
			...prevState,
			[user.id]: true,
		}));
		window.axios.post( 'user/activation-token/resend', {username: user.email} )
			.then(response => {
				dispatch(setInfo(response.data.message))
			})
			.catch(error => {
				const e = get_axios_error(error)
				dispatch(setWarning(e.message))
			})
			.finally(()=>{
				setActivationTicker((prevState) => ({
					...prevState,
					[user.id]: false,
				}))
			})
	}
	
	const sendPasswordResetToken = (user) => {
		setPassTicker((prevState) => ({
			...prevState,
			[user.id]: true,
		}));
		window.axios.post( 'user/forgotten-password', {username: user.email} )
			.then(response => {
				dispatch(setInfo(response.data.message))
			})
			.catch(error => {
				const e = get_axios_error(error)
				dispatch(setWarning(e.message))
			})
			.finally(()=>{
				setPassTicker((prevState) => ({
					...prevState,
					[user.id]: false,
				}));
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
		setStatusTicker((prevState) => ({
			...prevState,
			[id]: true,
		}));
		window.axios.put( "users/"+id+"/status", {status: status} )
			.then(response => {
				if(response.data.data) onUpdateUser(response.data.data)
				if(response.data.message) dispatch(setSuccess(response.data.message))
			})
			.catch(error => {
				const msg = get_axios_error(error)
				dispatch(setWarning(msg.message))
			})
			.finally(()=>{
				setStatusTicker((prevState) => ({
					...prevState,
					[id]: false,
				}));
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
		if(!fetched){
			console.log("loaded via useEffect.")
			getUsers()
			getRoles()
		}
	}, [getUsers, getRoles, fetched])
	
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
		return edit==='new' ? <CreateUser onRefreshUsers={getUsers} onHide={handleClose} show={show} roles={roles} onRefresh={()=>getUsers()} /> : null
	}
	
	const DateString = (props) => {
		let date = new Date(props.date)
		return (
			date.toLocaleString()
		)
	}
	
	const isActive = (id) => {
		if( activationTicker!==undefined && id in activationTicker ) return activationTicker[id]
		return false
	}
	
	const isResettingPass = (id) => {
		if( passTicker!==undefined && id in passTicker ) return passTicker[id]
		return false
	}
	
	const isToggling = (id) => {
		if( statusTicker!==undefined && id in statusTicker ) return statusTicker[id]
		return false
	}
	
	const StatusPill = (props) => {
		if(props.suspended===false) return (
			<button type={'button'} onClick={()=>updateStatus(props.id, true)}
					title={"Click to suspend user"}
					className="btn badge rounded-pill text-success bg-light-success p-2 text-uppercase">
				{isToggling(props.id) ? <Spinner as="i" animation={"grow"} size={"sm"} aria-hidden="true"/> : <i className='bx bxs-circle me-1'/>}
				Enabled
			</button>
		)
		
		else return (
			<button type={'button'} onClick={()=>updateStatus(props.id, false)}
					title={"Click to enable user account"}
					className="btn badge rounded-pill text-danger bg-light-danger p-2 text-uppercase">
				{isToggling(props.id) ? <Spinner as="i" animation={"grow"} size={"sm"} aria-hidden="true"/> : <i className='bx bxs-circle me-1'/>}
				Disabled
			</button>
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
						{isActive(user.id) ?
							<Button variant={'light'} className="btn-sm" title="Resend Activation Token Email" disabled>
								<Spinner as="span" animation={"border"} size={"sm"} aria-hidden="true"/>
							</Button> :
							<Button variant={'light'} className="btn-sm" title="Resend Activation Token Email"
								 onClick={() => resendActivationToken(user)}>
								<i className={user.activated?'bx bxs-envelope mx-0':'bx bxs-envelope mx-0 text-danger'}/>
							</Button>
						}
						&nbsp;
						{isResettingPass(user.id) ?
							<Button variant={'light'} className="btn-sm" title="Resend Password Reset Email" disabled>
								<Spinner as="span" animation={"border"} size={"sm"} aria-hidden="true"/>
							</Button> :
							<Button variant={'light'} className="btn-sm" title="Resend Password Reset Email" onClick={() => sendPasswordResetToken(user)}>
								<i className='bx bxs-key mx-0'/>
							</Button>
						}
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Delete user" onClick={() => deleteUser(user)}><i className='bx bxs-trash mx-0'/></Button>
					</div>
				</td>
			</tr>
		)
	}
	
	const search = debounce((term)=>{
		setFilter(term)
		const filter = query.get("filter")
		if(!filter) query.set("page", 0)
		updateHistory("filter", term)
	}, 800, {trailing: true})
	
	const handleSearchChange = (e) => {
		const term = e.target.value
		search(term)
	}
	
	const handlePageClick = (event) => {
		console.log('page clicked')
		updateHistory("page", event.selected)
		//getUsers(event.selected)
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
		setRelevance(false)
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
	
	const searchSort = ()=>{
		updateHistory( "sort",  "relevance:desc" )
		setSort({ field: 'relevance', dir: 'desc' })
		setRelevance(true)
	}
	
	const SortIcon = props => {
		if(props.sort){
			if( props.field === sort.field ){
				const dir = sort.dir==='desc' ? 'bx bx-sort-down' : 'bx bx-sort-up'
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
	
	function reloadPage() {
		getUsers()
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'User Management'} title={'Users'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input type="search" className="form-control ps-5 radius-30" placeholder="Search by name/email"
								onChange={handleSearchChange} onCancel={()=>setFilter(false)} defaultValue={filter} />
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
						{filter && <span>
							<Button type={'button'} variant={'link'} className="btn-sm text-decoration-none" onClick={searchSort}>
								Sort by relevance {relevance && <i className="bx bx-sort-down"/>}
							</Button>
						</span>}
						<PageLimit setPageLimit={updatePageLimit} pageLimit={pageLimit} />
						<Button type={'button'} variant={'light'} title="Reload" onClick={reloadPage}>
							{loading ? <Spinner as="span" animation={"border"} size={"sm"} aria-hidden="true"/>:<span className='bx bx-revision' style={{fontWeight:'bold'}}/>}
						</Button>
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
					
					{pageCount>0?<Pagination
						handlePageClick={handlePageClick}
						pageCount={pageCount} pageLimit={pageLimit} pageOffset={pageOffset}
						totalItems={totalItems} currentItems={items.length}
					/>:null}
				</div>
			</div>
			
			<UserModal />
			<EditModal />
			<CreateUserModal />
		</React.Fragment>
	);
}

export default Users;