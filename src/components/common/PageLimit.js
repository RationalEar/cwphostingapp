import React from "react";
import {Dropdown} from "react-bootstrap";

function PageLimit(props){
	
	return(
		<Dropdown>
			<span>Items per page </span>
			<Dropdown.Toggle variant="light" className="text-dark">{props.pageLimit}</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => props.setPageLimit(5)}>5</Dropdown.Item>
				<Dropdown.Item onClick={() => props.setPageLimit(10)}>10</Dropdown.Item>
				<Dropdown.Item onClick={() => props.setPageLimit(20)}>20</Dropdown.Item>
				<Dropdown.Item onClick={() => props.setPageLimit(40)}>40</Dropdown.Item>
				<Dropdown.Item onClick={() => props.setPageLimit(50)}>50</Dropdown.Item>
				<Dropdown.Item onClick={() => props.setPageLimit(100)}>100</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default PageLimit