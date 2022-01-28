import React, {useState} from "react";
import {ProgressBar, Toast} from "react-bootstrap";

function PausableToast(props){
	const [paused, setPaused] = useState(false)
	const message = props.message
	
	const toggle = () => {
		setPaused(prevState => !prevState)
	}
	
	return(
		<Toast className={paused?'paused':'not-paused'} bg={message.flag} onClick={toggle} onClose={()=>props.removeMessage(message.id)} onAnimationEnd={()=>props.removeMessage(message.id)}>
			<ProgressBar />
			<Toast.Header>
				<strong className="me-auto">{message.flag === 'danger' ? 'Error' : message.flag} Message</strong>
				<small className="text-muted">just now</small>
			</Toast.Header>
			<Toast.Body className="text-dark">{message.message}</Toast.Body>
		</Toast>
	)
}

export default PausableToast