import React from "react";
import {ToastContainer} from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import {removeToast} from '../../features/notifications/NotificationSlice'
import "./Notifications.css"
import PausableToast from "./PausableToast";

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
					<PausableToast
						key={message.id}
						message={message}
						removeMessage={removeMessage}
					/>
				)
			})}
		</ToastContainer>
	)
}

export default Notifications