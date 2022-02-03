import React, {useContext} from "react";
import {AccordionContext, useAccordionButton} from "react-bootstrap";

function LandlordHeaderButton({ eventKey, callback }) {
	const { activeEventKey } = useContext(AccordionContext);
	
	const decoratedOnClick = useAccordionButton(
		eventKey,
		() => callback && callback(eventKey),
	);
	
	const isCurrentEventKey = activeEventKey === eventKey;
	
	if(isCurrentEventKey){
		return (
			<span onClick={decoratedOnClick} className="bg-primary text-light px-1 rounded-bottom position-absolute end-0 cursor-pointer" style={{bottom: '-20px'}}>
				Hide Stats
			</span>
		)
	}
	else return (
		<span onClick={decoratedOnClick} className="bg-primary px-1 text-light rounded-bottom position-absolute end-0 cursor-pointer" style={{bottom: '-22px'}}>
			Show Stats
		</span>
	)
}

export default LandlordHeaderButton