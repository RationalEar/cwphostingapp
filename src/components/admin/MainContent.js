import React, {Suspense} from 'react';
import {Route, Switch} from "react-router-dom";
import routes from "../../helpers/routes";
import LandlordHeader from "../client/landlord/LandlordHeader";
import Page from "./Page";
const NotFound = React.lazy(()=>import('../misc/NotFound'))

const loading = (
	<div className="py-5 text-center">
		<div className="spinner-grow" style={{width: "3rem", height: "3rem"}} role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	</div>)

function MainContent({profile}) {
	return (
		<div className="page-wrapper">
			{profile.role.name==='MANAGER' && <LandlordHeader/>}
			<div className="page-content">
				<Suspense fallback={loading}>
					<Switch>
						{routes.map((route, index) => {
							return route.component && (
								<Route
									key={index}
									path={route.path}
									exact={route.exact}
									name={route.name}
									render={ props => (<Page title={route.name}><route.component {...props} /></Page>) }
								/>
							)
						})}
						<Route component={NotFound} />
					</Switch>
				</Suspense>
			</div>
		</div>
	);
}

export default React.memo(MainContent);