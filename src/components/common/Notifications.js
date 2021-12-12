import React from "react";
import {ProgressBar, Toast, ToastContainer} from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import {removeToast} from '../../features/notifications/NotificationSlice'
import "./Notifications.css"

function Notifications(){
	
	const messages = useSelector((state) => state.notifications)
	const dispatch = useDispatch()
	
	const removeMessage = (id) => {
		dispatch(removeToast(id))
	}
	
	return(
		<ToastContainer position={'top-end'} className="mt-2 me-4">
			
			{messages.map( message => {
				return(
					<Toast bg={message.flag} key={message.id} onClose={()=>removeMessage(message.id)} onAnimationEnd={()=>removeMessage(message.id)}>
						<ProgressBar />
						<Toast.Header>
							<strong className="me-auto">{message.flag === 'danger' ? 'Error' : message.flag} Message</strong>
							<small className="text-muted">just now</small>
						</Toast.Header>
						<Toast.Body className="text-dark">{message.message}</Toast.Body>
					</Toast>
				)
			})}
		</ToastContainer>
	)
}

export default Notifications