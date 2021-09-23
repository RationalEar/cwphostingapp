import React from 'react';

function GuestLayout(props) {
	return (
		<React.Fragment>
			<div className="authentication-header"/>
			{props.children}
		</React.Fragment>
	);
}

export default GuestLayout;