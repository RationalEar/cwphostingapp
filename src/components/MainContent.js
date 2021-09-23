import React, {Suspense} from 'react';
import {Route, Switch} from "react-router-dom";
import routes from "../helpers/routes";
const NotFound = React.lazy(()=>import('./misc/NotFound'))

const loading = (
	<div className="py-5 text-center">
		<div className="spinner-grow" style={{width: "3rem", height: "3rem"}} role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	</div>)

function MainContent() {
	return (
		<div className="page-wrapper">
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
									render={ props => (<route.component {...props} />) }
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