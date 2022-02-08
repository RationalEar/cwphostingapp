import React, {useCallback, useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import Search from "./Search";
import {Card, Col, Row} from "react-bootstrap";
import TenantSummary from "../report/TenantSummary";
import LeaseForm from "./LeaseForm";
import {initialValues} from "../../admin/leases/leaseFields";
import {useDispatch} from "react-redux";
import {setInfo, setWarning} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import Breadcrumbs from "../../misc/Breadcrumbs";

function CreateLease(){
	const {id} = useParams()
	const [user, setUser] = useState(null)
	const dispatch = useDispatch()
	const [alert, setAlert] = useState('')
	const [leaseOptions, setLeaseOptions] = useState([])
	const [leaseOptionsFetched, setLeaseOptionsFetched] = useState(false)
	
	const setupUser = (data) =>{
		initialValues.tenantId = data.id
		setUser(data)
	}
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		setAlert('')
		window.axios.post('lease', form)
			.then(response => {
				dispatch(setInfo(response.data.message))
			})
			.catch((error) => {
				const e = get_axios_error(error)
				setAlert(e.message)
				FormikBag.setSubmitting(false)
			})
	}
	
	const getLeaseOptions = useCallback(()=>{
		setLeaseOptionsFetched(true)
		window.axios.get("lease/config")
			.then(response=>{
				setLeaseOptions(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
		
	},[dispatch])
	
	useEffect(()=>{
		if(!leaseOptionsFetched){
			getLeaseOptions()
		}
	}, [getLeaseOptions, leaseOptionsFetched])
	
	if(id) return (
		<React.Fragment>
			<Breadcrumbs category={'Lease Management'} title={'Leases'}>
				<NavLink to={'/leases/start'} className="btn btn-outline-secondary"> Back </NavLink>
			</Breadcrumbs>
			<Row className="row-cols-1 row-cols-2">
				<Col xs={12} md={4}>
					<TenantSummary id={id} tenantReady={setupUser} showReportButtons={false}/>
				</Col>
				<Col xs={12} md={8}>
					<Card className="border-top border-0 border-4 border-danger">
						<Card.Body className="p-3 pt-2">
							<Card.Title className="d-flex align-items-center mb-0">
								<span className="text-danger">Your Info</span>
							</Card.Title>
							<hr />
							{!!user && leaseOptionsFetched && <LeaseForm
								initialValues={initialValues}
								handleSubmit={handleSubmit}
								leaseOptions={leaseOptions}
								alert={alert}
								setAlert={setAlert}
								title={'Create New Lease'}
								buttonText={'Create Lease'}
								tenant={user}
							/>}
							{!user && <div className="m-5 py-5">Loading tenant details, please wait...</div>}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</React.Fragment>
	)
	else return (
		<Search />
	)
}

export default CreateLease